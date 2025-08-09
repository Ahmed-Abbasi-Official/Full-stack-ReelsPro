// "use client"

// import ReelComponent from "@/components/ReelComponent"
// import Link from "next/link"
// import { useEffect, useState } from "react"
// import SearchBar from "@/components/SearchBar"
// import { useSession } from "next-auth/react"

// export default function Home() {
//   const {data:session} = useSession();
//   const [user, setUser] = useState(false)
  
//   useEffect(() => {
//     if(session?.user){
//       // setUser(!user)
//       console.log(session)
//     }
//   }, [])
//   return (
//     <div className="relative w-full min-h-screen bg-gray-950 flex flex-col overflow-hidden">
//       {/* Background Gradient */}
//       <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/30 via-black/50 to-blue-900/30 animate-gradient-shift"></div>
//       {/* Header */}
//       <div className="border-b border-gray-700 bg-gray-900 shadow-lg z-10 relative">
//         <div className="max-w-full lg:max-w-full  flex flex-col  sm:flex-row justify-between items-center py-1.5 px-8 gap-4 sm:gap-0">
//           <div className="flex items-center justify-between w-full sm:w-auto">
//             <h2 className="text-white text-2xl sm:text-[25px] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
//               Reels Media
//             </h2>
//           </div>

//           <SearchBar/>
          
//           <div className="flex flex-row gap-3 mt-4 sm:mt-0">
//            {
//             session?.user ? (
//               <>
//               <div className="bg-amber-200 w-6 h-6 rounded-full">User</div>
//               </>
//             ) :(
//               <>
//                <Link
//               href="/login"
//               className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
//             >
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
//             >
//               Signup
//             </Link>
//               </>
//             )
//            }
//           </div>
//         </div>
//       </div>
//       {/* Main Content Area for Reels */}
//       <div className="flex-1 flex justify-center items-center   z-10 relative">
//         <ReelComponent />
//       </div>
//     </div>
//   )
// }








"use client"

import { useEffect, useState } from "react"
import { Home, Video, Bell, MessageCircle, Plus, User, Menu, X, LogOut, ListVideo } from "lucide-react"
import VideosTab from "@/components/VideosTab"
import NotificationsTab from "@/components/NotificationsTab"
import MessagesTab from "@/components/MessagesTab"
import CreateTab from "@/components/CreateTab"
import ProfileTab from "@/components/ProfileTab"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import WatchLaterTab from "@/components/WatchLaterTab"
import { useUser } from "@/hooks/useUser"
// import { useSocket } from "@/context/SocketContext"
import Loader from "@/components/Loader"

type TabType = "home" | "videos" | "notifications" | "messages" | "create" | "profile" | "logout" | "watchLater"

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<TabType>("home");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [collectionModalOpen, setCollectionModalOpen] = useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState<number>(10)
    // const {data:session} = useSession();
    // const { socket } = useSocket();
    const { user, loading } = useUser();
    const router = useRouter();


    // useEffect(() => {
    // const receiver = user?._id   

    // if (socket && activeTab === "notifications") {
    //     socket?.emit("joinRoom", receiver);
    //     socket?.emit("notif");
    // }
    // }, [socket, activeTab === "notifications"]);

    

    const tabs = [
        // { id: "home" as TabType, label: "Home", icon: Home },
        { id: "videos" as TabType, label: "Videos", icon: Video },
        { id: "notifications" as TabType, label: "Notifications", icon: Bell },
        { id: "messages" as TabType, label: "Messages", icon: MessageCircle },
        { id: "create" as TabType, label: "Create", icon: Plus },
        { id: "watchLater" as TabType, label: "Watch Later", icon: ListVideo },
        { id: "profile" as TabType, label: "Profile", icon: User },
        { id: "logout" as TabType, label: "Logout", icon: LogOut },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            // case "home":
            //     return <HomeTab />
            case "videos":
                return <VideosTab />
            case "notifications":
                return <NotificationsTab />
            case "messages":
                return <MessagesTab />
            case "profile":
                return <ProfileTab />
            // case "playlist":
            //     return <PlaylistTab />
            default:
                return <VideosTab />
        }
    }


    useEffect(() => {
        if(loading&&user?._id) router.push("/login")
    }, [user?._id])


    if (loading) return <Loader />;

    return (
        <div className="min-h-screen">
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-square btn-primary">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div
            className={`fixed inset-y-0 left-0 z-40 w-64 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-800" /> */}

                <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
                <div className="absolute top-[-10%] left-[10%] h-[20vmax] w-[20vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[5%] h-[18vmax] w-[18vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse" />
                <div className="absolute top-[50%] left-[40%] h-[14vmax] w-[14vmax] rounded-full bg-gradient-to-br from-violet-200 to-pink-200 opacity-40 blur-2xl animate-pulse" />
                </div>
                <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(transparent_0,transparent_70%,rgba(0,0,0,0.25)_70%)] [background-size:3px_3px]" />
            </div>

            <div className="relative p-6 text-gray-800">
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8 ml-14 lg:ml-0"> Dashboard </h1>
                <nav className="space-y-2">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isNotification = tab.id === "notifications";
                    const isActive = activeTab === tab.id;

                    return (
                    <button
                        key={tab.id}
                        onClick={() => {
                        if (tab.id === "create") {
                            setIsCreateModalOpen(true);
                        } else if (tab.id === "logout") {
                            signOut({ callbackUrl: "/login" });
                        } else if (tab.id === "watchLater") {
                            setCollectionModalOpen(!collectionModalOpen);
                        } else {
                            setActiveTab(tab.id);
                            setSidebarOpen(false);
                        }
                        }}
                        className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
                        ${
                            isActive
                            ? "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 shadow-md shadow-pink-100"
                            : "bg-white/60 hover:bg-white/80 text-gray-700 hover:text-purple-600"
                        }`}>
                        <div className="relative">
                        <IconComponent
                            className={`w-6 h-6 ${isActive ? "text-white" : "text-purple-600"}`}
                        />
                        {isNotification && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 font-semibold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {unreadCount}
                            </span>
                        )}
                        </div>
                        <span className="font-medium">{tab.label}</span>
                    </button>
                    );
                })}
                </nav>
            </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />
            )}



            <main className="lg:ml-64">
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                    <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
                    <div className="absolute top-[-10%] left-[10%] h-[40vmax] w-[40vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[5%] h-[36vmax] w-[36vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse" />
                    <div className="absolute top-[30%] left-[55%] h-[28vmax] w-[28vmax] rounded-full bg-gradient-to-br from-violet-200 to-pink-200 opacity-40 blur-2xl animate-pulse" />
                    </div>
                    <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(transparent_0,transparent_70%,rgba(0,0,0,0.3)_70%)] [background-size:3px_3px]" />
                </div>

                <div className="relative z-10">
                    <main className="min-h-screen bg-transparent ">
                    {renderTabContent()}
                    </main>
                </div>
            </main>


            <CreateTab
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
            />

            <WatchLaterTab
                collectionModalOpen={collectionModalOpen}
                setCollectionModalOpen={setCollectionModalOpen}
            />

        </div>
    )
}
