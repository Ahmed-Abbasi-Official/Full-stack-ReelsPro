import { DBConnect } from "@/lib/db";
import Video from "@/models/Video";
import { ApiResponse } from "@/utils/ApiResponse";
import { nextError } from "@/utils/Response";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const loggedInUserId = session?.user?._id;
    await DBConnect();
    try {

        const { searchParams } = new URL(req.url);

        const videoId = searchParams.get("videoId");

        if (!videoId) {
            return nextError(400, "Missing required fields!");
        };


        const videos = await Video.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likedUserDocs"
                }
            },
            {
                $lookup:
                {
                    from: "comments",
                    localField: "_id",
                    foreignField: "videoId",
                    as: "TComments"
                }
            },
            {
                $addFields: {
                    likes: { $size: { $ifNull: ["$likedUserDocs", []] } },
                    likedUserIds: {
                        $map: {
                            input: "$likedUserDocs",
                            as: "like",
                            in: "$$like.user"
                        }
                    },
                    
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "likedUserIds",
                    foreignField: "_id",
                    as: "LikedUserInfo"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    let: { videoOwner: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$channel", "$$videoOwner"] },
                                        { $eq: ["$subscriber", new mongoose.Types.ObjectId(loggedInUserId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "subscriptionInfo"
                }
            },
            {
                $project: {
                    owner: {
                        $map: {
                            input: "$owner",
                            as: "o",
                            in: {
                                username: "$$o.username",
                                _id: "$$o._id",
                                profilePic: "$$o.profilePic"
                            }
                        }
                    },
                    LikedUsers: {
                        $map: {
                            input: "$LikedUserInfo",
                            as: "o",
                            in: {
                                username: "$$o.username",
                                profilePic: "$$o.profilePic"
                            }
                        }
                    },
                    TotalComment: { $size: "$TComments" },
                    videoUrl: 1,
                    views: 1,
                    likes: 1,
                    title: 1,
                    description: 1,
                    user: 1,
                    // isLiked: 1,
                    isSubscribed: {
                        $cond: {
                            if: { $gt: [{ $size: "$subscriptionInfo" }, 0] },
                            then: true,
                            else: false
                        }
                    },
                    isLiked: {
                        $in: [
                            { $toString: loggedInUserId },
                            {
                                $map: {
                                    input: { $ifNull: ["$LikedUserInfo", []] },
                                    as: "o",
                                    in: { $toString: "$$o._id" }
                                }
                            }
                        ]
                    }
                }
            }
        ]);



        return NextResponse.json(
            new ApiResponse(200, "Fetched Single Video Successfully", videos), { status: 200 }
        )

    } catch (error) {
        // console.log(error)
        return nextError(500, "Internal Server Error", error)
    }
}