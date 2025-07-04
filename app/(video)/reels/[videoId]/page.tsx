"use client"

import { Video } from "@imagekit/next"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CreatePlaylist from "../../(playlist)/create-playlist/page"
// import { useSearchParams } from "next/navigation" 

interface Comment {
  id: string
  user: string
  avatar: string
  text: string
  timestamp: string
}
interface Reel {
  videoUrl: string;
  _id:string
  // add other properties if needed
}
export default function ReelComponent() {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(1234)
  const [playlistName, setPlaylistName] = useState("")
  const [playlists, setPlaylists] = useState<[]>([])
  const [showPlaylistCreateModal, setShowPlaylistCreateModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isPlaying, setIsPlaying] = useState(true)
  const [counter, setCounter] = useState(0)
  const [reels, setReels] = useState<Reel[]>([])
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "john_doe",
      avatar: "/placeholder.svg?height=32&width=32",
      text: "Amazing content! 🔥",
      timestamp: "2h",
    },
    {
      id: "2",
      user: "sarah_wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      text: "This is so cool! How did you make this?",
      timestamp: "1h",
    },
    {
      id: "3",
      user: "mike_chen",
      avatar: "/placeholder.svg?height=32&width=32",
      text: "Love the creativity! 👏",
      timestamp: "45m",
    },
  ])

  const router = useRouter();



  // const videoId = useSearchParams();
  // console.log(videoId)

  const { videoId } = useParams<{ videoId: string }>();

  const handleLike = async () => {
    setIsLiked(!isLiked)

    console.log(isLiked, videoId)

    const res = await axios.post('/api/liked-videos', {
      isLiked,
      videoId
    })

    console.log(res)

    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }



  const handleComment = () => {
    setShowComments(!showComments)
  } 

  const handleShare = () => {
    console.log("Share clicked")
  }

  const handleSaved = () => {
    console.log("Download clicked")
    setShowPlaylistCreateModal((prev)=>!prev)
  }

  const createPlaylist = async(e:any)=>{
    e.preventDefault();
   const res =  await axios.post('/api/create-playlist',{
      playlistName
    })
    console.log("res of playlist creation  : ",res)
  } 

  const getPlaylists = async()=>{
    const res =await axios.get(`/api/get-playlist?videoId=${videoId}`);
    console.log(res);
  
      if(res.data.statusCode === 200)
      {
        setPlaylists(res.data.data)
      }
    
  }

  const savedVideo = async(playlistId:any)=>{
   const res = await axios.post('/api/saved-video',{
      videoId,
      playlistId
    });
    console.log(res)
  }

  const handleDelete = async () => {
    const res = await axios.delete("/api/video", {
      data: { videoId }, // Use `data` if you're sending a body
    });
    console.log(res)

      setCounter((prev)=>prev+1)
    

    router.replace(`/reels/${reels[counter]._id}`)

    

  }
  

  const getAllVideos = async () => {
    const res = await axios.get(`/api/video`);
    const res2 = await axios.get(`/api/get-single-video?videoId=${videoId}`)
    console.log("All videos GET : ",res2)
    setReels(res.data.data)
    

  }

  useEffect(() => {
    getAllVideos();
    getPlaylists();
  }, [counter])
  // useEffect(() => {
  // }, [createPlaylist])


  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        user: "current_user",
        avatar: "/placeholder.svg?height=32&width=32",
        text: commentText,
        timestamp: "now",
      }
      setComments([newComment, ...comments])
      setCommentText("")
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  console.log("reels : ",playlists)

  return (
    <div className="max-w-md mx-auto bg-black text-white relative h-screen overflow-hidden">
     
      {/* Video/Content Area */}
      <div className="relative h-full">
        {/* Placeholder for video */}
        {/* <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg opacity-80">Video Content Here</p>
          </div>
        </div> */}

        

        <Video
          urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
          src={`${reels[counter]?.videoUrl}`}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />

        {/* Play/Pause Button */}
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-4 transition-all duration-200"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* User Profile Section */}
        <div className="absolute bottom-20 left-4 right-20">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src="/placeholder.svg?height=48&width=48"
                alt="Creator"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">@creative_creator</h3>
              <p className="text-sm text-gray-300">Content Creator</p>
            </div>
            <button className="px-4 py-1 text-sm font-medium text-white border border-white rounded-md hover:bg-white hover:text-black transition-colors duration-200">
              Follow
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-white text-sm leading-relaxed">
              Check out this amazing content! 🚀 What do you think?{" "}
              <span className="text-blue-300">#creative #content #viral</span>
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>2.1M views</span>
              <span>•</span>
              <span>3 days ago</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6">
          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all duration-200"
              onClick={handleLike}
            >
              <svg
                className={`w-6 h-6 ${isLiked ? "text-red-500 fill-current" : ""}`}
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <span className="text-xs text-white mt-1">{likesCount}</span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all duration-200"
              onClick={handleComment}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <span className="text-xs text-white mt-1">{comments.length}</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all duration-200"
              onClick={handleShare}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
            <span className="text-xs text-white mt-1">Share</span>
          </div>

          {/* Saved Button */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all duration-200"
              onClick={handleSaved}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <span className="text-xs text-white mt-1">Save</span>
          </div>

          {/* Delete Button */}
          <div className="flex flex-col items-center">
            <button
              className="w-12 h-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-red-600 hover:bg-opacity-70 text-white flex items-center justify-center transition-all duration-200"
              onClick={handleDelete}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <span className="text-xs text-white mt-1">Delete</span>
          </div>

          {/* More Options */}
          <div className="flex flex-col items-center">
            <button className="w-12 h-12 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Overlay */}
      {showComments && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-white hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.avatar || "/placeholder.svg"}
                    alt={comment.user}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{comment.user}</span>
                      <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                    </div>
                    <p className="text-white text-sm mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <img src="/placeholder.svg?height=32&width=32" alt="You" className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendComment()}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       {
            showPlaylistCreateModal &&(
              <div className="w-full h-fit py-8 rounded bg-black  z-10 absolute top-1/2 text-center p-4">
                <h1 onClick={()=>setShowPlaylistCreateModal(false)} className="text-xl text-white font-bold">X</h1>
                {
                  playlists.length === 0 ? "No Playlist Exist" :(
                    <>
                    {
                      playlists.map((val:any)=>(
                        <>
                        <div className="flex gap-4 justify-center">
                          <h1 onClick={(e)=>{
                            e.preventDefault();
                            savedVideo(val._id)
                          }}>{val.playlistName}</h1>
                        <h1>{val.isChecked ? "Already Saved" : "you can save"}</h1>
                        </div>
                        </>
                      ))
                    }
                    </>
                  )
                }
                <h2 className="text-center py-4 text-white font-bold">Create Playlist</h2>
                <form onSubmit={createPlaylist}>
                  <input 
                type="text"
                placeholder="Enter the Collection Name"
                value={playlistName}
                onChange={(e)=>setPlaylistName(e.target.value)}
                required
                className="text-center px-2 py-1 rounded border-white border w-full text-gray-300"
                />
                <button type="submit" className="bg-blue-500 px-4 rounded py-1 text-lg mt-2 cursor-pointer">Create</button>
                </form>
              </div>
            )
        }
    </div>
  )
}
