import mongoose, { Schema } from "mongoose";

export interface ILike {
    like: number;
    user: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
}

const likeSchema=new Schema<ILike>({
    like:{
        type:Number,
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
})

const Like = mongoose.model("Like", likeSchema);

export default Like;
