"use client" // This component needs to be a Client Component to use useSearchParams

import { useSearchParams } from "next/navigation" // [^1]
import MainSidebar from "@/component/main-sidebar"
import HomeTab from "@/component/HomeTab"
import ProfileTab from "@/component/ProfileTab"
import UserProfilePage from "@/component/SingleVideo"

export default function HomePage() {
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
          <HomeTab/>
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
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-800">Create New Content</h2>
            <p className="mt-2 text-gray-600">Start creating something amazing.</p>
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
          <ProfileTab/>
        )
        case "single-video":
        return (
          // <div className="p-4">
          //   <h2 className="text-2xl font-semibold text-gray-800">SingleVideo</h2>
          //   <p className="mt-2 text-gray-600">Your saved videos for later viewing.</p>
          // </div>
          <UserProfilePage params={"username"}/>
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
      <main className="flex-1 min-h-screen overflow-y-auto  md:ml-0">{renderContent()}</main>
    </div>
  )
}
