import { authOptions } from "@/lib/auth";
import { DBConnect } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { asyncHandler } from "@/utils/asyncHandler";
import { nextError, nextResponse } from "@/utils/Response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return nextError(401, "Please Login First!");
    };

    const userId = session?.user._id;

    const user = await User.aggregate([
        { $match: { _id: userId } },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"SubscribedTo"
            }
        },
        {
            $lookup:{
               from:"videos",
                localField:"_id",
                foreignField:"user",
                as:"videos"  
            }
        },
        {
            $addFields:{
                subscribersCount:{$size:"$subscribers"}
            }
        }

    ]);

    if (!user) {
        return nextError(400, "User not Found!");
    };



    return nextResponse(200, "User Fetched Successfully", user);

})