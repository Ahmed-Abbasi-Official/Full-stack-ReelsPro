"use client"

import axios from "axios"
import { Send, Bot, User, Users, MessageCircle, Crown, Star, Zap } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getSocket } from "@/lib/socket";

import { io, Socket } from "socket.io-client"

// Default users data


// Sample bot responses for simulation
const botResponses = [
  "That's a great question! I'm here to help you with that.",
  "I understand what you're looking for. Let me provide some insights.",
  "Thanks for reaching out! Here's what I think about your query.",
  "Interesting point! Based on what you've shared, I would suggest:",
  "Great to chat with you! Let me help you solve this problem.",
  "I see what you mean. Here's my recommendation for your situation.",
  "That's a common question. Let me break it down for you.",
  "Perfect timing! I have some ideas that might help you.",
]

export default function ChatApp() {
  const [messages, setMessages] = useState([])
  const [defaultUsers, setDefaultUsers] = useState([])
  const [username, setUsername] = useState<string>("")
  const [searchUsers, setSearchUsers] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [id, setId] = useState(null)
  const [socket, setSocket] = useState<Socket>()
   const router = useRouter();
   const searchParams = useSearchParams();
   const {data:session} = useSession();
  //  console.log(session?.user)
  

  const handleUserSelect = async(user: any) => {
    router.push(`?user=${user?.username}`, { shallow: true });
    setSelectedUser(user)
    const res = await axios.get(`/api/messages/get-message?user=${user?.username}`);
    console.log("res of messages===> ",res)
    if(res?.data.statusCode === 200){
      setMessages(res.data.data)
    }
  }

  // console.log(messages)

  const handleSearchFunctionality = async (e: any) => {
  const value = e.target.value;
  setUsername(value);

  if (value.length === 0) {
    setSearchUsers([]);
    return;
  }

  try {
    const res = await axios.get(`/api/user-searching?username=${value}`);
    if (res?.data?.statusCode) {
      setSearchUsers(res?.data.data);
    }
    console.log(res)
  } catch (err) {
    console.error(err);
  }

  // console.log(value);
};

// console.log(selectedUser)

  // console.log(searchUsers)

  const simulateBotResponse = () => {
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
        const botMessage = {
          id: Date.now() + Math.random(),
          content: randomResponse,
          role: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 2000,
    ) // Random delay between 1.5-3.5 seconds
  }

  // const handleSend = (e: any) => {
  //   e.preventDefault()
  //   if (!input.trim()) return

  //   // Add user message
  //   const userMessage = {
  //     id: Date.now(),
  //     content: input.trim(),
  //     role: "user",
  //     timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  //   }

  //   setMessages((prev) => [...prev, userMessage])
  //   setInput("")

  //   // Simulate bot response
  //   simulateBotResponse()
  // }

  const clearChat = () => {
    setMessages([])
  }


  

  // console.log(selectedUser)
   const handleSend = (e:any) => {
    e.preventDefault()
  if (socket) {
   if(selectedUser){
     const toUserId = selectedUser?.userId || selectedUser?._id;
     console.log(toUserId)
    
      socket.emit('event:message', {
        toUserId,
        message: input,
      });

      const newMessage = {
        _id: Date.now().toString(), // or generate temporary ID
        sender: session?.user?._id,
        message: input,
        createdAt: new Date().toISOString(), // optional
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput('');
    
   }
  }
};

// Replace your current socket listener with this:
useEffect(() => {
  if (!socket || !selectedUser?.userId) return;

  const handleIncomingMessage = (payload: { 
    sender: string; 
    receiver: string 
  }) => {
    // Only show messages that are:
    // 1. Sent to the current selected user (outgoing), OR
    // 2. Received from the current selected user (incoming)
    if (
      payload.receiver === selectedUser.userId || 
      payload.sender === selectedUser.userId
    ) {
      setMessages((prev) => [...prev, payload]);
    }
  };

  socket.on("message", handleIncomingMessage);

  // Critical: Clean up previous listener
  return () => {
    socket.off("message", handleIncomingMessage);
  };
}, [socket, selectedUser?.userId]); // Re-run when chat partner changes


  useEffect(async()=>{
    const username = searchParams.get("user")
   if(username)
   {
    try {
    const res = await axios.get(`/api/user-searching?username=${username}`);
    if (res?.data?.statusCode) {
      setDefaultUsers(res?.data.data)
      setId(res.data.data[0]._id)
      setSelectedUser(res.data.data[0])
      const ress = await axios.get(`/api/messages/get-message?user=${username}`);
    // console.log("res of messages===> ",res)
    if(ress?.data.statusCode === 200){
      setMessages(ress.data.data)
    }
    }
    // console.log(res)
  } catch (err) {
    console.error(err);
  }
   }
  },[])
  // console.log(defaultUsers)

  useEffect(()=>{
    const res = async()=>{
      const response = await axios.get('/api/messages/get-users');
      // console.log("All User===> : ",response)
     
      // console.log(searchUser)
      if(response.data?.statusCode === 200){
       if(id){
        const result= response.data.data?.filter((val)=>(
          val?.userId !== id
        ))
        setDefaultUsers((prev) => [...prev, ...result])

        return
       }else{
        setDefaultUsers(response.data.data)
       }
      }
    }


    res()

  },[id])

useEffect(() => {
  const _socket = getSocket();
  setSocket(_socket);

  return () => {
    _socket.disconnect();
  };
}, []);



  if (socket) {
    const userId = session?.user?._id;
    socket.emit("event:register", { userId});
  }



  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar for Default Users */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Team Members
          </h2>
        </div>
        <div className=" flex items-center gap-2 mx-2">
          <h2 className="text-lg font-semibold text-gray-800">
            search
          </h2>
          <input
            type="text"
            placeholder="Search"
            className="border border-black rounded text-gray-900 px-4"
            value={username}
            onChange={handleSearchFunctionality}
          />
        </div>
        <div className=" flex items-center justify-center flex-col gap-2 mx-2">
          {
           searchUsers && (
             searchUsers?.length === 0 ? ("No User Found") : (
              searchUsers.length > 0 && searchUsers?.map((data) => (
                <div key={data._id} className="py-2">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">username : {data?.username}</h2>
                    <button className="bg-blue-500 py-2 px-4 "
                    onClick={(e:any)=>{
                      e.preventDefault();
                      setDefaultUsers((prev)=>[...prev,data])
                    }}
                    >Add</button>
                  </div>
                </div>
              ))
            )
           )
          }
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {defaultUsers?.length > 0 && defaultUsers.map((user) => {
            return (
              <div
                key={user?.userId}
                onClick={() => handleUserSelect(user)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 hover:border-blue-200 ${selectedUser?._id === user._id ? "bg-blue-50 border-blue-300" : "bg-white border-gray-100"
                  }`}
              >
                <div className="flex items-center gap-3">

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{user?.username}</h3>
                      <span className="text-black text-sm">{user?.unreadCount && user?.unreadCount}</span>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {selectedUser ? `Chatting with ${selectedUser?.username}` : "Select a team member to chat"}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Chat Assistant</h1>
                {selectedUser && <p className="text-sm text-gray-500">with {selectedUser.username}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">
                {selectedUser ? `Start chatting with ${selectedUser && selectedUser?.usernmae}` : "Start a conversation with AI"}
              </p>
              <p className="text-sm">Type a message below to get started</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message._id} className={`flex gap-3 ${message?.sender === session?.user?._id ? "justify-end" : "justify-start"}`}>
              {/* {message.role === "bot" && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )} */}

              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender !== session?.user?._id ? "bg-blue-600 text-white" : "bg-white text-gray-800 shadow-sm border"
                  }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                <span className="cursor-pointer">X</span>
              </div>

            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">AI is typing</span>
                  <div className="flex space-x-1 ml-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white border-t px-6 py-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedUser ? `Message ${selectedUser.usernmae}...` : "Type your message..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
