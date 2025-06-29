import mongoose, { Schema } from "mongoose";

export interface IComment {
    comment: string;
    user: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
    comment: {
        type: String,
        required: [true, "comment must be required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true

    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true
    }
});

const Comment =mongoose.models?.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;


