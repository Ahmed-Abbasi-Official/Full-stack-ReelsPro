import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { nextError, nextResponse } from "@/utils/Response";
import mongoose from "mongoose";
import { DBConnect } from "@/lib/db";
import { Message } from "@/models/Message.models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export const PATCH = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {

    // const session = await getServerSession(authOptions);
    // if (!session || !session?.user) {
    //     return nextError(404, "User is Unauthorized!")
    // }

    // const { searchParams } = new URL(req.url);

    // const username = searchParams.get("username");
    // console.log("username")

    // if (!username) {
    //     return nextError(400, "Required Missing Fileds!");
    // };

    // await DBConnect();
    // const user = await User.findOne({ username });
    // if (!user) {
    //     return nextError(400, "User not found!")
    // }
    // // console.log(user)



    // await Message.updateMany(
    //     {
    //         sender: user?._id, receiver: session?.user?._id
    //     },
    //     {
    //         $set: { isRead: true }
    //     }
    // )

console.log("username")


    return nextResponse(200, "Updated Successfully!", "");

})