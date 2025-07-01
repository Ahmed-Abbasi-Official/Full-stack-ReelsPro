import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Comment from "@/models/Comment.model";
import Like from "@/models/Like.model";
import Video, { IVideo } from "@/models/Video";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
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
            !body.videoUrl ||
            !body.description
        ){
            return  nextError(400,"Required missing field!")
        }



        const videoData = {
            ...body,
            isPublic:body.isPublic ?? true,
            transformation:{
                height:1920,
                width:1080,
                quality:body.transformation?.quality ?? 100
            },
            user:session.user._id

        };

        const newVideo = await Video.create(videoData);

        return NextResponse.json(
            new ApiResponse(200,"Video Fetxhed Successfully",newVideo),{status:200}
        );

    } catch (error) {
       return nextError(500,"Internal server error",error)
    }
};

export const DELETE=asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{
    const {videoId} = await req.json();

    if(!videoId){
     return   nextError(400,"Give me video ID");
    }

     const [videoResult, commentResult, likeResult] = await Promise.all(
        [
           Video.deleteOne({_id:videoId}),
           Comment.deleteMany({video:videoId}),
           Like.deleteMany({video:videoId}) 
        ]
    );

    if(!videoResult || !commentResult || !likeResult){
       return nextError(404,"Error in Deleteting Video!");
    };

    return nextResponse(200,"Video Delete Succesfully!");

})