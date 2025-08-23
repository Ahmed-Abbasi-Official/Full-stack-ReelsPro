import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const POST = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return nextError(404, "Please Login First!");
    };

    const { videoId, playlistId } = await req.json();

    if (!videoId || !playlistId) {
        return nextError(400, "Missing required field!");
    };

    await DBConnect();

    const playlist = await Playlist.findById(playlistId);

    const isCheckedVideoIsPresent = playlist.videos.includes(videoId);

    const updatedPlaylist = isCheckedVideoIsPresent ? {
        $pull: { videos: videoId }
    } :
        {
            $push: { videos: videoId }
        }

    const updated = await Playlist.findByIdAndUpdate(playlistId, updatedPlaylist, { new: true })

    return nextResponse(200, isCheckedVideoIsPresent ? "Video Unsaved Successfully!" : "Video Save Successfully!", updated);
})