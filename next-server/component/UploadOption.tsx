import { useState } from "react";
import { Paperclip, ImageIcon, VideoIcon } from "lucide-react";
import FileUpload from "@/app/component/FileUpload";

export const UploadOptions = ({ onUpload }: { onUpload: (url: string) => void }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showPin, setShowPin] = useState(true);
    const [type, setType] = useState<"image" | "video" | null>(null);
    // console.log(showOptions)

    return (
        <div className="relative">
            {/* Pin icon trigger */}
            {showPin && (<button
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-800 hover:text-blue-400"
            >
                <Paperclip size={20} />
            </button>)}

            {/* Dropdown options */}
            {showOptions && (
                <div className="absolute z-10 mb-2 -top-14 -left-12 flex flex-col gap-2 bg-white rounded-md shadow-md p-2 w-fit">
                    <button
                        onClick={() => {
                            setShowOptions(false);
                            setType("image");
                            setShowPin(false)
                        }}
                        className="flex items-center gap-2 text-sm text-gray-800 hover:text-blue-500"
                    >
                        <ImageIcon size={16} /> Image
                    </button>
                    <button
                        onClick={() => {
                            setShowOptions(false);
                            setType("video");
                            setShowPin(false)
                        }}
                        className="flex items-center gap-2 text-sm text-gray-800 hover:text-blue-500"
                    >
                        <VideoIcon size={16} /> Video
                    </button>
                </div>
            )}

            {/* Hidden FileUpload triggers */}
            {(type && !showOptions) && (
                <FileUpload
                    fileType={type}
                    onSuccess={(res) => {
                        onUpload(res?.url);
                        setType(null); // reset after upload
                        setShowPin(true)
                    }}
                />
            )}
        </div>
    );
};
