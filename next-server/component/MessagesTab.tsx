import { ArrowLeft, Check, CheckCheck, ChevronDown, MessageCircleX, MessageSquare, Send, Trash2, Upload, UserRoundPen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "@/app/component/FileUpload";
import toast from "react-hot-toast";
import { Image, Video } from "@imagekit/next";
import { useMessages } from "@/hooks/useMessages";
// import Image from "next/image";
import { format } from "date-fns";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/useSocket";
import { UploadOptions } from "./UploadOption";
import { useRouter, useSearchParams } from "next/navigation";


interface Message {
    _id: string;
    sender: string;
    receiver: string;
    message: string;
    updatedAt: Date;
    createdAt: Date;
    isRead: boolean;
    status: string;

}

const isMediaLink = (url: string) => {
    return url.startsWith("https://ik.imagekit.io/");
};

const isImage = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
};

const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
};



const MessagesTab = () => {

    const { setValue, watch } = useForm({
    })

    const [activeUser, setActiveUser] = useState({
        _id: "",
        username: '',
        profilePic: '',
    });
    const [users, setUsers] = useState<any>([]);
    const [searchUser, setsearchUser] = useState([])
    const [loaded, setLoaded] = useState(false);

    const [search, setSearch] = useState<string | null>('');
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [messages, setMessages] = useState<Map<string, Message>>(new Map());
    const [messageInput, setMessageInput] = useState("");

    const { onlineUsers, socket } = useSocket();

    const [menuMessageId, setMenuMessageId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("")
    const [isRead, setIsRead] = useState(0)
    const [reciever, setReciever] = useState(null)

    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [showSideBar, setShowSideBar] = useState(true)
    const { userSearch, sideBarUsers, getMessages ,handleSeeen} = useMessages();
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userIdRef = useRef<any | null>(null); // initialize ref

    // keep ref updated whenever search param changes
    useEffect(() => {
        userIdRef.current = activeUser;
    }, [activeUser]);
    // console.log(userId)

    const user: any = session?.user;

    //   const {userSearch} = UserSearching("a")
    //   const {userSearch} = UserSearching("username")

    // useEffect(() => {
    //     console.log("Online-Users : ", onlineUsers);
    // });

    // console.log(session?.user)

    useEffect(() => {
        // socket?.emit("joinRoom", user?._id);
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/api/messages/get-users");
                // console.log(res?.data)
                setUsers(res.data?.data);
            } catch (err) {
                setError(err);
                toast.error("SomeThing went wrong");
                return
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);
    useEffect(() => {
        socket?.emit("joinRoom", user?._id);
        console.log("hugya")
    }, [socket])



    const handleUserSearch = (e: any) => {
        // console.log(e)
        setDebouncedSearch(e.target.value);
        setSearch(e.target.value);
        if (e.target.value.length > 0) {
            userSearch.mutate(e.target.value, {
                onSuccess(data) {
                    setsearchUser(data?.data?.data)
                    console.log(data)
                }, onError(data: any) {
                    console.log(data?.response?.data?.message)
                    toast.error(data?.response?.data?.messsage)
                }
            })
        } else {
            setsearchUser([])
        }
    }


    useEffect(() => {

        

    }, [])
    // handleSeeen.mutate();
    // console.log(activeUser)


    const getMessage = async () => {
        const username: any = activeUser?.username;
        getMessages.mutate(username, {
            onSuccess(data: any) {
                console.log(data);

                const messageArray = data?.data || [];
                const messageMap: any = new Map(
                    messageArray.map((msg: any) => [msg._id, msg])
                );

                setMessages(messageMap);
            },
            onError(data: any) {
                toast.error(data?.response.data.message);
            }
        });
    };


    useEffect(() => {
        activeUser?.username && getMessage()
    }, [activeUser?.username])




    // 📤 Send message
    const handleSendMessage = () => {

        // console.log("aya")
        if (!messageInput.trim() || !activeUser._id) return;
        // console.log(first)

        const data = {
            sender: user?._id,
            receiver: activeUser._id,
            message: messageInput,
        };

        const newMessage: any = {
            _id: crypto.randomUUID(), // Temporary ID for client-side
            sender: user?._id,
            receiver: activeUser._id,
            customId:crypto.randomUUID(),
            message: messageInput,
            updatedAt: new Date(),
            createdAt: new Date(),
            isRead: false,
            status: "sending", // Custom status to indicate it's in transit
            username: user?.username,
            profilePic: user?.profilePic
        };



        // console.log(payload)
        const payload = {
            reciever: newMessage?.receiver,
            sender: newMessage?.sender,
        }

        socket?.emit("event:message", newMessage);
        socket?.emit("event:checkUser", newMessage);
        socket?.emit("event:seen", payload);
        setMessages(prev => {
            const newMap = new Map(prev);
            // console.log("Before adding:", Array.from(newMap.values()));
            newMap.set(newMessage?._id, newMessage);
            // console.log("After adding:", Array.from(newMap.values()));
            return newMap;
        });

        setMessageInput("");
        setImageUrl("")
    };

    useEffect(() => {
        if (imageUrl) {
            setMessageInput(imageUrl)
        }

        console.log(imageUrl)
    }, [imageUrl])

    // 📥 Receive real-time message

    //* FOR REAL TIME UPDATE :

    const run:any=async()=>{

         const username = userIdRef.current?.username;
         console.log(username)
                if (username) {
                    try {
                        const res = await axios.patch(`/api/messages/get-message?username=${username}`);
                        // console.log(res?.data);
                    } catch (error) {
                        console.error("PATCH failed:", error);
                    }
                }
    }
    

    useEffect(() => {
        socket?.on("get:messages", (data) => {
            //  console.log(users)
            // console.log(data, "data-:")
            // console.log(activeUser)
            setMessages((prev) => {
                const newMap = new Map(prev);
                newMap.set(data?._id, data); // assuming data._id is unique
                return newMap;
            });
            // console.log(data)

            const payload = {
                userId: data?.sender,
                profilePic: data?.profilePic,
                username: data?.username,
            }


            setUsers((prevUser: any) => {
                const existUser = prevUser?.find((user: any) => user?.userId === data?.sender)
                if (existUser) {
                    const filterUsers = prevUser?.filter((user: any) => user?.userId !== data?.sender);
                    return [existUser, ...filterUsers];
                } else {
                    return [payload, ...prevUser]
                }
            })
            // console.log(users)

        });



        socket?.on("event:saw", async (sender) => {
            console.log("Reciver User ID : ", sender)
            // console.log(activeUser)
            // setActiveUser((prev:any)=>{console.log(prev)})
            const userId = userIdRef.current?._id;
            const read = userId === sender;
            // console.log("Logged In User ID : ", user?._id)
            // console.log(read, userId);
            if (!read) {
                setReciever(sender)
                setIsRead((prev) => prev + 1);
            } else {
                setReciever(sender)
                setIsRead(0)
                run()
                // const username = userIdRef.current?.username;
                // if (username) {
                //     try {
                //         const res = await axios.patch(`/api/messages/get-seen?username=${username}`);
                //         console.log(res?.data);
                //     } catch (error) {
                //         console.error("PATCH failed:", error);
                //     }
                // }

            }

        })

        socket?.on("get:user", (data) => {
            // console.log("first",data)

        })

        socket?.on("event:deleted", (deletedMessageId: any) => {
            // console.log("first", deletedMessageId)
            setMessages((prev) => {
                const newMap = new Map(prev);
                newMap.delete(deletedMessageId?.messageId); // directly delete using messageId
                return newMap;
            });
        });

        // socket?.on("editMsg", (payload) => {
        //   setMessages(prev => 
        //     prev.map((msg) => 
        //       msg?.sender === payload?.sender ? {...msg, message:payload?.message} : msg
        //     ) 
        //   )
        // });


        // socket?.on("startTyping", (receiver: string) => {
        //   setTypingUsers([...typingUsers, receiver])
        // });


        // socket?.on("stopTyping", (receiver: string) => {
        //   setTypingUsers((prev) => prev.filter((id) => id !== receiver));
        // });


        // socket?.on("seenMsg", (senderId: string) => {
        //   if (!senderId) return;
        //   setMessages(prevMessages => {
        //     let hasChanged = false;
        //     const updatedMessages = prevMessages.map(msg => {
        //       if (msg.sender === senderId && !msg.seen) {
        //         hasChanged = true;
        //         return { ...msg, seen: true };
        //       }
        //       return msg;
        //     });

        //     return hasChanged ? updatedMessages : prevMessages;
        //   });
        // });


        return () => {
            socket?.off("get:messages");
            socket?.off("event:deleted");
            socket?.off("get:user");
            socket?.off("event:saw");
            //   socket?.off("startTyping");
            //   socket?.off("stopTyping");
        };
    }, [socket]);

    // console.log(isRead)




    const handleDelete = async (messageId: string,customId:string) => {
        // console.log("first",messageId)
        const payload = {
            messageId,
            sender: user?._id,
            reciever: activeUser?._id,
            customId
        }
        // console.log(payload)
        socket?.emit("event:delete", payload);
        // setMessages((prev) => prev.filter((msg) => msg?._id !== messageId))
        setMessages((prev) => {
            const newMap = new Map(prev);
            newMap.delete(messageId)
            return newMap;
        })
        setEditingMessageId
    };


    const handleUpdate = async (messageId: string, message: string) => {
        const payload = {
            _id: messageId,
            message,
            sender: activeUser?._id,
            //   receiver: user?._id
        }
        // socket?.emit("edit", payload);
        // setMessages((prev) =>
        //     prev.map((msg) =>
        //         msg?._id === messageId ? { ...msg, message } : msg
        //     )
        // )
        setEditingMessageId(null);
        setEditedText("");
        setMenuMessageId(null);
    };


    const handleTyping = () => {
        // if(!socket || !activeUser?._id) return;
        // if(messageInput.trim().length > 0){
        //   if(!user?._id) return;
        //   let receiver =  user?._id;
        //   socket.emit("startTyping", receiver);
        //   setTypingUsers(prev => [...prev, receiver]);

        //   setTimeout(() => {
        //     socket.emit("stopTyping",  receiver)
        //   }, 1000);

        // };
    };

    const handleSeen = () => {
        // if(user?._id) socket?.emit("seenMsg", user?._id)
    }

    const handelShowSideBar = () => {
        // console.log(showSideBar)
        setShowSideBar(!showSideBar)
    }

    // To get all messages as an array (for rendering):
    const messagesArray = Array.from(messages.values());
    // console.log(messagesArray)
    // console.log(users)

    return (
        <div className="p-1 md:p-6 h-[calc(100vh-40px)] w-full">
            <h2 className="text-2xl font-bold md:mb-4 mb-1.5 ml-14 lg:ml-0">Messages</h2>
            <div className="grid grid-cols-3 gap-4 w-full h-full">
                {/* Sidebar */}
                <div className={`lg:col-span-1 col-span-3 lg:block ${showSideBar ? ("block") : ("hidden")}`}>
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 h-full overflow-y-auto">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Conversations</h3>
                            <div className="relative w-full mb-4">
                                <input
                                    type="text"
                                    value={search as string}
                                    onChange={(e) => {
                                        handleUserSearch(e)
                                    }}
                                    placeholder="Search a user..."
                                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
                                />
                                {search && (
                                    <button
                                        onClick={() => {
                                            setSearch("");
                                            setDebouncedSearch("");
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            {
                                (search) && (
                                    <div className="bg-white  w-full h-full text-black p-2 shadow gap-4 shadow-black flex  flex-col  justify-start items-start">
                                        {
                                            searchUser?.length > 0 && (
                                                searchUser?.map((user: any) => (
                                                    <div className="w-full h-fit  relative   flex justify-between items-center">
                                                        <div className="flex gap-2 items-center justify-center">
                                                            <Image
                                                                urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                                                                src={user.profilePic || "https://ik.imagekit.io/dw09wk9tq/ahmed_Z6BJHk6v_.jpeg?updatedAt=1736181779211"}
                                                                alt="profilePic"
                                                                width={40}
                                                                height={40}
                                                                className="object-cover w-6 h-6 rounded-full border border-gray-200"
                                                            />
                                                            <p>{user?.username}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSearch("");
                                                                setUsers([user, ...users]);
                                                            }}
                                                            className="inline-flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg  text-sm"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            <span>Add</span>
                                                        </button>
                                                    </div>
                                                ))
                                            )
                                        }
                                        {
                                            userSearch?.isPending && (
                                                <p className="text-sm text-green-600 p-2">wait Loading...</p>
                                            )
                                        }
                                        {
                                            userSearch?.isError && (
                                                <p className="text-sm text-red-600 p-2">No User Found!</p>
                                            )
                                        }
                                    </div>
                                )
                            }
                            <div className="space-y-2">
                                {users.length > 0 && (
                                    users?.map((name: any) => (
                                        <div

                                            key={name?._id || name?.userId}
                                            className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition-all ${activeUser.username === name.username
                                                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                                                : "hover:bg-white/60 hover:shadow-sm"
                                                }`}
                                            onClick={() => {
                                                // router.push(`/?section=messages&userId=${name?._id || name?.userId}`);
                                                setActiveUser({ ...activeUser, username: name?.username, profilePic: name?.profilePic, _id: name?._id || name?.userId });
                                                socket?.emit("joinRoom", user?._id);
                                                setIsRead(0);
                                                name.unreadCount = 0;
                                                handelShowSideBar();
                                            }}

                                        >
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                                                    src={name?.profilePic || "https://ik.imagekit.io/dw09wk9tq/ahmed_Z6BJHk6v_.jpeg?updatedAt=1736181779211"}
                                                    alt="profilePic"
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full rounded-full border border-gray-200"
                                                />
                                                {onlineUsers?.includes(name?._id || name?.userId) && (
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-1 border-white rounded-full" />
                                                )}
                                                {
                                                    (isRead > 0 && (name?.userId === reciever)) ? (
                                                        <p className="absolute bottom-0 -right-2 text-green-900 text-sm ">{isRead}</p>
                                                    ) : (
                                                        <p className="absolute bottom-0 -right-2 text-green-900 text-sm ">{name?.unreadCount}</p>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">{name?.username.charAt(0).toUpperCase() + name?.username.slice(1)}</div>
                                                <div className="text-xs opacity-70">
                                                    {/* {mockMessages[name].at(-1)?.text || "Last message..."} */}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`lg:col-span-2 col-span-3 lg:block ${showSideBar ? ("hidden") : ("block")}`}>
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 h-full flex flex-col">
                        {activeUser?.username && <div className="md:p-3 border-b border-gray-200 flex items-center justify-between">
                            <div className="w-full flex items-center justify-between">
                                <div className="flex items-center gap-x-3">
                                    <ArrowLeft
                                        className="cursor-pointer lg:hidden text-gray-700 hover:text-black"
                                        onClick={handelShowSideBar}
                                    />
                                    <div className="avatar">
                                        <div className="avatar placeholder w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">

                                            <Image urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT} src={activeUser?.profilePic || "https://ik.imagekit.io/dw09wk9tq/ahmed_Z6BJHk6v_.jpeg?updatedAt=1736181779211"} alt="profilePic" width={40} height={40} className="object-cover w-full h-full" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium">{activeUser.username.charAt(0).toUpperCase() + activeUser.username.slice(1)}</h3>
                                        <p className="text-sm text-gray-500">
                                            {/* {onlineUsers?.includes(activeUser?._id)? "Online" : "Offline"} */}
                                        </p>
                                    </div>
                                </div>

                                <button onClick={() => {
                                    //   socket?.emit("leaveRoom", activeUser?._id);
                                    //   socket?.off("seenMsg", activeUser?._id as any);
                                    setActiveUser({ _id: "", username: "", profilePic: "" });
                                    setShowSideBar(true)
                                }} className='cursor-pointer'> <MessageCircleX />
                                </button>
                            </div>
                        </div>}
                        <div className="sm:card-body p-2 flex flex-col w-full h-full  ">

                            <div className="overflow-auto very-thin-scrollbar w-full h-[calc(100vh-180px)]  md:h-[calc(100vh-240px)]">
                                {activeUser?.username ? (
                                    <div className="flex-1 flex flex-col md:gap-2 gap-4 pr-2 ">
                                        {
                                            getMessages?.isPending && (
                                                <p className="md:text-xl text-sm text-gray-800">Wait Loading...</p>
                                            )
                                        }
                                        {getMessages?.isSuccess && messagesArray?.map((msg: any, i) => {
                                            const isOwn = msg?.sender !== user?._id;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex items-end md:gap-2 group ${isOwn ? "justify-start" : "justify-end"}`}>

                                                    {!isOwn ? <img
                                                        src={user?.profilePic || "https://ik.imagekit.io/dw09wk9tq/ahmed_Z6BJHk6v_.jpeg?updatedAt=1736181779211"}
                                                        alt="Avatar"
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    /> : ""}

                                                    <div className={`relative max-w-[75%]`}>
                                                        <div
                                                            className={`px-3 pt-2 rounded-xl text-sm shadow-md break-words flex ${isOwn
                                                                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-br-none"
                                                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                                                }`}>

                                                            {
                                                                // editingMessageId === msg?._id ? (
                                                                //     <div className="flex items-center gap-2 w-full">
                                                                //         <input
                                                                //             type="text"
                                                                //             value={editedText}
                                                                //             onChange={(e) => setEditedText(e.target.value)}
                                                                //             className="bg-transparent outline-none border-b border-gray-400 text-sm flex-1"
                                                                //             autoFocus
                                                                //         />
                                                                //         <button
                                                                //             onClick={() => {
                                                                //                 console.log('Save edited message:', editedText);
                                                                //                 handleUpdate(msg._id, editedText);
                                                                //             }}
                                                                //             className="text-xs px-1.5 py-1 mb-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                                                //             <Check />
                                                                //         </button>
                                                                //         <button
                                                                //             onClick={() => {
                                                                //                 console.log('Save edited message:', editedText);
                                                                //                 handleUpdate(msg._id, editedText);
                                                                //             }}
                                                                //             className="text-xs px-1.5 py-1 mb-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                                                //             <X />
                                                                //         </button>
                                                                //     </div>
                                                                // ) : 
                                                                (
                                                                    <>
                                                                        {/* {msg?.video && (
                                                                    <video
                                                                        controls
                                                                        className="rounded-lg max-w-64 mb-2">
                                                                        <source src={msg.video} type="video/mp4" />
                                                                    </video>
                                                                )}

                                                                {msg.image && (
                                                                    <img src={msg.image} alt="Sent image" className="rounded-lg max-w-64 mb-2" />
                                                                )} */}

                                                                        {/* Text */}
                                                                        {msg?.message && (
                                                                            <>
                                                                                <div>
                                                                                    {
                                                                                        isMediaLink(msg?.message) ? (
                                                                                            <>
                                                                                                {isImage(msg.message) ? (
                                                                                                    <img
                                                                                                        // urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                                                                                                        src={msg?.message}
                                                                                                        alt="sent media"
                                                                                                        // width={36}
                                                                                                        // height={36}
                                                                                                        className={`sm:w-full w-full sm:h-72 object-center rounded-md transition duration-500 `}
                                                                                                    // onLoad={() => setLoaded(true)}
                                                                                                    />
                                                                                                ) : isVideo(msg?.message) ? (
                                                                                                    <Video
                                                                                                        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                                                                                                        src={msg?.message}
                                                                                                        controls
                                                                                                        width={36}
                                                                                                        height={36}
                                                                                                        className="w-full h-72 object-center rounded-md"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <a
                                                                                                        href={msg?.message}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="text-blue-500 cursor-pointer underline"
                                                                                                    >
                                                                                                        {msg.message}
                                                                                                    </a>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <p className=" text-sm sm:w-72 cursor-pointer w-52  whitespace-pre-line">
                                                                                                {msg?.message}
                                                                                            </p>
                                                                                        )
                                                                                    }
                                                                                    <p className="text-sm  text-gray-500">{msg?.createdAt && format(new Date(msg.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                                                                                </div>
                                                                            </>
                                                                        )}


                                                                        {isOwn && (
                                                                            <div className="flex justify-end mt-1"> <CheckCheck size={16} className={`ml-1 ${msg?.seen ? 'text-[#00a6ff]' : 'text-gray-400'}`} />
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}

                                                            {!isOwn && (
                                                                <div className="relative group ml-2">
                                                                    <button
                                                                        onClick={() => setMenuMessageId(msg?._id)}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform hover:translate-y-1">
                                                                        {!editingMessageId && <ChevronDown size={18} className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition-transform duration-200" />}
                                                                    </button>

                                                                    {menuMessageId === msg?._id && (
                                                                        <div className="absolute top-7 right-0 z-20 bg-white  rounded-lg shadow-xl w-32 animate-fade-in-up p-2">
                                                                            {/* <button
                                                                            onClick={() => {
                                                                                setEditedText(msg?.message);
                                                                                setEditingMessageId(msg?._id);
                                                                                setMenuMessageId(null);
                                                                            }}
                                                                            className="rounded-md cursor-pointer w-full flex gap-2 items-center px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                                            <UserRoundPen size={17} /> Edit
                                                                        </button> */}
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleDelete(msg?._id,msg?.customId);
                                                                                    setMenuMessageId(null);
                                                                                }}
                                                                                className="rounded-md cursor-pointer w-full flex gap-1 items-center px-4 py-2 text-left text-sm transition-colors hover:bg-[#9c3e41]">
                                                                                <Trash2 size={17} /> Delete
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setMenuMessageId(null)}
                                                                                className="rounded-md cursor-pointer w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                                                ❌ Cancel
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>

                                                    {isOwn && (
                                                        <img
                                                            src={"https://ik.imagekit.io/dw09wk9tq/ahmed_Z6BJHk6v_.jpeg?updatedAt=1736181779211"}
                                                            alt="Avatar"
                                                            className="w-4 h-4 rounded-full object-cover border"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
                                        <div className="max-w-md text-center space-y-6">
                                            <div className="flex justify-center gap-4 mb-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                                                        <MessageSquare className="w-8 h-8 text-primary " />
                                                    </div>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
                                            <p className="text-base-content/60">
                                                Select a conversation from the sidebar to start chatting
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {activeUser?.username && <div className="mt-4 flex flex-col gap-x-2">
                                {/* 👇 Typing indicator */}
                                {typingUsers.includes(activeUser._id) && (
                                    <div className="flex items-center space-x-2 px-2 pb-1">
                                        <span className="text-sm text-gray-500">Typing</span>
                                        <div className="flex space-x-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                                        </div>
                                    </div>
                                )}

                                {watch("image") && (
                                    <div className="relative w-[150px] h-[100px] rounded-lg overflow-hidden mb-1">
                                        <img
                                            src={watch("image")}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {imageUrl && (
                                    <div className="relative mt-2">
                                        <img
                                            src={imageUrl}
                                            alt="preview"
                                            className="max-w-full max-h-40 rounded-lg border border-gray-300"
                                        />
                                        <button
                                            onClick={() => setImageUrl("")}
                                            className="absolute top-1 right-1 bg-white text-gray-600 hover:text-red-500 rounded-full p-1 shadow"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div className="flex  items-center gap-1">
                                    <input
                                        type="text"
                                        // disabled={imageUrl}
                                        value={messageInput}
                                        onChange={(e) => {
                                            setMessageInput(e.target.value);
                                            // handleTyping();
                                        }}
                                        placeholder={imageUrl ? ("only send image...") : `Type a message...`}
                                        className="flex-1 md:px-4 md:py-2 px-1.5 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
                                    />



                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white md:p-2 p-2 rounded-full shadow hover:shadow-lg transition"
                                    >
                                        <Send size={19} />
                                    </button>

                                    <UploadOptions onUpload={(url) => setImageUrl(url)} />


                                </div>

                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesTab;