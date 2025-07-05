import mongoose, { Schema, Document } from "mongoose";

export interface IComment   {
  comment: string;
  username: string;
  videoId: mongoose.Types.ObjectId;
  parentCommentId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      required: [true, "comment must be required"],
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, 
    },
  },
  { timestamps: true }
);

const Comment = mongoose.models?.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
