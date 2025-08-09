"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ChangeEvent, useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { type SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/schemas/registerSchema"
import { Bookmark, Check, Eye, EyeOff, Heart, Loader2, LoaderCircle, MessageCircle, Play, Share2,Share } from "lucide-react"
import { type UniqueUsernameError, useUser } from "@/hooks/useUser"
import type { AxiosError } from "axios"
import { generateAvatar } from "@/lib/avatar"
import FileUpload from "@/app/component/FileUpload"
import { upload } from "@imagekit/next"
import { uploadGeneratedAvatar } from "@/lib/uploadGeneratedAvatar"
import { toast } from "react-toastify"
import Image from "next/image"
import video from '../../../public/vertical-video-thumbnail.png'

// Define the type for form values based on your schema
type FormValues = {
  username: string
  email: string
  password: string
  // If registerSchema includes confirmPassword, uncomment this:
  // confirmPassword: string;
}

const RegisterPage = () => {
  const [username, setusername] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { userUnique, signUpUser } = useUser() ?? {}
  const router = useRouter()

  const FloatingReelCard = ({ className, delay = 0 }: any) => (
    <div
      className={`absolute bg-white rounded-2xl shadow-lg p-4 w-48 ${className}`}
      style={{ animation: `float 6s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      <div className="relative">
        <Image
          src={video}
          alt="Reel thumbnail"
          className="w-full h-32 object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">0:15</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="text-sm text-gray-600">2.4K</span>
        </div>
        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-gray-400" />
          <Share2 className="w-4 h-4 text-gray-400" />
          <Bookmark className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );


  // * DEBOUNCING :
  // const debounced = useDebounceCallback(setusername, 100)

  //* REACT-HOOK-FORM :
  const {
    register,
    handleSubmit,
    formState: { errors },

  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  //* CHECK USERNAME UNIQUE :
  useEffect(() => {
    const checkUsernameUnique = () => {
      if(!username) return 
      if (username) {
        userUnique.mutate(username)
      }
    }
    checkUsernameUnique()
  }, [username])

  //* ONSUBMIT :
  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true)
    const avatarResponse = await uploadGeneratedAvatar(username);
    const imageUrl = avatarResponse.url;
    if (imageUrl) {
      setLoading(false)
      const newData = {
        ...data, profilePic: imageUrl
      }
      signUpUser.mutate(
        { username, ...newData },
        {
          onSuccess(data) {
            // console.log(data)
            toast.success(data.message)
            router.push(`/verify-otp/${username}`)
          },
          onError(data) {
            console.log(data)
            toast.error((data as AxiosError<UniqueUsernameError>)?.response?.data?.message)
          },
        },
      )
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden sm:pt-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <FloatingReelCard className="top-16 left-16 opacity-60" delay={0} />
        <FloatingReelCard className="top-32 right-20 opacity-50" delay={2} />
        <FloatingReelCard className="bottom-32 left-20 opacity-40" delay={4} />
        <FloatingReelCard className="bottom-16 right-32 opacity-60" delay={1} />
        <FloatingReelCard className="top-1/2 left-8 opacity-30" delay={3} />
        <FloatingReelCard className="top-1/3 right-8 opacity-40" delay={5} />

        <div className="absolute top-20 right-[460px] animate-ping opacity-20">
          <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-40 left-[460] animate-ping opacity-20" style={{ animationDelay: '2s' }}>
          <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>

        <div className="absolute top-1/4 left-[480px] animate-bounce" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center shadow-lg opacity-70">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute top-3/4 right-[485px] animate-bounce" style={{ animationDelay: '3s' }}>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg opacity-70">
            <Share2 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="relative z-10 h-auto flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
            <div className="text-center mb-2">
              {/* Logo */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-[55px] h-[55px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-bounce">
                    <div className="absolute inset-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-black">
                    Reels<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pro</span>
                  </h1>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-black mb-1">Create Your Account</h2>
              <p className="text-gray-300">Join millions of creators worldwide</p>
            </div>

            <div className="flex justify-center mb-4">
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    id="text"
                    placeholder="@your_username"
                    className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md text-[16px]"
                    required
                    value={username}
                    onChange={(e: any) => setusername(e.target.value)}
                  />
                  {userUnique?.isPending && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <LoaderCircle className="w-5 h-5 animate-spin text-purple-400" />
                    </div>
                  )}
                </div>
                {userUnique && (
                  <div className="flex items-center gap-2">
                    {/* {userUnique?.isPending && (
                        <Check className="w-4 h-4 text-green-400" />
                      )} */}

                    {userUnique?.isSuccess && (<p className='text-sm text-green-400'>
                      {userUnique?.data?.message}
                    </p>)}
                    {userUnique?.isError ? (<p className='text-sm text-red-400'>
                      {(userUnique.error as AxiosError<UniqueUsernameError>)?.response?.data?.message}
                    </p>):""}

                    {/* {errors.userName && ( <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>)} */}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md text-[16px]"
                  {...register('email')}
                />
                {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>)}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md text-[16px]"
                    {...register('password')}
                  />
                  {errors.password && (<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="curaor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={signUpUser?.isPending || loading || !userUnique?.isSuccess} className="cursor-pointer w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-[16px]">
                {(signUpUser?.isPending || loading ) ? <div className="flex justify-center gap-3"><Loader2 className="w-6 h-6 animate-spin" />Creating your account...</div> : 'Start Creating Amazing Reels'}
              </button>
            </form>


            <div className="mt-4 space-y-2 text-center">

              <div className="border-t border-gray-200 pt-3">
                <p className="text-gray-600">Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold">Sign in</Link></p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Join thousands of creators worldwide</p>
            <div className="flex justify-center gap-8">
              <div>
                <div className="text-xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Creators</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">2M+</div>
                <div className="text-sm text-gray-600">Reels</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">100M+</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  )
}

export default RegisterPage
