"use client"

import { type UniqueUsernameError, useUser } from "@/hooks/useUser"
import type { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import OTPInput from "react-otp-input"
import { toast } from "react-toastify"

const Input = ({ ...props }) => {
  return (
    <input
      type="text"
      {...props}
      // Updated className to match the theme
      className="sm:w-16! w-10! sm:h-14 h-10 text-center md:text-2xl font-extrabold rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300  sm:mx-2" // Added mx-2 for spacing
    />
  )
}

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false) // This state seems redundant with verifyOtp.isPending, but keeping it as it was in the original code.
  const [isSending, setIsSending] = useState<boolean>(false)
  const router = useRouter()
  const { username } = useParams<{ username: string }>()
  const { verifyOtp } = useUser() ?? {} // Added nullish coalescing for safety

  //* VERIFY OTP :
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!verifyOtp) {
      toast.error("OTP verification service not available.")
      return
    }
    const data: {
      username: string
      code: string
    } = {
      username,
      code: otp,
    }
    setIsLoading(true) // Set local loading state
    verifyOtp.mutate(data, {
      onSuccess(resData) {
        // Changed data to resData
        console.log(resData)
        toast.success(resData.message)
        router.push("/login")
        setIsLoading(false) // Reset local loading state on success
      },
      onError(error) {
        // Changed data to error
        console.log(error)
        toast.error((error as AxiosError<UniqueUsernameError>)?.response?.data?.message || "OTP verification failed.")
        setIsLoading(false) // Reset local loading state on error
      },
    })
  }

  const handleResendOtp = async () => {
    setIsSending(true)
    // Add your resend OTP logic here
    // For example: await resendOtpMutation.mutate(username);
    // Then, after success/failure:
    // setIsSending(false);
    toast.info("Resend OTP functionality not implemented yet.") // Placeholder toast
    setIsSending(false) // Reset for demonstration
  }

  return (
    <div className="relative flex items-center justify-center sm:px-0 px-3 min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background Image/Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url("/images/video-background.png")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black/70 to-blue-900/50"></div>

      {/* OTP Verification Card */}
      <div className="relative z-10 w-full max-w-fit mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 animate-fade-in text-center">
        <header className="mb-8">
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Reels Media
          </h1>
          <h2 className="text-2xl font-bold mb-1 text-gray-100">Mobile Phone Verification</h2>
          <p className="text-[15px] text-gray-300">
            Enter the 6-digit verification code that was sent to your phone number.
          </p>
          <p className="text-[15px] text-gray-300">Code will expire in 2 minutes</p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <Input {...props} />}
              containerStyle="flex justify-center gap-2" // Added container style for better spacing
            />
          </div>
          <div className="max-w-[260px] mx-auto mt-8">
            <button
              type="submit"
              className={`flex w-full justify-center py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 ${verifyOtp?.isPending || isLoading || otp.length < 6 ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
              disabled={verifyOtp?.isPending || isLoading || otp.length < 6}
            >
              {verifyOtp?.isPending || isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying Account...
                </span>
              ) : (
                "Verify Account"
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-gray-400 mt-4">
          Didn&apos;t receive code?{" "}
          <button
            onClick={handleResendOtp}
            className={`font-semibold text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-300 ${isSending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Resend"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtpPage
