import mongoose, { mongo, Schema } from "mongoose";
import { required } from "zod/v4-mini";

export interface IPlaylist{
    playlistName:string;
    videos:mongoose.Schema.Types.ObjectId[];
    user:mongoose.Schema.Types.ObjectId;
}

const playlistSchema = new Schema<IPlaylist>({
    playlistName:{
        type:String,
        required:[true,"Name is required"]
    },
    videos:[
        {
        type:Schema.Types.ObjectId,
        ref:"Video",
        index:true
    }
    ],
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        index:true
    },

})


const Playlist = mongoose.models?.PlaylistName || mongoose.model("PlaylistName",playlistSchema);

export default Playlist;