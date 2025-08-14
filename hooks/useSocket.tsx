'use client'

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
// import { useUser } from "./userContext";

interface ISocketContext {
    sendMessage: (msg: string) => any;
    socket: Socket | undefined;
    onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const SocketProvider = ( {children} : {children: ReactNode} ) => {
    const{data:session}= useSession();
    const  user  = session?.user;
    const [socket, setSocket] = useState<Socket>();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    // const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if(!user?._id) return;
        // if (socketRef.current) return; // already connected

            const _socket = io("http://localhost:8000", {
                query:{    
                    userId: user?._id
                }}
            );
            // socketRef.current = _socket;
            setSocket(_socket);

            _socket.on("getOnlineUser", (users: string[]) => {
                
                setOnlineUsers(users)
            });

            return () => {
                _socket.disconnect();
                // socketRef.current = null;
                setSocket(undefined);
            }
    }, [user?._id])
    // console.log(onlineUsers)

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