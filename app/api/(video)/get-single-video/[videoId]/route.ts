import { DBConnect } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest)
{
    try {

        const {searchParams} = new URL(req.url);

        const queryParam = {
            videoId:searchParams.get("videoId")
        };

        await DBConnect();

        const videos = await Video.findOne({_id:queryParam.videoId});

        if(!videos)
        {
            return nextError(400,"No Video Found")
        };

        return NextResponse.json(
                new ApiResponse(200,"Fetched Videos Successfully",videos),{status:200}
            )

    } catch (error) {
        return NextResponse.json(
                new ApiError(500,"Fetched Videos Failed !"),{status:500}
            )
    }
}