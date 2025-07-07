import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Like from "@/models/Like.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export const POST = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
  const session = await getServerSession(authOptions);
  await DBConnect();
  if (!session) return nextError(401, "Please login first");

  const { isLiked, videoId:id } = await req.json();
  console.log(isLiked)

  if (typeof isLiked !== "boolean" || !id) {
    return nextError(400, "Missing required fields");
  }

  const userId = session.user._id;
  const videoId = new mongoose.Types.ObjectId(id);
  if(!videoId){
    return nextError(400,"VideoId not Found!")
  }

  const existingLike = await Like.findOne({ user: userId, video: videoId });

  if (!isLiked && existingLike) {
    // Unliking the video
    await Like.deleteOne({ _id: existingLike._id });
    return nextResponse(200, "Video unliked successfully");
  }

  if (isLiked && !existingLike) {
    // Liking the video
    await Like.create({ user: userId, video: videoId });
    return nextResponse(200, "Video liked successfully");
  }

  return nextResponse(200, "No action performed");
});


export const GET = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{


    const likedVideos = await Like.find({});



    return nextResponse(200,"",likedVideos);
})