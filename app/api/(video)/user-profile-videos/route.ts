import { DBConnect } from "@/lib/db";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Video from "@/models/Video";
import Subscription from "@/models/Subscription.model";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
  await DBConnect();
  
  const session = await getServerSession(authOptions);


  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("_id");

  if (!userId) {
    return nextError(400, "Missing required fields!");
  }

  const ObjectId = mongoose.Types.ObjectId;

  // Step 1: Get followers & following count
 const subscriptionCounts = await Subscription.aggregate([
  {
    $facet: {
      followers: [
        { $match: { channel: new ObjectId(userId) } },
        { $count: "total" }
      ],
      following: [
        { $match: { subscriber: new ObjectId(userId) } },
        { $count: "total" }
      ],
      isSubscribed: session?.user?._id
        ? [
            {
              $match: {
                channel: new ObjectId(userId),
                subscriber: new ObjectId(session.user._id)
              }
            },
            { $count: "total" }
          ]
        : [],
    }
  },
  {
    $addFields: {
      isSubscribed: {
        $cond: {
          if: { $gt: [{ $size: "$isSubscribed" }, 0] },
          then: true,
          else: false
        }
      }
    }
  }
]);


  const user = await User.findOne({_id:userId}).select("profilePic username");

  const followersCount = subscriptionCounts[0].followers[0]?.total || 0;
  const followingCount = subscriptionCounts[0].following[0]?.total || 0;
  const isSubscribed = subscriptionCounts[0].isSubscribed || 0;

  // Step 2: Get videos of the user
  const videos = await Video.find({ user: new ObjectId(userId) });
  console.log(videos)

  return nextResponse(200, "User data fetched successfully", {
    followers: followersCount,
    following: followingCount,
    user,
    isSubscribed,
    videos
  });
});
