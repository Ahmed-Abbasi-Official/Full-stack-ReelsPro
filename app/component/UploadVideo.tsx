"use client";

import { useState } from "react";
import { Video, Upload, X } from "lucide-react";
import FileUpload from "./FileUpload"; // Adjust the path as needed
import axios from "axios";

export default function UploadVideo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isPublic, setIsPublic] = useState(true);
    const [videoUrl, setVideoUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!videoUrl){
           return alert("Required Video URL")
        }

        try {
            const data = {
                title,
                description,
                isPublic,
                videoUrl,
            }

            const res = await axios.post('/api/video', data)
            
        } catch (error) {
            console.log(error)
        }finally{
            setTitle("")
            setDescription("")
            setVideoUrl("")
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                    <div className="border-b border-gray-700 p-6">
                        <h1 className="flex items-center gap-2 text-xl font-semibold text-white">
                            <Video className="w-6 h-6 text-purple-400" />
                            Create New Video
                        </h1>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-200">Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-200">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    required
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                />
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-200 cursor-pointer">Upload Video *</label>
                                <FileUpload
                                    fileType="video"
                                    onSuccess={(res) => {
                                        console.log("Upload Response:", res);
                                        setVideoUrl(res.url);
                                    }}
                                    onProgress={(res) => setUploadProgress(res)}
                                />
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <p className="text-sm text-purple-400">Uploading: {uploadProgress}%</p>
                                )}
                                {videoUrl && (
                                    <video controls src={videoUrl} className="w-full mt-4 rounded-md" />
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-700/30">
                                <span className="text-white">Visibility</span>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isPublic ? "bg-purple-600" : "bg-gray-600"
                                        }`}
                                >
                                    <span
                                        className={`bg-white w-4 h-4 rounded-full transform transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                // disabled={uploadProgress==100}
                                className="w-full py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-all"
                            >
                                Create Video
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
