import User from "@/models/User";
import { nextError, nextResponse } from "@/utils/Response";
import { asyncHandler } from "@/utils/asyncHandler";
import { DBConnect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { usernameValidation } from "@/schemas/registerSchema";

export const POST = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{

    const {username} = await req.json();

    if(!username){
        return nextError(400,"Please Enter a username");
    }

    const result = usernameValidation.safeParse({username});
    if(!result.success)
    {
        const error = result.error.format().username?._errors[0];
        console.log(error)

        return nextError(400,error as string);
    }

    await DBConnect();


    const existingUsername = await User.findOne({username});


    if(existingUsername)
    {
        if(!existingUsername?.isVerified) {
             return nextResponse(200,"username is unique");
        }
        return nextError(409,"username already exist")
    }



    return nextResponse(200,"username is unique");
})
