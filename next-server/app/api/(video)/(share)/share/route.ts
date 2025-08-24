import { Message } from "@/models/Message.models";
import User from "@/models/User";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { DBConnect } from "@/lib/db";
import Subscription from "@/models/Subscription.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
    await DBConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return nextError(404, "Please Login First!");
    };

    const userId = session?.user?._id;

    // 1. Get subscriptions: you follow OR they follow you
    const subscriptions = await Subscription.find({
        $or: [
            { subscriber: userId },
            { channel: userId }
        ]
    });

    // 2. Extract unique otherUserIds
    const otherUserIds = new Set<string>();
    subscriptions.forEach(sub => {
        const otherId = sub.subscriber.toString() === userId ? sub.channel.toString() : sub.subscriber.toString();
        if (otherId !== userId) otherUserIds.add(otherId);
    });


    // 3. Build list with last messages
    const results:any = await Promise.all(
        Array.from(otherUserIds).map(async (otherId) => {
            const lastMessage:any = await Message.findOne({
                $or: [
                    { sender: userId, receiver: otherId },
                    { sender: otherId, receiver: userId },
                ]
            })
                .sort({ createdAt: -1 })
                .lean();

            const user = await User.findById(otherId).select("username profilePic").lean();

            return {
                user,
                lastMessageTime: lastMessage?.createdAt || new Date(0)
            };
        })
    );

    // 4. Sort by latest message time
    results.sort((a:any, b:any) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

    // 5. Send response
    return nextResponse(200, results);
});

export const POST = asyncHandler(async(req:NextRequest):Promise<NextResponse>=>{

     const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return nextError(404, "Please Login First!");
    };

    const sender = session?.user?._id;


    const {reciverId,videoUrl} = await req.json();
    console.log(reciverId,videoUrl)

    if(!reciverId || !videoUrl){
        return nextError(400,'Missing Required Fields!');
    }

    await DBConnect();

     const sendMessage = await Message.create({
        sender,
        receiver:reciverId,
        message:videoUrl
    })

    if(!sendMessage){
        return nextError(400,"Error in Sharing Video");
    }




    return nextResponse(200,"Video Shared Sucessfully!");
})
