import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSIONS =
    {
        width: 1080,
        height: 1920,
    } as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    videoUrl: string;
    views: number;
    isPublic?: boolean;
    transformation: {
        width: number;
        height: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
    user: mongoose.Types.ObjectId;
    isChecked:boolean;
    isLiked:boolean;
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
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        isChecked:{
            type:Boolean,
            default:false
        },
        isLiked:{
            type:Boolean,
            default:false,
        }
    }, { timestamps: true }
);

const Video = models?.Video || model<IVideo>('Video', videoSchema);

export default Video;

