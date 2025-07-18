"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be less than 100 MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, or WEBP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5 MB");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      // Get authentication parameters
      const authRes = await fetch("/api/imagekit-auth");
      const auth = await authRes.json();

      if (!auth?.authenticationParameters || !auth?.publicKey) {
        throw new Error("Missing authentication parameters");
      }

      // Upload using ImageKit
      const response = await upload({
        file,
        fileName: file.name,
        publicKey: auth.publicKey,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
            if (onProgress) onProgress(percent);
          }
        },
      });

      onSuccess(response);
    } catch (err) {
      console.error("Upload Failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="file-input file-input-accent"
      />

      {uploading && (
        <>
          <div className="flex gap-2 items-center font-medium text-[14px]">
            Uploading <Loader2 size={20} className="animate-spin text-white" />
          </div>
          <progress
            className="progress progress-accent w-full"
            value={progress}
            max={100}
          />
        </>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default FileUpload;
