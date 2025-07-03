"use client"
import React, { useState } from 'react'

const CreatePlaylist = () => {
      const [showPlaylistCreateModal, setShowPlaylistCreateModal] = useState(true)
 const handleSaved = () => {
    console.log("Download clicked")
    setShowPlaylistCreateModal((prev)=>!prev)
  }
      
  return (
    <>
    
    {
           showPlaylistCreateModal &&(
             <div className="w-full h-fit py-8 rounded bg-black  z-10 absolute top-1/2 text-center p-4">
               <h1 onClick={()=>setShowPlaylistCreateModal(false)} className="text-xl text-white font-bold">X</h1>
               <h2 className="text-center py-4 text-white font-bold">Create Playlist</h2>
               <form onSubmit={CreatePlaylist}>
                 <input 
               type="text"
               placeholder="Enter the Collection Name"
               required
               className="text-center px-2 py-1 rounded border-white border w-full text-gray-300"
               />
               <button type="submit" className="bg-blue-500 px-4 rounded py-1 text-lg mt-2 cursor-pointer">Create</button>
               </form>
             </div>
           )
       }
    </>
  )
}

export default CreatePlaylist