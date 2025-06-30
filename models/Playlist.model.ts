import mongoose, { mongo, Schema } from "mongoose";
import { required } from "zod/v4-mini";

export interface IPlaylist{
    playlistName:string;
    video:mongoose.Schema.Types.ObjectId;
}

const playlistSchema = new Schema<IPlaylist>({
    playlistName:{
        type:String,
        required:[true,"Name is required"]
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
})


const PlaylistName = mongoose.models?.PlaylistName || mongoose.model("PlaylistName",playlistSchema);

export default PlaylistName;