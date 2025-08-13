// UserContext.tsx
import { useMutation, UseMutationResult, useMutationState, useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React, { useContext, createContext, ReactNode, useMemo } from "react";

interface MessagesContextType {
    userSearch:UseMutationResult<AxiosResponse<any,any>,Error,string,unknown>
    sideBarUsers:UseMutationResult<AxiosResponse<any,any>,Error,void,unknown>
    getMessages:UseMutationResult<AxiosResponse<any,any>,Error,void,unknown>
};


const MessagesContext = createContext<MessagesContextType | undefined>(undefined);
export type UniqueUsernameError = {
    message: string;
};

// export const UserSearching = (username: any) => {
//     const userSearch = useQuery(
//         {
//             queryKey: ["user-search"],
//             queryFn: async () => {
//                 const res = await axios.get(`/api/messages/user-searching?username=${username}`);
//                 return res;
//             }
//         }
//     )
//     return { userSearch };
// }

export const MessagesProviders = ({ children }: { children: ReactNode }) => {

   

    //* SEARCH USERS :

    const userSearch = useMutation({
        mutationFn: async (username) => {
            const res = await axios.get(`/api/messages/user-searching?username=${username}`);
            return res;
        }
    });

    //* GET SIDEBAR USERS :

    const sideBarUsers = useMutation(
        {
            mutationFn: async (id) => {
                const res = await axios.get('/api/messages/get-users');
                console.log(res?.data)
                return res
            }
        }
    )

    //* GET ALL MESSAGES :

    const getMessages = useMutation({
        mutationFn:async(username:any)=>{
            const res = await axios.get(`/api/messages/get-message?username=${username}`);
            console.log(res?.data);
            return res?.data;
        }
    })

    return (
        <MessagesContext.Provider value={{  userSearch  , sideBarUsers,getMessages}}>
            {children}
        </MessagesContext.Provider>
    );
};

export const useMessages = () => {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
