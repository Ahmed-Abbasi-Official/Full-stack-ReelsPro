import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest)
{
    try {
        await DBConnect();

        const videos = await Video.find({}).sort({createdAt:-1}).lean();

        if(!videos || videos.length === 0)
        {
            return NextResponse.json(
                new ApiResponse(200,"Fetched Videos Successfully",[]),{status:200}
            )
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

export async function POST(req:NextRequest)
{
    try {

        const session = await getServerSession(authOptions);

        if(!session)
        {
            return NextResponse.json(
                new ApiError(401,"Unauthorized"),{status:401}
            )
        }


        await DBConnect();

        const body:IVideo = await req.json();

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                new ApiError(400,"Missing required Field!"),{status:400}
            )
        }

        const videoData = {
            ...body,
            controls:body.controls ?? true,
            transformation:{
                height:1920,
                width:1080,
                quality:body.transformation?.quality ?? 100
            }

        };

        const newVideo = await Video.create(videoData);

        return NextResponse.json(
            new ApiResponse(200,"Video Fetxhed Successfully",newVideo),{status:200}
        );

    } catch (error) {
        return NextResponse.json(
            new ApiError(500,"Error in Create Video !"),{status:500}
        );
    }
};