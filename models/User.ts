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
    updatedAt?: Date;
    followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
    profilePic?:string;
};

export interface ExtendedUser {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}


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
    },
    followers:[
       { type:Schema.Types.ObjectId,
        ref:"User"}
    ],
    following:[
       { type:Schema.Types.ObjectId,
        ref:"User"}
    ],
    profilePic:{
        type:String
    }

}, { timestamps: true });

userSchema.pre("save", async function (next) {
  console.log("🚀 Pre-save triggered");

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



const User = models?.User || model<IUser>('User', userSchema);



export default User;