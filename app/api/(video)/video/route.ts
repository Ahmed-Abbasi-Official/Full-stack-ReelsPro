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
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await DBConnect();

  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?._id;

  try {
    const videos = await Video.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "owner"
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likedUserDocs"
        }
      },
      {
        $addFields: {
          likes: { $size: { $ifNull: ["$likedUserDocs", []] } },
          likedUserIds: {
            $map: {
              input: "$likedUserDocs",
              as: "like",
              in: "$$like.user"
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "likedUserIds",
          foreignField: "_id",
          as: "LikedUserInfo"
        }
      },
      ...(loggedInUserId
        ? [
            {
              $lookup: {
                from: "subscribes",
                let: { videoOwner: "$user" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$subscribedTo", "$$videoOwner"] },
                          { $eq: ["$subscriber", new mongoose.Types.ObjectId(loggedInUserId)] }
                        ]
                      }
                    }
                  }
                ],
                as: "subscriptionInfo"
              }
            },
            {
              $addFields: {
                isSubscribed: {
                  $cond: {
                    if: { $gt: [{ $size: "$subscriptionInfo" }, 0] },
                    then: true,
                    else: false
                  }
                }
              }
            }
          ]
        : [
            {
              $addFields: {
                isSubscribed: false
              }
            }
          ]),
      {
        $project: {
          owner: {
            $map: {
              input: "$owner",
              as: "o",
              in: {
                username: "$$o.username",
                profilePic: "$$o.profilePic"
              }
            }
          },
          LikedUsers: {
            $map: {
              input: "$LikedUserInfo",
              as: "o",
              in: {
                username: "$$o.username",
                profilePic: "$$o.profilePic"
              }
            }
          },
          videoUrl: 1,
          views: 1,
          likes: 1,
          user: 1,
          isSubscribed: 1
        }
      }
    ]);

    return NextResponse.json(
      new ApiResponse(200, "Fetched Videos Successfully", videos),
      { status: 200 }
    );
  } catch (error) {
    return nextError(500, "Internal Server Error", error);
  }
}


export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        new ApiError(401, "Unauthorized"), { status: 401 }
      )
    }



    await DBConnect();

    const body: IVideo = await req.json();


    if (
      !body.title ||
      !body.videoUrl ||
      !body.description
    ) {
      return nextError(400, "Required missing field!")
    }



    const videoData = {
      ...body,
      isPublic: body.isPublic ?? true,
      transformation: {
        height: 1920,
        width: 1080,
      },
      user: session.user._id

    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(
      new ApiResponse(200, "Video Fetxhed Successfully", newVideo), { status: 200 }
    );

  } catch (error) {
    return nextError(500, "Internal server error", error)
  }
};

export const DELETE = asyncHandler(async (req: NextRequest): Promise<NextResponse> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      new ApiError(401, "Unauthorized"), { status: 401 }
    )
  }
  const data = await req.json();


  if (!data.videoId) {
    return nextError(400, "Give me video ID");
  }

  if (!mongoose.Types.ObjectId.isValid(data.videoId)) {
    return nextError(400, "Invalid video ID");
  }

  console.log(data.videoId)

  const video = await Video.findOne({ _id: new mongoose.Types.ObjectId(data.videoId) })
  console.log(video)
  console.log("Sesision", session)

  if (video.user._id === session.user?._id) {
    return nextError(400, "You are not allowed to delete video");
  };

  const [videoResult, commentResult, likeResult] = await Promise.all([
    Video.deleteOne({ _id: data.videoId }),
    Comment.deleteMany({ video: data.videoId }),
    Like.deleteMany({ video: data.videoId }),
  ]);

  if (
    videoResult.deletedCount === 0 &&
    commentResult.deletedCount === 0 &&
    likeResult.deletedCount === 0
  ) {
    return nextError(404, "No related data found to delete.");
  }

  return NextResponse.json({
    success: true,
    message: "Video deleted successfully",
    deleted: {
      video: videoResult.deletedCount,
      comments: commentResult.deletedCount,
      likes: likeResult.deletedCount,
    },
  });
});
