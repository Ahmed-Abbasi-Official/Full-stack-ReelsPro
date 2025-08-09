import { Search } from 'lucide-react'
import React from 'react'

const SearchBar = () => {
  return (
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search reels..."
              className="w-full pl-10 pr-4 py-1 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
  )
}

export default SearchBar