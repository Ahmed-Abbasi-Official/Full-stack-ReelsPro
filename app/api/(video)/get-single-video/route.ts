import { DBConnect } from "@/lib/db";
import Video from "@/models/Video";
import { ApiResponse } from "@/utils/ApiResponse";
import { nextError } from "@/utils/Response";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
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
                $addFields: {
                    likes: { $size: { $ifNull: ["$likedUserDocs", []] } },
                    likedUserIds: {
                        $map: {
                            input: "$likedUserDocs",
                            as: "like",
                            in: "$$like.user"
                        }
                    }
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
                $project: {
                    owner: {
                        $map: {
                            input: "$owner",
                            as: "o",
                            in: {
                                username: "$$o.username",
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
                    videoUrl: 1,
                    views: 1,
                    likes: 1
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