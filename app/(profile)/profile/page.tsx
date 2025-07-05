"use client"

import axios from 'axios'
import React, { useEffect } from 'react'

const ProfilePage = () => {
    const getUser = async()=>{
        const res =await axios.get('/api/profile');
        console.log("User Profile : ",res)

    }
    useEffect(()=>{
        getUser()
    },[])
  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage