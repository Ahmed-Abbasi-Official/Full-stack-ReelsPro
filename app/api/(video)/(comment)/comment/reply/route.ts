import Comment from "@/models/Comment.model";
import mongoose from "mongoose";
import Video from "@/models/Video";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";



export const POST = async (req: NextRequest):Promise<NextResponse> => {
  await DBConnect();
   const session = await getServerSession(authOptions);
  
      if (!session) {
          return nextError(401, "Please Login first!")
      }
  const { comment, videoId, parentCommentId } = await req.json();

  if (!comment || !videoId || !parentCommentId) {
    return nextError(400,"Missing requied fields!");
  }''

  const reply = await Comment.create({
    comment,
    username:session?.user?.username,
    videoId,
    parentCommentId, 
  });

  return nextResponse(200,"Reply added",reply);
};
