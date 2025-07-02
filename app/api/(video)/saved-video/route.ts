import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import Video from "@/models/Video";
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

    if (!playlistId || !videoId) {
        return nextError(400, "Missing Required Fields!");
    };

    const video = await Video.findById(videoId);

    

    await Video.findByIdAndUpdate(videoId, {
        $set: { isChecked: !video.isChecked }
    }, {
        new: true
    });

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        return nextError(400, "No Playlist Found")
    };

    const isCheckedPLalist = playlist?.videos.includes(videoId);

    const updateQuery = isCheckedPLalist
        ? {
            $pull: { video: videoId },
        }
        : {
            $push: { videos: videoId },
        };

    await Playlist.findByIdAndUpdate(playlistId, updateQuery, { new: true });

    return nextResponse(200, "Video Save Successfully!");
})