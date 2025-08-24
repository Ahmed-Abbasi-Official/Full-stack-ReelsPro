"use client"

import { UniqueUsernameError } from '@/hooks/useUser'
import { useGetPlaylist, useVideo } from '@/hooks/useVideo'
import { AxiosError } from 'axios'
import { Plus, X } from 'lucide-react'
import type React from "react"
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

interface Playlist {
  id: string
  name: string
  itemCount: number
}

interface PlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  reelId: string
}


export default function PlaylistModal({ isOpen, onClose, reelId }: PlaylistModalProps) {
  const [playlists, setPlaylists] = useState<[]>([])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const {getPlaylist} = useGetPlaylist(reelId,isOpen && !!reelId);
  const { creatingPlaylist, saveToggle }=useVideo()

  useEffect(() => {
    if (isOpen && inputRef.current) {
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
      if (getPlaylist?.isSuccess && getPlaylist.data?.data) {
        setPlaylists(getPlaylist.data.data)
        // console.log(getPlaylist)
      }else{
        onClose()
      }
    }, [getPlaylist?.isSuccess, getPlaylist?.data])

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlaylistName.trim() || isCreating) return

    setIsCreating(true)
    const data:any= {playlistName:newPlaylistName}
    creatingPlaylist.mutate(data,{
      onSuccess(data){
        // toast.success(data?.message);
      },
      onError(data){
         toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
      }
    })
    setNewPlaylistName("")
    setIsCreating(false)
    // toast.success(`Playlist "${newPlaylist.name}" created!`)
  }

  const handleSaveVideo = async (playlistId: string,e:any) => {
    e.preventDefault()
    const data:any = {
      playlistId,
      videoId:reelId
    }
    saveToggle.mutate(data,{
      onSuccess(data:any){
        // toast.success(data?.message);
        onClose()
      },
      onError(data:any){
        toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
        onClose()
      }
    })
    
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-gray-900 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Save to Playlist</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Playlist */}
        <div className="p-4 border-b border-gray-700">
          <form onSubmit={handleCreatePlaylist} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder={creatingPlaylist?.isPending ? ("wait....") :"Create new playlist..."}
                className="w-full pl-4 pr-12 py-2 bg-gray-800 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isCreating}
              />
              <button
                type="submit"
                disabled={!newPlaylistName.trim() || isCreating}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-purple-400 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Playlists List */}
        <div className="max-h-60 overflow-y-auto p-4">
          {getPlaylist?.isPending ? (
             <p className="text-gray-400 text-center py-4">Wait it's Loading!</p>
          ) :(playlists.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No playlists found. Create one above!</p>
          ) : (
            playlists.map((playlist:any) => (
              <div
                key={playlist._id}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {playlist.playlistName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{playlist.playlistName}</p>
                    {/* <p className="text-gray-400 text-xs">{playlist.itemCount} items</p> */}
                  </div>
                </div>
                <button onClick={(e) => handleSaveVideo(playlist._id,e)}  className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  {saveToggle?.isPending && ("wait...")}
                  {playlist?.isChecked ? "UnSaved" : "Save"}
                </button>
              </div>
            ))
          ))}
        </div>
      </div>
    </>
  )
}