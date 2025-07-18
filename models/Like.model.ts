import mongoose, { mongo, Schema } from "mongoose";

export interface ILike {
    user: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
}

const likeSchema=new Schema<ILike>({
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
})

const Like = mongoose.models?.Like || mongoose.model("Like", likeSchema);

export default Like;
