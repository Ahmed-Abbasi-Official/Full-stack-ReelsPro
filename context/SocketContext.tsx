'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/hooks/useUser";

interface ISocketContext {
    sendMessage: (msg: string) => any;
    socket: Socket | undefined;
    onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | null>(null);


export const SocketProvider = ( {children} : {children: ReactNode} ) => {
    const { user } = useUser();
    const [socket, setSocket] = useState<Socket>();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        if(!user?._id) return
            const _socket = io("http://localhost:3000", {
                query:{    
                    userId: user?._id
                }}
            );
            setSocket(_socket);

            _socket.on("getOnlineUser", (users: string[]) => {
                setOnlineUsers(users)
            });

            return () => {
                _socket.disconnect();
                setSocket(undefined);
            }
    }, [user?._id])

    const sendMessage:ISocketContext["sendMessage"] = useCallback((msg:string) => {
        if(socket) socket.emit("message", {message:msg})
    }, [socket])

    return (
        <SocketContext.Provider value={{sendMessage, socket, onlineUsers}}>
            { children }
        </SocketContext.Provider>
    )
};

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error("State us undefined");
    return state;
}