import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const DELETE = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{
await DBConnect();
    const session = await getServerSession(authOptions);
    
        if (!session) {
            return nextError(404, "Please Login First!");
        };

    const {playlistId} = await req.json();

    if(!playlistId){
        return nextError(400,"Missing required Fields!");
    };

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    return nextResponse(200,"Playlist Delete Successfully!",playlist);
})

