export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="relative h-12 w-12"> {/* Increased size here */}
        
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-b-pink-400 animate-spin"></div>

        {/* Inner Pulse Ring */}
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-l-purple-300 border-r-pink-300 animate-[spin_2s_linear_infinite]"></div>

        {/* Center Dot */}
        <div className="absolute inset-[35%] h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
      </div>
    </div>
  )
}