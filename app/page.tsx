"use client" // This component needs to be a Client Component to use useSearchParams

import { useSearchParams } from "next/navigation" // [^1]
import MainSidebar from "@/component/main-sidebar"
import HomeTab from "@/component/HomeTab"
import ProfileTab from "@/component/ProfileTab"
import UserProfilePage from "@/component/SingleVideo"
import CreateTab from "@/component/CreateTab"
import { useState } from "react"
import { Play, Sparkles, TrendingUp, Upload, Users, Video } from "lucide-react"
import CreateVideoModal from "@/component/CreateTab"

export default function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const currentSection = searchParams.get("section") || "home" // Default to 'home'

  // Function to render content based on the current section
  const renderContent = () => {
    switch (currentSection) {
      case "home":
        return (
          // <div className="p-4">
          //   <h2 className="text-2xl font-semibold text-gray-800">Welcome to your Dashboard!</h2>
          //   <p className="mt-2 text-gray-600">Select an item from the sidebar to view its content.</p>
          // </div>
          <HomeTab />
        )
      case "notifications":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
            <p className="mt-2 text-gray-600">You have 10 new notifications!</p>
          </div>
        )
      case "messages":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Messages</h2>
            <p className="mt-2 text-gray-600">Check your messages here.</p>
          </div>
        )
      case "create":
         return (
          <div className="min-h-full p-6">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-4">
                Create Amazing Content
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Share your creativity with the world. Upload videos, connect with your audience, and build your
                community.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">1.2M+</h3>
                    <p className="text-gray-600">Active Creators</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Play className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">50M+</h3>
                    <p className="text-gray-600">Videos Uploaded</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">2.5B+</h3>
                    <p className="text-gray-600">Total Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Video Button */}
            <div className="text-center mb-12">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg"
              >
                <Upload className="w-6 h-6" />
                <span>Create Video</span>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">High Quality Videos</h3>
                </div>
                <p className="text-gray-600">
                  Upload videos in HD, 4K, and beyond. Our platform supports all major video formats with lightning-fast
                  processing.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Build Your Audience</h3>
                </div>
                <p className="text-gray-600">
                  Connect with viewers who love your content. Use our analytics to understand your audience and grow
                  your community.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Trending Algorithm</h3>
                </div>
                <p className="text-gray-600">
                  Our smart algorithm helps your content reach the right audience at the right time, maximizing your
                  video's potential.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Creative Tools</h3>
                </div>
                <p className="text-gray-600">
                  Access powerful editing tools, filters, and effects to make your videos stand out and capture your
                  audience's attention.
                </p>
              </div>
            </div>
          </div>
        )
      case "watch-later":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Watch Later</h2>
            <p className="mt-2 text-gray-600">Your saved videos for later viewing.</p>
          </div>
        )
      case "profile":
        return (
          // <div className="p-4">
          //   <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
          //   <p className="mt-2 text-gray-600">Manage your profile information.</p>
          // </div>
          <ProfileTab />
        )
      case "single-video":
        return (
          // <div className="p-4">
          //   <h2 className="text-2xl font-semibold text-gray-800">SingleVideo</h2>
          //   <p className="mt-2 text-gray-600">Your saved videos for later viewing.</p>
          // </div>
          <UserProfilePage />
        )
      case "logout":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Logging Out...</h2>
            <p className="mt-2 text-gray-600">You will be redirected shortly.</p>
          </div>
        )
      default:
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
            <p className="mt-2 text-gray-600">The requested section does not exist.</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <MainSidebar />
      {/* Main content area */}
      <main className="flex-1 min-h-screen overflow-y-auto  md:ml-0">{renderContent()}
        {<CreateTab isModalOpen={isCreateModalOpen} setIsModalOpen={setIsCreateModalOpen} />
        }</main>
    </div>
  )
}
