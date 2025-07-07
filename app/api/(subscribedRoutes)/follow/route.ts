import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import Subscription from "@/models/Subscription.model";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
   await DBConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return nextError(401, "Please Login First!");
    };

    const { channelId, isSubs } = await req.json();

    if (!channelId) {
        return nextError(400, "Missing required fields")
    };

    if(channelId === session?.user?._id)
    {
        return nextError(400,"You can subscribed yourself!");
    };

    if (isSubs) {
        await Subscription.create({
            channel: new mongoose.Types.ObjectId(channelId),
            subscriber: session?.user._id,
        });
        return nextResponse(200,"User Subscribed Successfully!")
    } else {
        await Subscription.findOneAndDelete({ channel: new mongoose.Types.ObjectId(channelId), subscriber: session?.user._id, });
        return nextResponse(200,"User UnSubscribed Successfully!")
    }
})