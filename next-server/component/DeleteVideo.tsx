import { X } from 'lucide-react'
import React from 'react'

const DeleteVideo = ({onClose,isOpen}:any) => {
  return (
    <>
    {/* <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} /> */}
    {/* <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} /> */}
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-gray-900 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
    >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">I will work on it.</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
    </div>
    </>
  )
}

export default DeleteVideo