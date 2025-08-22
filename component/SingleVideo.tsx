"use client" // This component needs to be a Client Component to use useState

import { useEffect, useState } from "react"
import { Image } from "@imagekit/next"
import ReelsGrid from "./reels-grid" // Reusing ReelsGrid for user's videos
import { useVideo } from "@/hooks/useVideo"
import { useSession } from "next-auth/react"
import {  useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { UniqueUsernameError } from "@/hooks/useUser"
import { AxiosError } from "axios"
import Loader from "./Loader"



export default function UserProfilePage() {
  let username:any  = ""
  const [isFollowing, setIsFollowing] = useState(false) // State for follow button
  const {getSingleUsers} = useVideo();
  const searchParams = useSearchParams();
  const userId:any = searchParams.get('userId'); 
  const u:any = searchParams.get('username'); 
  const router = useRouter();
  const {data:session,status}=useSession();
  
  username=u;
  useEffect(()=>{
    getSingleUsers?.mutate(userId,{
      onSuccess(data:any){
        toast.success(data?.message)
      },onError(data:any){
        toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
      }
    });
  },[userId])

  useEffect(() => {
    if (getSingleUsers?.isError) {
      router.push('/')
    }
  }, [getSingleUsers?.isError, router])

  if(getSingleUsers?.isPending){
    return <Loader/>
  }
  // if(getSingleUsers?.isError){
  //   return router.push('/')
  // }

  if(status==="unauthenticated"){
     return (
      <>
            <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
            <p className="mt-2 text-gray-600">You must login First.</p>
             <button
                  onClick={() => {
                    router.push("/login")
                  }}
                  className="inline-flex items-center space-x-3 px-8 py-2 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
                >Login</button>
          </div>

            </>
     )
  }

  

  // Placeholder data - in a real app, these would come from an API
  const userAvatar = getSingleUsers?.data?.data.user?.profilePic;

  const handleFollowToggle = () => {
    // In a real app, this would trigger an API call to follow/unfollow
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-2">
      <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg p-3">
        <div className="flex flex-col items-center mb-8">
          <Image
            urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
            src={userAvatar || "/placeholder.svg"}
            alt={`${username}'s profile picture`}
            width={128}
            height={128}
            className="rounded-full border-4 border-purple-300 mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">@{username}</h1>
          <p className="text-gray-600 text-center mb-4">
            This is the profile page for <span className="font-semibold text-purple-600">@{username}</span>. Here you
            can see all their amazing videos!
          </p>

          {/* Followers and Following Section */}
          <div className="flex gap-6 mb-6">
            <div className="text-center">
              <span className="block text-xl font-bold text-gray-800">{getSingleUsers?.data?.data?.followers}</span>
              <span className="text-gray-600 text-sm">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-gray-800">{getSingleUsers?.data?.data?.following}</span>
              <span className="text-gray-600 text-sm">Following</span>
            </div>
          </div>

          {/* Follow Button */}
          {/* <button
            onClick={handleFollowToggle}
            className={`
              px-6 py-2 rounded-full font-semibold transition-colors duration-200
              ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
            `}
          >
            {isFollowing ? "Following" : "Follow"}
          </button> */}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
          Videos by @{username}
        </h2>
        {/* Reusing ReelsGrid to display videos for this user */}
        <ReelsGrid reel={getSingleUsers?.data?.data?.videos}/>
        {/* In a real app, you'd filter ReelsGrid or pass specific user videos */}
      </div>
    </div>
  )
}
