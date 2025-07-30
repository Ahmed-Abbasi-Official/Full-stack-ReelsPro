import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { nextError, nextResponse } from "@/utils/Response";
import mongoose from "mongoose";
import { DBConnect } from "@/lib/db";
import { Message } from "@/models/Message.models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user) {
        return nextError(404, "User is Unauthorized!")
    }

    const user = session?.user;
    await DBConnect();

    const leftSideBarUser = await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: new mongoose.Types.ObjectId(user?._id) },
                    { receiver: new mongoose.Types.ObjectId(user?._id) }
                ]
            }
        },
        // Add opposite user and mark if unread
        {
            $addFields: {
                otherUser: {
                    $cond: {
                        if: { $eq: ['$sender', new mongoose.Types.ObjectId(user?._id)] },
                        then: '$receiver',
                        else: '$sender'
                    }
                },
                isUnread: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$receiver", new mongoose.Types.ObjectId(user?._id)] },
                                { $eq: ["$isRead", false] }
                            ]
                        },
                        then: 1,
                        else: 0
                    }
                }
            }
        },
        // Preserve the timestamp for sorting
        {
            $addFields: {
                latestMessageTime: "$createdAt"
            }
        },
        // Lookup user details
        {
            $lookup: {
                from: 'users',
                localField: 'otherUser',
                foreignField: '_id',
                as: 'otherUserDetails'
            }
        },
        { $unwind: '$otherUserDetails' },
        // Group by other user
        {
            $group: {
                _id: '$otherUserDetails._id',
                username: { $first: '$otherUserDetails.username' },
                unreadCount: { $sum: '$isUnread' },
                latestMessageTime: { $max: '$latestMessageTime' } // Get most recent message time
            }
        },
        // Project to clean format
        {
            $project: {
                _id: 0,
                userId: '$_id',
                username: 1,
                unreadCount: 1,
                latestMessageTime: 1
            }
        },
        // Sort by latest message time (newest first)
        {
            $sort: {
                latestMessageTime: -1
            }
        }
    ]);

    if (!leftSideBarUser) {
        return nextError(400, "Error in getting Users")
    }

    return nextResponse(200, "", leftSideBarUser);
});
