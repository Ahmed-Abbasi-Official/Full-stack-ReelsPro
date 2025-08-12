"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { ReelItem } from "./ReelItem"
import { useVideo } from "@/hooks/useVideo"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { UniqueUsernameError } from "@/hooks/useUser"
import { useRouter } from "next/navigation"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  reel: {
    _id: string
    thumbnail?: string
    username: string
    userAvatar: string
    videoUrl?: string
  } | null
}

export default function VideoModal({ isOpen, onClose, reel }: VideoModalProps) {
    console.log(reel)
//   const [isLiked, setIsLiked] = useState(false)
//   const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 10000) + 100)
  const {getSingleVideo} = useVideo();
  const router=useRouter();

  useEffect(()=>{
    getSingleVideo.mutate(reel?._id!,{
        onSuccess(data:any){
            console.log(data)
            toast.success(data?.message)
        },onError(data:any){
            console.log(data)
            toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
            return router.push(`/`)
        }
    })
  },[])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }



    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  console.log(getSingleVideo)



  if (!isOpen || !reel) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  sm:p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white sm:rounded-xl shadow-2xl w-full max-w-2xl h-full mx-auto overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-white/80 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {
            getSingleVideo?.isPending && (
                <>
                <div className="w-full h-full flex justify-center items-center">
        <h2 className="text-xl text-gray-900">Wait Loading...</h2>
    </div>
                </>
            ) 

            
        }
        {
            getSingleVideo?.isSuccess && (
                <>
                <ReelItem reel={getSingleVideo?.data?.data[0]} isActive={true}/>

                </>
            )
        }

        
       

      </div>
    </div>
  )
}
