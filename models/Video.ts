import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSIONS =
    {
        width: 1080,
        height: 1920,
    } as const;

export interface IVideo {
    __id?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    videoUrl: string;
    views: number;
    isPublic?: boolean;
    transformation: {
        width: number;
        height: number;
        quality?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
    user: mongoose.Types.ObjectId;
};


const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
            default:""
        },
        videoUrl: {
            type: String,
            required: true
        },
        views: {
            type: Number,
            default:0
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        transformation: {
            height: {
                type: Number,
                default: VIDEO_DIMENSIONS.height

            },
            width: {
                type: Number,
                default: VIDEO_DIMENSIONS.width
            },
            quality: {
                type: Number,
                min: 1,
                max: 100
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true }
);

const Video = models?.Video || model<IVideo>('Video', videoSchema);

export default Video;

