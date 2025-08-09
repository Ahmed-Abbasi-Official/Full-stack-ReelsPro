"use client";
// import { apiClient, PlaylistFormData } from "@/lib/api-client";
// import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import { Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

export default function WatchLaterTab({ collectionModalOpen, setCollectionModalOpen }: {
  collectionModalOpen: boolean;
  setCollectionModalOpen: (open: boolean) => void;
}) {
  if (!collectionModalOpen) return null;

  const [savedVideo, setSavedVideo] = useState<[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    setLoading(true);
    // const getSavedVideo = async () => {
    //   await asyncHandlerFront(
    //     async() => {
    //       const response = await apiClient.getSavedVideo();
    //       setSavedVideo(response.data)
    //     },
    //     (error) => toast.error(error.message)
    //   )
    //   setLoading(false);
    // }
    // getSavedVideo();
  }, []);

  // console.log(savedVideo);

  const handleDelete = async () => {
    // await asyncHandlerFront(
    //   async() => {
    //     await apiClient.deleteSaved(savedVideo[0]?.user?._id)
    //     toast.success("Deleted saved collection");
    //     setCollectionModalOpen(false);
    //   },
    //   (error) => console.log(error.message)
    // )
  }

  return (
     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl w-full max-w-4xl p-6 relative shadow-xl border border-gray-300 dark:border-gray-700">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setCollectionModalOpen(false)}>
          <X size={18} className="text-gray-800 dark:text-gray-100" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-100">Watch Later</h2>
            {/* <p className="text-sm text-primary-600 dark:text-primary-300 uppercase"> {savedVideo[0]?.user?.userName || "ah"} </p> */}
          </div>  
          {savedVideo.length > 0 && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 cursor-pointer px-4 py-2 mt-4 rounded-md text-sm bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition">
              <Trash2 size={16} />
              Delete Collection
            </button>
          )}
        </div>

        Video grid
        {/* {loading ? ( <Loader /> ) 
        : savedVideo[0]?.videos?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
            {savedVideo[0].videos.map((video: any) => (
              <div
                key={video._id}
                className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow hover:shadow-md transition"
              >
                <video
                  src={video.videoUrl}
                  className="w-full h-40 object-cover rounded-lg"
                  controls
                />
                <div className="mt-2">
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-100">
                    {video.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No videos saved yet.
          </p>
        )} */}
      </div>
    </div>
  );
}