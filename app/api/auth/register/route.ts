import User from "@/models/User";
import { NextRequest , NextResponse } from "next/server";
import { DBConnect } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

export async function POST(request:NextRequest)
{
  
    try {
        const {email,password} = await request.json();

        if(!email || !password)
            {
                const response = new ApiError(400,"Email and password are required");
                
                return NextResponse.json(
                    response,{status:400}
                )
            };
            
            await DBConnect();
            
        const existingUser = await User.findOne({email});

        if(existingUser)
        {
            return NextResponse.json(
                new ApiError(404,"User Already exist"),{status:400}

            )
        }

        await User.create({
            email,password
        });

        return NextResponse.json(
            new ApiResponse(200,"User Registered Successfully")
        );

    } catch (error) {
        return NextResponse.json(
            {
                error:`Error in Register Route : ${error}`
            },{status:500}
        )
    }
}