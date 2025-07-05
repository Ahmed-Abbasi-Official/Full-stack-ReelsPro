import { DBConnect } from "@/lib/db";
import Video from "@/models/Video";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
await DBConnect()
    const { searchParams } = new URL(req.url);

    const videoId = searchParams.get("videoId");

    console.log("videoId",videoId)

    if (!videoId) {
        return nextError(400, "Missing required fields");
    };


    const updated = await Video.findByIdAndUpdate(
  new mongoose.Types.ObjectId(videoId),
  { $inc: { views: 1 } },
  { new: true }
);

if (!updated) {
  return nextError(404, "Video not found");
}


    return nextResponse(200, "");
})