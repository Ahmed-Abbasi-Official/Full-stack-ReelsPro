import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const POST = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{
    await DBConnect();
    const session = await getServerSession(authOptions);

    if(!session)
    {
        nextError(404,"Please Login First!");
    };

    const {playlistName} = await req.json();
    console.log(playlistName)

    if(!playlistName){
       return nextError(400,"Missing Required Fields!");
    };

    const playlist = await Playlist.findOne({playlistName});

    if(playlist){
        return nextError(400,"Already Exist")
    }

    const createPlaylist = await Playlist.create({
        user:session?.user?._id,
        playlistName,
        videos:[]
    });

    if(!createPlaylist)
    {
        return nextError(400,"Error in creating Playlist");
    };






     return nextResponse(200,"Playlist Create Successfully!");
})