import { DBConnect } from "@/lib/db";
import User from "@/models/User";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { NextResponse } from "next/server";


export const POST = asyncHandler(async(req):Promise<NextResponse>=>{

    const {code,username} = await req.json();

    if(!code || !username){
        return nextError(400,"Guve me a code");
    };


    await DBConnect();

    const user = await User.findOne({username});

    if(!user){
        return nextError(400,"No User FOund!");
    }

  const isValid =   user.code == code;


  const notExpiryCode = new Date(user.codeExpiry) > new Date() ;

  if(!isValid){
    return nextError(400,"Invalid Code")
  };

  if(!notExpiryCode){
    return nextError(400,"code is expired")
  }

  user.isVerified = true;

  await user.save();

  return nextResponse(200,"User Verified Succesfully");

})