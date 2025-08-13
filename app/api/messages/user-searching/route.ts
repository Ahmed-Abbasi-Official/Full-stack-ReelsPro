import User from "@/models/User";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { nextError, nextResponse } from "@/utils/Response";
import mongoose from "mongoose";
import { DBConnect } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {

    const session = await getServerSession(authOptions);
    const userId = session?.user?._id

    await DBConnect();
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username");


    if (!username) {
        return nextError(400, "Missing required filelds!");
    };

    const user = await User.aggregate([
        {
            $match:
            {
                username:
                    { $regex: username, $options: "i" }
            },
        },
        {
            $lookup:
            {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $lookup:
            {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber"
            }
        },
        // After your second $lookup
        {
            $addFields: {
                subscriberIds: {
                    $map: {
                        input: "$subscriber",
                        as: "s",
                        in: "$$s.subscriber"
                    }
                },
                subscribedToIds: {
                    $map: {
                        input: "$subscribedTo",
                        as: "s",
                        in: "$$s.channel"
                    }
                }
            }
        },
        {
            $addFields: {
                isFollowers: {
                    $cond: {
                        if: {
                            $or: [
                                { $in: [new mongoose.Types.ObjectId(userId), "$subscriberIds"] },
                                { $in: [new mongoose.Types.ObjectId(userId), "$subscribedToIds"] }
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                isFollowers: -1
            }
        },
        {
            $project: {
                // subscriber: 1,
                username: 1,
                profilePic:1

                // subscribedTo: 1,
            }
        }



    ])

    if (user.length === 0) {
        return nextError(400, "User not found");
    }


    return nextResponse(200, "User Fetched Sucessfully", user)
})