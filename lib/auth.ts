import { AuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import { DBConnect } from "./db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { ApiError } from "@/utils/ApiError";
import bcrypt from "bcryptjs";

export const authOptions:AuthOptions = {
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"email",type:"text"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials) {
                if(!credentials?.email || credentials.password)
                {
                    throw new Error("Missing email or password");
                }
                try {
                    await DBConnect();
                    const user= await User.findOne({email:credentials.email});

                    if(!user)
                    {
                       throw new Error("User not found");
                    }

                    const isValid:boolean = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isValid)
                    {
                       throw new Error("Invalid password");
                    };

                    return {
                        id:user._id.toString(),
                        email:user.email
                    };

                } catch (error) {
                    throw error; 
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user)
            {
                token.id=user.id
            }

            return token
        },
        async session({session,token}){
            if(session.user)
            {
                session.user.id = token.id as string
            }

            return session
        }
    },
    pages:{
        signIn:'/login',
        error:'/login',
    },
    session:{
        strategy:'jwt',
        maxAge:30*24*60*60,
    },
    secret:process.env.NEXTAUTH_SECRET  
}