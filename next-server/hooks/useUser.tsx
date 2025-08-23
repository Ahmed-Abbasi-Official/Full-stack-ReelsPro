// UserContext.tsx
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useContext, createContext, ReactNode, useMemo } from "react";

interface UserContextType {
    signUpUser: UseMutationResult<any, Error, void, unknown>;
    userUnique: UseMutationResult<any, Error, string, unknown>;
    verifyOtp: UseMutationResult<any, Error, {username:string,code:string}, unknown>;
    user: IUser | null;
  loading: boolean;
};

interface IUser {
  _id?: string;
  username?: string;
  email?: string;
}

interface IUserContext {
  user: IUser | null;
  loading: boolean;
}

  //* PROFILE :

export const getUser = ()=>{
  const user = useQuery(
    {
      queryKey:["user"],
      queryFn:async()=>{
        const res = await axios.get('/api/profile');
        return res?.data;
      }
    }
  )
  return {user};
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export type UniqueUsernameError = {
  message: string;
};


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();

    //* CHECK USERNAME UNIQUE :

    const userUnique = useMutation({
        mutationFn: async (username: string) => {
            const res = await axios.post(`/api/auth/check-unique-username`, { username:username });
            return res.data;
        }
    });

    //* SIGNUP USER :

    const signUpUser = useMutation({
        mutationFn: async (data:void) => {
            console.log(data)
            // your signup logic here
            const res = await axios.post('/api/auth/register',data)
            return res.data;
        },
    });

    //* VRIFY OTP :

    const verifyOtp = useMutation(
        {
            mutationFn:async(data:{username:string,code:string})=>{
             const res = await axios.post('/api/auth/verify-code',data)
             return res.data;
            }
        }
    )

    //* Memoize the context value to prevent unnecessary re-renders

      const contextValue = useMemo<IUserContext>(() => ({
        user: session?.user ?? null,
        loading: status === 'loading',
      }), [session?.user, status]);


    return (
        <UserContext.Provider value={{ signUpUser, userUnique, verifyOtp,...contextValue }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
