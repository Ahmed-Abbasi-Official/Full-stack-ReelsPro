"use client";

import { videoSchema } from "@/schemas/VideoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Video, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import FileUpload from "@/app/component/FileUpload";
import { useRouter } from "next/navigation";
import { useVideo } from "@/hooks/useVideo";
import { AxiosError } from "axios";
import { UniqueUsernameError } from "@/hooks/useUser";
// import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
// import { apiClient } from "@/lib/api-client";

export default function CreateTab({
    isModalOpen,
    setIsModalOpen,
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}) {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { createVideo } = useVideo();
    //   const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
        setValue,
        watch,
    } = useForm<z.infer<any>>({
        resolver: zodResolver(videoSchema),
        defaultValues: {
            title: "",
            description: "",
            videoUrl: "",
        },
    });

    const onSubmit = async (data: z.infer<any>) => {
        // console.log(data)
        createVideo.mutate(data, {
            onSuccess(data: any) {
                // console.log(data)
                // alert(data?.message)
                toast.success(data?.message)
                setIsModalOpen(false)
            }, onError(data: any) {
                console.log(data)
                toast.error(
                    (data as AxiosError<UniqueUsernameError>)?.response?.data?.message || "Something went wrong"
                );

                setIsModalOpen(false)
            }
        })

    };

    // if(createVideo?.isSuccess){
    //     toast.success(createVideo?.data?.message)
    // }

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-200/40 overflow-hidden transition-all duration-300">
                        <button
                            className="absolute top-3 right-3 z-10 p-2 cursor-pointer text-gray-500 hover:text-purple-600 bg-white/70 rounded-full shadow-sm transition"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}>
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800"> Create New Reel </h3>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            {/* Step 1: Upload */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-300 transition cursor-pointer bg-white/60 backdrop-blur-sm">
                                        <Video className="w-14 h-14 mx-auto mb-4 text-gray-400" />
                                        <h4 className="text-lg font-semibold mb-2 text-gray-800"> Upload Your Video </h4>
                                        <p className="text-sm text-gray-500 mb-4"> Choose a video file to create your reel</p>
                                        <FileUpload
                                            fileType="video"
                                            onSuccess={(res) => setValue("videoUrl", res.url)}
                                            onProgress={(res) => setUploadProgress(res)}
                                        />
                                    </div>
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <p className="text-xl text-black">Uploading: {uploadProgress}%</p>
                                    )}
                                    {/* <h2 className="text-black">00</h2> */}

                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>• Supported formats: MP4, MOV, AVI</p>
                                        <p>• Maximum file size: 100MB</p>
                                        <p>• Recommended duration: 15-60 seconds</p>
                                    </div>

                                    <div className="flex justify-end">
                                        {watch("videoUrl") && (
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg shadow hover:shadow-lg text-sm font-medium transition"
                                                onClick={() => setCurrentStep(2)}>
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Form */}
                            {currentStep === 2 && (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                                        {/* Preview */}
                                        <div className="w-full lg:w-2/5">
                                            <h4 className="font-semibold mb-3 text-gray-800 text-sm sm:text-base">Video Preview</h4>
                                            {watch("videoUrl") && (
                                                <div className="aspect-[9/10] bg-black rounded-lg overflow-hidden mx-auto lg:mx-0">
                                                    <video
                                                        src={watch("videoUrl")}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Form Fields */}
                                        <div className="w-full lg:w-3/5 space-y-4">
                                            <div>
                                                <label className="block font-semibold mb-2 text-sm text-gray-800">Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter an engaging title..."
                                                    maxLength={100}
                                                    {...register("title")}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 bg-white/70 backdrop-blur-sm text-sm text-gray-800"
                                                />
                                                {errors.title?.message && (
                                                    <p className="text-red-500 text-sm">{String(errors.title.message)}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block font-semibold mb-2 text-sm text-gray-900">Description </label>
                                                <textarea
                                                    placeholder="Tell your audience about this reel..."
                                                    maxLength={500}
                                                    {...register("description")}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 bg-white/70 backdrop-blur-sm text-sm text-gray-800 h-24 resize-none"
                                                />
                                                {errors?.description?.message && (
                                                    <p className="text-red-500 text-sm">{String(errors?.description?.message)}</p>
                                                )}
                                            </div>

                                            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="text-gray-900 dark:text-white">Allow comments</span>
                                                </label>
                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="text-gray-900 dark:text-white">Public reel</span>
                                                </label>
                                            </div> */}
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex flex-col sm:flex-row justify-between gap-3 border-t pt-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                                            onClick={() => setCurrentStep(1)}
                                            disabled={isSubmitting}>
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg shadow hover:shadow-lg disabled:opacity-50 transition text-sm font-medium flex items-center justify-center gap-2"
                                            disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    Publish Reel
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Publishing Overlay */}
                        {createVideo?.isPending && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                <div className="text-center p-6">
                                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 "> Publishing Your Reel </h4>
                                    <p className="text-sm text-gray-600 ">Please wait while we process your video...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}