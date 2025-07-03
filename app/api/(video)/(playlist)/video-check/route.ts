import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Playlist from "@/models/Playlist.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const  GET = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{

    const {searchParams} = new URL(req.url);

    const videoId = searchParams.get("videoId");

    
        

    return nextResponse(200,"Get")
})
