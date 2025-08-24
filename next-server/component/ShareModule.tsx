import { UniqueUsernameError } from '@/hooks/useUser';
import { useGetShareUsers, useVideo } from '@/hooks/useVideo';
import { Image } from '@imagekit/next';
import { AxiosError } from 'axios';
import { X } from 'lucide-react';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl:any
}

const ShareModule = ({ isOpen, onClose , videoUrl }: ShareModalProps) => {

    const { getShareUsers } = useGetShareUsers();
    const {sendVideo} = useVideo();

    useEffect(() => {
        if (isOpen) {
            getShareUsers.refetch(); 
            console.log(getShareUsers?.data)
        }
    }, [isOpen, getShareUsers]);

    const handleSendVideo=(reciverId:any)=>{
        const data = {
            reciverId,
            videoUrl
        }
        // console.log(data)
        sendVideo.mutate(data,{
            onSuccess(data){
                console.log(data)
            },onError(data){
                console.log(data)
                toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
            }
        });
    }

    if (!isOpen) return null;
    // console.log("aya")
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />
            {/* Modal */}
            <div
                className={`fixed top-64 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl bg-gray-900 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Share Video</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ALL USERS */}

                {/* Users List */}
                <div className="p-4 border-b border-gray-700 text-white ">
                    {getShareUsers.isPending ? (
                        <p>Loading...</p>
                    ) : getShareUsers.isError ? (
                        <p>Error fetching users</p>
                    ) : (
                        <ul className='flex justify-start flex-wrap  overflow-y-auto very-thin-scrollbar h-52 '>
                            {getShareUsers?.data?.message?.map((user: any) => (
                              <>
                               <li key={user?.user?._id}
                               onClick={()=>{
                                handleSendVideo(user?.user?._id)
                                onClose()
                               }}
                               >
                                <div className='flex flex-col justify-center items-center gap-1 cursor-pointer mt-1 hover:scale-110 ml-3  '>
                                 <Image
                                 urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                                 src={user?.user?.profilePic || ""}
                                 alt="user_pic"
                                 width={50}
                                 height={50}
                                 className='h-10 w-10 overflow-hidden rounded-full border-2 border-white/60 shadow-md sm:h-12 sm:w-12 lg:h-16 lg:w-16   hover:shadow-white '
                                 />
                                 <p 
                                 className='text-gray-200 text-sm sm:text-md'
                                 >{user?.user?.username || "username"}</p>
                               </div>
                               </li>
                              </>
                               
                            ))}
                        </ul>
                    )}
                </div>


            </div>
        </>
    )
}

export default ShareModule