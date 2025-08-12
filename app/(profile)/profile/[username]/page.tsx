"use client" // This component needs to be a Client Component to use useState

import { useState } from "react"
import Image from "next/image"
import ReelsGrid from "@/component/reels-grid"// Reusing ReelsGrid for user's videos

interface UserProfilePageProps {
  params: {
    username: string
  }
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = params
  const [isFollowing, setIsFollowing] = useState(false) // State for follow button

  // Placeholder data - in a real app, these would come from an API
  const userAvatar = `/placeholder.svg?height=128&width=128&text=${username.substring(0, 2).toUpperCase()}`
  const followersCount = 1234
  const followingCount = 567

  const handleFollowToggle = () => {
    // In a real app, this would trigger an API call to follow/unfollow
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center mb-8">
          <Image
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
              <span className="block text-xl font-bold text-gray-800">{followersCount}</span>
              <span className="text-gray-600 text-sm">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-gray-800">{followingCount}</span>
              <span className="text-gray-600 text-sm">Following</span>
            </div>
          </div>

          {/* Follow Button */}
          <button
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
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
          Videos by @{username}
        </h2>
        {/* Reusing ReelsGrid to display videos for this user */}
        <ReelsGrid />
        {/* In a real app, you'd filter ReelsGrid or pass specific user videos */}
      </div>
    </div>
  )
}
