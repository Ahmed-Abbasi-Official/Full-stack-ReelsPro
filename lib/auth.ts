import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { DBConnect } from "./db";
import User from "@/models/User"; // Mongoose model

// Define extended user shape
interface ExtendedUser {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  profilePic:string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await DBConnect();

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email }, // using email field for both
            ],
          });

          if (!user) throw new Error("No User Found!");
          if (!user.isVerified) throw new Error("Please verify your account first");

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // console.log("userPass : ",user.password , "Cre : ",credentials.password)

          if (!isPasswordCorrect) throw new Error("Incorrect Password");

          return user;
        } catch (error: any) {
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as ExtendedUser;
        token._id = u._id;
        token.username = u.username;
        token.isVerified = u.isVerified;
        token.profilePic = u.profilePic;
      }
      return token;
    },

    async session({ session, token }:any) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.profilePic = token.profilePic as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
