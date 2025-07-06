"use client"

import { Video } from '@imagekit/next';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const getUser = async () => {
    const res = await axios.get('/api/profile');
    setUser(res.data.data);
    console.log("User Profile : ", res)

  }

  const handleSingleVideo = (videoId:any)=>{
    router.replace(`/reels/${videoId}`);
  }

  useEffect(() => {
    getUser()
  }, [])
  return (
    <div className='w-full h-full flex flex-col items-center text-start'>
      <div className='flex justify-center my-8'>
        <div>
          <h1>{user?.username}</h1>
          <p>Subscribers : {user?.subscribersCount}</p>
          <p>SubscribedTo : {user?.subscribersToCount}</p>
          <p>Liked Videos : {user?.likedVideos?.length}</p>
          <p>Liked Videos : {user?.likedVideos?.length}</p>
          <p>totalLikesCount : {user?.totalLikesCount}</p>
          <p>Total Videos : {user?.videos?.length}</p>
        </div>
      </div>
      <div className='flex'>
        Videos : {
          user?.videos?.length > 0 && (
            user?.videos?.map((data: any) => (
              <div className='my-2 flex mx-2 mt-8'>
                <div>
                  <h2>Title : {data?.title}</h2>
                 <span 
                 onClick={(e)=>{
                  e.preventDefault();
                  handleSingleVideo(data?._id)
                 }}
                 >
                   <Video
                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
                    src={`${data?.videoUrl}`}
                    className="w-[200px] h-[200px] object-cover"
                    width={500}
                    height={500}
                  />  
                 </span>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  )
}

export default ProfilePage