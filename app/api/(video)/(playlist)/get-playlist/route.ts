import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{

    const session = await getServerSession(authOptions);

    if(!session || !session?.user)
    {
        return nextError(401,"Please Login!");
    };

    const {searchParams} = new URL(req.url);

    const videoId = searchParams.get("videoId");

    if(!videoId)
    {
        return nextError(400,"Missing required fields!");
    };

    await DBConnect();

    const playlist = await Playlist.find({user:session.user._id}).lean();

    if(!playlist){
        return nextError(400,"Playlist is not found!");
    };


    const updatedPlaylist = playlist.map((pl)=>{
        return {
            ...pl,
            isChecked: pl.videos.some((p:any)=>p.toString() == videoId.toString()),
        };
    });

    // console.log(updatedPlaylist)


    return nextResponse(200,"Playlist Fetched Successfully!",updatedPlaylist);

})


