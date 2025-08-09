"use client"

import { useGetComments, useVideo } from "@/hooks/useVideo"
import { X, Send } from "lucide-react"
import { Image } from "@imagekit/next";
import { MdDelete } from "react-icons/md";

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { toast } from "react-toastify";
import { UniqueUsernameError } from "@/hooks/useUser";
import { AxiosError } from "axios";

interface Comment {
  _id?: string
  username: string
  user: {
    _id:string
    username: string
    profilePic: string
  }
  comment: string
  likes: number
  isLiked: boolean
  timestamp: string
  createdAt: Date
  replies?: Comment[]
}

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  reelId: string
  commentCount: number
  position?: { x: number; y: number }
}


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

const CommentItem = ({ comment }: { comment: Comment }) => {
  // console.log(comment)
  const { deleteComment } = useVideo();
   const { data: session } = useSession();
  //  console.log(session)
  const handleDeleteComment = (commentId: any) => {
    const data: any = {
      commentId
    }
    deleteComment.mutate(data, {
      onSuccess(data) {
        toast.success(data?.message)
      },
      onError(data) {
        // console.log(data)
        toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
      }
    })
  }
  return (
    <div className="flex space-x-3 py-3 border-b border-gray-700 last:border-b-0">
      <Image
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
        src={comment.user.profilePic}
        width={500}
        height={500}
        alt="Picture of the author"
        className="w-10 h-10 rounded-full mr-3 border border-purple-500"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-sm text-white">{comment.username}</span>
          <span className="text-xs text-gray-400">{format(new Date(comment.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">{comment.comment}</p>
        {
          deleteComment?.isPending && (
            <p className="text-sm text-red-400 leading-relaxed ">Processing</p>
          )
        }
        <div className="flex items-center space-x-4 mt-2">
          <button className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Reply</button>
        </div>
      </div>

      {(session?.user?._id === comment?.user?._id) &&(<button
        onClick={(e) => {
          e.preventDefault();
          handleDeleteComment(comment?._id);
        }}
        className="p-1 text-gray-400 hover:text-gray-200 transition-colors">
        {/* <Delete className="w-4 h-4" /> */}
        <MdDelete className="w-4 h-4 hover:text-red-500" />
      </button>)}
    </div>
  )
}

export default function CommentModal({ isOpen, onClose, reelId, commentCount, position }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { getComments } = useGetComments(reelId,isOpen && !!reelId);
  const { sendComment } = useVideo();

  // console.log(getComments)



  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (getComments?.isSuccess && getComments.data?.data) {
      setComments(getComments.data.data)
      console.log(getComments?.data)
    }
  }, [getComments?.isSuccess, getComments?.data])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // const comment: Comment = {
    //   id: Date.now().toString(),
    //   user: {
    //     username: "you",
    //     avatar: "/placeholder.svg?height=32&width=32&text=You",
    //     isVerified: false,
    //   },
    //   text: newComment.trim(),
    //   likes: 0,
    //   isLiked: false,
    //   timestamp: "now",
    // }
    // setComments([comment, ...comments])
    const data: any = {
      videoId: reelId,
      comment: newComment,
    }
    sendComment.mutate(data, {
      onSuccess(data) {
        toast.success(data?.message)
      },
      onError(data) {
        toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
      }
    })
    setNewComment("")
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />
      {/* Mobile Modal - Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="bg-gray-900 rounded-t-2xl shadow-2xl h-[70vh] flex flex-col border-t border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Comments ({formatNumber(commentCount)})</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-2" key={reelId}>
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
          {/* Comment Input */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              {/* <Image
                src="/placeholder.svg?height=32&width=32&text=You"
                alt="Your avatar"
                className="w-8 h-8 rounded-full flex-shrink-0 border border-purple-500"
                width={32}
                height={32}
              /> */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-2 bg-gray-800 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || sendComment?.isPending}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                >
                  {sendComment?.isPending ? (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Desktop Modal - Positioned next to comment icon */}
      <div
        ref={modalRef}
        className={`hidden lg:block fixed z-50 w-80 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 transform transition-all duration-200 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
        style={{
          left: position ? Math.max(16, Math.min(position.x + 70, window.innerWidth - 336)) : "50%",
          top: position ? Math.max(16, Math.min(position.y - 120, window.innerHeight - 416)) : "50%",
          transform: !position ? "translate(-50%, -50%)" : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Comments ({formatNumber(commentCount)})</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Comments List */}
        <div className="h-80 overflow-y-auto px-4 py-2">
          {
            getComments?.isPending ? (
              <h2 className="text-white text-2xl">Loading...</h2>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))
            )
          }
        </div>
        {/* Comment Input */}
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            {/* <Image
              src="/placeholder.svg?height=32&width=32&text=You"
              alt="Your avatar"
              className="w-8 h-8 rounded-full flex-shrink-0 border border-purple-500"
              width={32}
              height={32}
            /> */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-gray-800 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmitting || getComments?.isPending}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
