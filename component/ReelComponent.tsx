"use client"

import { useEffect, useRef, useState } from "react"
import { ReelItem } from "./ReelItem" 
import { useVideo } from "@/hooks/useVideo"
import Loader from "./Loader"


export default function ReelComponent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const {getAllVideos} = useVideo();
  // if (!getAllVideos?.) return <Loader/>;



  useEffect(()=>{
    getAllVideos.mutate();
  },[])


  

useEffect(() => {
  const container = containerRef.current;
  if (!container || !getAllVideos?.data?.data?.length) return;

  const headerHeight = 70;
  const itemHeight = window.innerHeight - headerHeight;

  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        setCurrentIndex(index);
        ticking = false;
      });

      ticking = true;
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [getAllVideos?.data?.data]);


  return (
    <>
    {getAllVideos?.isPending ? (
      <Loader/>
    ) : (
      <>
      <div className="relative w-full sm:h-[calc(100vh-80px)] h-[calc(100vh-0px)]  flex md:justify-center justify-between items-center  ">
      <div
        ref={containerRef}
        className="md:max-w-[27rem]   shadow-white shadow-sm sm:rounded-lg h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        { getAllVideos?.data?.data?.length > 0 && (getAllVideos?.data?.data.map((reel: any, index: any) => (
          <div key={reel._id} className="snap-start h-full">
            {" "}
            {/* Changed to h-full to match parent */}
            <ReelItem reel={reel} isActive={index === currentIndex} />
          </div>
        )))}
      </div>
      {/* Scroll Indicators */}
      <div className="absolute  hidden right-4 top-1/2 transform   -translate-y-1/2 sm:flex flex-col space-y-2 z-20">
        {getAllVideos?.data?.data?.length > 0 && (getAllVideos?.data.data.map((_: any, index: any) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-colors ${index === currentIndex ? "bg-purple-400" : "bg-gray-600/50"}`}
          />
        )))}
      </div>
    </div>
      </>
    )}
    </>
  )
}