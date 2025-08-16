"use client"

import { Heart, MessageCircle, MoreHorizontal, Play, Save, Send, Share, Share2, Volume2, VolumeX } from "lucide-react"
import { Image, Video } from "@imagekit/next"
import { useEffect, useRef, useState } from "react"
import CommentModal from "./CommentModal"
import { useVideo } from "@/hooks/useVideo"
import { toast } from "react-toastify"
import { UniqueUsernameError } from "@/hooks/useUser"
import { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import PlaylistModal from "./PlaylistModal"
import Link from "next/link"

const formatNumber = (num: number): string => {
  if (typeof num !== 'number') return "0"
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export const ReelItem = ({ reel, isActive }: { reel: any; isActive: boolean }) => {
  // console.log(reel)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(reel.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(reel.isBookmarked)
  const [likes, setLikes] = useState(reel.likes)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isSub, setIsSub] = useState(false)
  const [commentButtonPosition, setCommentButtonPosition] = useState<{ x: number; y: number } | undefined>()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const commentButtonRef = useRef<HTMLButtonElement>(null)
  const { data: session, status } = useSession();
  const { likeToggle, follow } = useVideo();

  const router = useRouter();
  



  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay failed:", err);
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleSubscribed = (channelId: any, e: any) => {
    togglePlay()
    setIsSub(!isSub)
    const data: any = {
      channelId,
      isSub: !isSub
    }
    follow.mutate(data, {
      onSuccess(data: any) {
        toast.success(data?.message)
      }, onError(data: any) {
        setIsSub(false)
        toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
      }
    })
  }



  const togglePlay = () => {
    console.log("first")
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Play failed:", err);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    togglePlay();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };


  const toggleLike = (videoId: any) => {
    togglePlay()
    if (!session) {
      toast.error("You must Login first!")
      return router.push('/login')
    }
    setIsLiked(!isLiked)
    const data: any = {
      isLiked: !isLiked,
      videoId
    }
    likeToggle.mutate(data, {
      onSuccess(data: any) {
        // console.log(data)
        toast.success(data?.message)
      },
      onError(data: any) {
        console.log(data)
        toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
      }
    })
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const toggleBookmark = () => {
    togglePlay()
    if (!session) {
      toast.error("You must Login first!")
      return router.push('/login')
    }
    setIsBookmarked(!isBookmarked)
  }

  const handleCommentClick = () => {
    togglePlay()
    if (!session) {
      toast.error("You must Login first!")
      return router.push('/login')
    }
    if (commentButtonRef.current) {
      const rect = commentButtonRef.current.getBoundingClientRect()
      setCommentButtonPosition({
        x: rect.left,
        y: rect.top,
      })
    }
    setIsCommentModalOpen(!isCommentModalOpen)
    // console.log(isCommentModalOpen)
  }

  const closeCommentModal = () => {
    setIsCommentModalOpen(false)
  }
  const closeBookmarkModal = () => {
    setIsBookmarked(false)
  }

  return (
    <>
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"  >
        {/* Video */}


        <Video
          ref={videoRef}
          urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
          src={reel?.videoUrl}
          controls
          loop
          className="w-full h-full object-center sm:object-cover"
          muted={isMuted}
        />




        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10" onClick={togglePlay}
        //  onKeyDown={(e) => e.key === "Enter" && togglePlay()}
        >
          <div className="flex items-end justify-between">
            {/* Left Content */}
            <div className="flex-1 mr-4">
              {/* User Info */}
              <div className="flex items-center mb-3">
                <Link
                  href={`/?section=single-video&userId=${reel?.owner[0]?._id}&username=${reel?.owner[0]?.username}`}
                >

                  <Image
                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                    src={reel.owner[0]?.profilePic || ""}
                    width={500}
                    height={500}
                    alt="Picture of the author"
                    className="w-10 h-10 rounded-full mr-3 border border-purple-500"
                  />
                </Link>
                <div className="flex items-center">
                     <Link
                  href={`/?section=single-video&userId=${reel?.owner[0]?._id}&username=${reel?.owner[0]?.username}`}
                >

                  <span className="text-white font-bold text-base sm:text-lg">@{reel.owner[0].username}</span>
                </Link>
                  {/* {reel.user && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )} */}
                </div>
                <button onClick={(e: any) => {
                  handleSubscribed(reel?.user, e)
                }} className="ml-4 px-4 py-1 border border-purple-500 rounded-full text-purple-400 text-sm font-semibold hover:bg-purple-500 hover:text-white transition-colors duration-300">
                  {(reel?.isSubscribed || isSub) ? "UnFollow" : "Follow"}
                </button>
              </div>
              {/* Title */}
              <p className="text-white text-sm sm:text-base leading-relaxed mb-2 text-shadow-sm">{reel.title}</p>
              {/* DESCRIPTION */}
              <p className="text-white text-[8px] sm:text-[12px] leading-relaxed mb-2 text-shadow-sm">{reel.description}</p>
            </div>
            {/* Right Actions */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 z-20">
              {/* Like */}
              <button onClick={() => {
                toggleLike(reel?._id)
              }} className="flex flex-col items-center cursor-pointer group">
                <div className="bg-white/20 rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors">
                  <Heart className={`w-6 h-6 sm:w-7 sm:h-7 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(likes)}</span>
              </button>
              {/* Comment */}
              <button
                ref={commentButtonRef}
                onClick={handleCommentClick}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="bg-white/20 rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.TotalComment)}</span>
              </button>
              {/* Share */}
              <button className="flex flex-col items-center group">
                <div className="bg-white/20 rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors">
                  <Send className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.shares)}</span>
              </button>
              {/* Bookmark */}
              <button onClick={toggleBookmark} className="flex flex-col items-center cursor-pointer group">
                <div className="bg-white/20 rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors">
                  <Save
                    className={`w-6 h-6 sm:w-7 sm:h-7 text-white`}
                  />
                </div>
              </button>
              {/* Mute */}
              <button
                onClick={toggleMute}
                className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                )}
              </button>
              {/* More */}
              <button className="flex flex-col items-center group">
                <div className="bg-white/20 rounded-full p-2 sm:p-3 group-hover:bg-white/30 transition-colors">
                  <MoreHorizontal className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        reelId={reel._id}
        commentCount={reel.comments}
        position={commentButtonPosition}
      />

      <PlaylistModal
        isOpen={isBookmarked}
        onClose={closeBookmarkModal}
        reelId={reel?._id}
      />

    </>
  )
}