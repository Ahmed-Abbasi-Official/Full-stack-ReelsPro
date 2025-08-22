import { buildCommentTree } from "@/utils/buildCommentTree";

import Comment from "@/models/Comment.model";
import mongoose from "mongoose";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
  await DBConnect();
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("videoId");
  // console.log("id of comment",id)


  if (!id) {
    return nextError(400, "reuired fields missing");
  };

  const videoId = new mongoose.Types.ObjectId(id);
  if (!videoId) {
    return nextError(400, "VideoId is Missing");
  };

  const comments = await Comment.find({ videoId }).sort({ createdAt: -1 }).populate('user',"username profilePic");
  // console.log("comments",comments)

  if (!comments) {
    return nextError(400, "Error in getting Comments");
  }


  const tree = buildCommentTree(comments);

  return nextResponse(200, "Comment Fetched Successfully!", tree);

})


export const POST = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {

  const session = await getServerSession(authOptions);

  if (!session) {
    return nextError(401, "Please Login first!")
  }

  await DBConnect();

  const { videoId, comment } = await req.json();

  // console.log(videoId, comment)

  if (!videoId || !comment) {
    return nextError(400, "Missing required fields!");
  };

  // const videoId = new mongoose.Types.ObjectId(id);
  // console.log(session?.user)

  const userId = session?.user?._id;

  const createComment = new Comment({
    comment,
    user: userId,
    videoId: new mongoose.Types.ObjectId(videoId),
    parentCommentId: null,
  });

  await createComment.save();

  if (!createComment) {
    return nextError(400, "Error in creating comment");
  };

  return nextResponse(200, "Comment Create Successfully!", createComment);

})

export const DELETE = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {

  const { commentId } = await req.json();
  console.log(commentId)

  if (!commentId) {
    return nextError(400, "Missing required fields!");
  };

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment) {
    return nextError(400, "Error in deleteing Comment");
  };

  return nextResponse(200, "Comment Delete Successfully!");

})