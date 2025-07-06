import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import User from "@/models/User";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
    await DBConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return nextError(401, "Please Login First!");
    }

    const userId = session.user._id;

    const user = await User.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(userId) } },

  // Get subscribers
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers",
    },
  },

  // Get subscribed channels
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribedTo",
    },
  },

  // Get user's uploaded videos with totalLikes and likesCount
  {
    $lookup: {
      from: "videos",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$user", "$$userId"] }
          }
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "totalLikes"
          }
        },
        {
          $addFields: {
            likesCount: {
              $size: {
                $ifNull: ["$totalLikes", []]
              }
            }
          }
        },
        {
          $project: {
            title: 1,
            description: 1,
            _id: 1,
            createdAt: 1,
            likesCount: 1,
            totalLikes: 1,
            videoUrl:1
          }
        }
      ],
      as: "videos"
    }
  },

  

  // Get videos the user has liked
  {
    $lookup: {
      from: "likes",
      localField: "_id",
      foreignField: "user",
      as: "likedVideos"
    }
  },

  // Count calculations + total likes across all user's videos
  {
    $addFields: {
      subscribersCount: { $size: "$subscribers" },
      subscribersToCount: { $size: "$subscribedTo" },
      totalLikesCount: {
        $sum: {
          $map: {
            input: "$videos",
            as: "video",
            in: { $ifNull: ["$$video.likesCount", 0] }
          }
        }
      },
      
    }
  },

  // Final projection
  {
    $project: {
      username: 1,
      email: 1,
      subscribers: 1,
      subscribedTo: 1,
      subscribersCount: 1,
      subscribersToCount: 1,
      videos: 1,
      likedVideos: 1,
      totalLikesCount: 1
    }
  }
]);


    if (!user || user.length === 0) {
        return nextError(400, "User not Found!");
    }

    return nextResponse(200, "User Fetched Successfully", user[0]);
});
