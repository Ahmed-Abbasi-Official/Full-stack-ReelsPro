import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    username: string;
    email: string;
    password: string;
    code: string;
    codeExpiry: Date;
    isVerified: boolean;

    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date
};

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        index: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Verified Code Expiry is required"],
    },
    code: {
        type: String,
        required: [true, "Verified Code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    codeExpiry: {
        type: Date,
        required: [true, "Verified Code Expiry is required"],
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        await bcrypt.hash(this.password, 10);
    }
    next();
});



const User = models?.User || model<IUser>('User', userSchema);



export default User;