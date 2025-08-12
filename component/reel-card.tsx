import Link from "next/link"
import Image from "next/image" // Using next/image for placeholder images
import { Video } from "@imagekit/next"
import VideoModal from "./VideoPopUp"
import { useState } from "react"

interface ReelCardProps {
  id: string
  thumbnail: string
  username: string
  userAvatar: string
}

// const handleVideoPopUp:any = () => {
//   console.log("asd")
//    <div>


//    </div>

// }


export default function ReelCard({ reel }: any) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const handleVideoPopUp = () => {
    setIsVideoModalOpen(false)
  }
  const handleVideoModal = () => {
    // console.log("asd")
    setIsVideoModalOpen(!isVideoModalOpen);
    
  }
  return (
    <>
    <div
      onClick={() => handleVideoModal()}
      className="relative w-full aspect-[9/16] rounded-lg overflow-hidden shadow-md group">
      <Video
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        src={reel?.videoUrl}
        className="w-full h-full object-cover cursor-pointer"
        w={500}
        h={500}
      />
    </div>
    {isVideoModalOpen && (<VideoModal reel={reel} isOpen={isVideoModalOpen} onClose={handleVideoPopUp} />)}
    </>
  )
}
