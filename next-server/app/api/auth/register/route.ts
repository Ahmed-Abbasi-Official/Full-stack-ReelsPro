import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { DBConnect } from "@/lib/db";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { usernameValidation } from "@/schemas/registerSchema";
import { nextError, nextResponse } from "@/utils/Response";
import { sendVerificationCode } from "@/lib/mailer/nodemailer";
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {

    try {
        const { username, email, password , profilePic } = await request.json();

        if (!email || !password) {
            const response = new ApiError(400, "Email and password are required");

            return NextResponse.json(
                response, { status: 400 }
            )
        };




        // USERNAME Checking By ZOD

        const checkingUsernameUniqueness = usernameValidation.safeParse({ username });



        if (!checkingUsernameUniqueness.success) {
            const error = checkingUsernameUniqueness.error.format().username?._errors[0]
            return nextResponse(400, error as string, "")
        }

        // CHECK USERNAME ALREADY EXIST OR NOT ;

        await DBConnect();

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            
            return nextError(409, "username already exist")
        }

        console.log("first")

        // CHECKING FOR EMAIL AND CREATE CODE ;

        const existingEmail = await User.findOne({ email });
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingEmail) {
            if (existingEmail.isVerified) {
                return nextError(409, 'email already exist')
            } else {
                existingEmail.username = username;
                existingEmail.password = password;
                existingEmail.markModified('password');
                existingEmail.code = code;
                profilePic ;
                existingEmail.codeExpiry = new Date(Date.now() + 60000); // 60 seconds
                await existingEmail.save();
                // console.log(existingEmail)
            }




        } else {
            const codeExpiry = new Date();
            codeExpiry.setSeconds(codeExpiry.getSeconds() + 60);


            const newUser = new User({
                email,
                username,
                password,
                code,
                codeExpiry,
                profilePic: profilePic,
                isVerified: false
            })

            await newUser.save();
            // console.log(newUser)
        }


        console.log('yaha tk aya')
        // NOW VERIFICATION SETUP ;

        const sendMessage = await sendVerificationCode(email, code);

        if (!sendMessage) {
            return nextError(400, "Error in Sending Message");
        }

        return NextResponse.json(
            new ApiResponse(201, "User Registered Successfully Plaease veriy your email")
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: `Error in Register Route : ${error}`
            }, { status: 500 }
        )
    }
}