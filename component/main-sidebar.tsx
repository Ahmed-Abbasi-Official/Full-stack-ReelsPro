"use client" // This component needs to be a Client Component to use useState and useSearchParams

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation" // [^1]
import { Video, Bell, MessageSquare, Plus, List, User, LogOut, X, Menu } from "lucide-react"

// Define navigation items with their section names and icons
const navItems = [
  { name: "Home", section: "videos", icon: Video },
  { name: "Notifications", section: "notifications", icon: Bell, badge: 10 },
  { name: "Messages", section: "messages", icon: MessageSquare },
  { name: "Create", section: "create", icon: Plus },
  { name: "Watch Later", section: "watch-later", icon: List },
  { name: "Profile", section: "profile", icon: User },
  // { name: "Single-Video", section: "single-video", icon: User },
]

export default function MainSidebar() {
  const [showSidebar, setShowSidebar] = useState(false)
  const searchParams = useSearchParams()
  const currentSection = searchParams.get("section") || "home" // Default to 'home' if no section param

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-purple-600"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white p-6 flex flex-col justify-between rounded-r-xl shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:rounded-r-xl
        `}
      >
        <div>
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Dashboard
          </h1>
          <nav className="space-y-4">
            {navItems.map((item) => {
              // Determine if the current link is active based on the 'section' query param
              const isActive = currentSection === item.section
              return (
                <Link
                  key={item.name}
                  href={item?.name === "Home" ? ('/') : ({ pathname: "/", query: { section: item.section } })}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg text-purple-600 transition-colors duration-200
                    ${isActive ? "bg-purple-100" : "hover:bg-purple-50"}
                    relative
                  `}
                  onClick={() => setShowSidebar(false)} // Close sidebar on link click for mobile
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto">
          <Link
            href={{ pathname: "/", query: { section: "logout" } }} // Placeholder for logout functionality
            className="flex items-center gap-3 p-3 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors duration-200"
            onClick={() => setShowSidebar(false)}
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </Link>
          <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <span className="font-bold">N</span>
            <span>1 Issue</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
