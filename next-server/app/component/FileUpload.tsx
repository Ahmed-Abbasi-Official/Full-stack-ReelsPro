"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
  className?:any
}

const FileUpload = ({ onSuccess, onProgress, fileType = "image",className="" }: FileUploadProps) => {
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
  <div className="space-y-2">
    {/* Icon as Upload Trigger */}
   {
    !uploading && (
       <label className="cursor-pointer text-blue-400 w-fit inline-block">
      <Upload size={22} />
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
    )
   }

    {uploading && (
      <>
        <div className="flex gap-1 items-center  font-medium text-[12px]">
          Uploading <Loader2 size={20} className="animate-spin  text-black" />
        </div>
        <progress
          className={`progress progress-accent w-full ${className}`}
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


// "use client";

// import { upload } from "@imagekit/next";
// import { useState, useRef } from "react";
// import { Loader2, Image } from "lucide-react";

// interface FileUploadProps {
//   onSuccess: (res: any) => void;
//   onProgress?: (progress: number) => void;
//   fileType?: "image" | "video";
// }

// const FileUpload = ({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) => {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState<string | null>(null);

//   const inputRef = useRef<HTMLInputElement>(null);

//   const validateFile = (file: File) => {
//     if (fileType === "video") {
//       if (!file.type.startsWith("video/")) {
//         setError("Please upload a valid video file");
//         return false;
//       }
//       if (file.size > 100 * 1024 * 1024) {
//         setError("Video must be less than 100 MB");
//         return false;
//       }
//     } else {
//       const validTypes = ["image/jpeg", "image/png", "image/webp"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please upload a valid image (JPEG, PNG, or WEBP)");
//         return false;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image must be less than 5 MB");
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !validateFile(file)) return;

//     setUploading(true);
//     setError(null);

//     try {
//       const authRes = await fetch("/api/imagekit-auth");
//       const auth = await authRes.json();

//       if (!auth?.authenticationParameters || !auth?.publicKey) {
//         throw new Error("Missing authentication parameters");
//       }

//       const response = await upload({
//         file,
//         fileName: file.name,
//         publicKey: auth.publicKey,
//         signature: auth.authenticationParameters.signature,
//         expire: auth.authenticationParameters.expire,
//         token: auth.authenticationParameters.token,
//         onProgress: (event) => {
//           if (event.lengthComputable) {
//             const percent = Math.round((event.loaded / event.total) * 100);
//             setProgress(percent);
//             if (onProgress) onProgress(percent);
//           }
//         },
//       });

//       onSuccess(response);
//     } catch (err) {
//       console.error("Upload Failed:", err);
//       setError("Upload failed. Please try again.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Custom icon button via label */}
//       <label
//         htmlFor="file-upload"
//         className="cursor-pointer p-2 bg-purple-200 hover:bg-purple-300 rounded-full transition inline-flex items-center justify-center"
//       >
//         {uploading ? (
//           <Loader2 size={20} className="animate-spin text-purple-700" />
//         ) : (
//           <Image size={20} className="text-purple-700" />
//         )}
//       </label>

//       {/* Hidden file input */}
//       <input
//         type="file"
//         id="file-upload"
//         ref={inputRef}
//         accept={fileType === "video" ? "video/*" : "image/*"}
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       {/* Optional: error display */}
//       {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

//       {/* Optional: progress display */}
//       {uploading && (
//         <progress
//           className="progress progress-accent absolute top-full mt-2 w-full"
//           value={progress}
//           max={100}
//         />
//       )}
//     </div>
//   );
// };

// export default FileUpload;

