"use client";

import { useEffect, useRef, useState } from "react";
import { ReelItem } from "./ReelItem";
import { useVideos } from "@/hooks/useVideo";
import Loader from "./Loader";

export default function ReelComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { getAllVideos } = useVideos();
  console.log(JSON.stringify(getAllVideos, null, 2));


  const reels =
    getAllVideos?.data?.pages.flatMap((page) => page.data.videos) || [];

  // Scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container || reels.length === 0) return;

    const itemHeight = container.clientHeight;
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
  }, [reels]);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && getAllVideos?.hasNextPage) {
        getAllVideos.fetchNextPage();
      }
    });

    const loadTrigger = loadMoreRef.current;
    if (loadTrigger) {
      observer.observe(loadTrigger);
    }

    return () => {
      if (loadTrigger) observer.unobserve(loadTrigger);
    };
  }, [getAllVideos]);

  return (
    <>
      {getAllVideos?.isLoading ? (
        <Loader />
      ) : (
        <div className="relative w-full sm:h-[calc(100vh-80px)] h-[calc(100vh-0px)] flex md:justify-center justify-center items-center">
          <div
            ref={containerRef}
            className="md:max-w-[27rem] shadow-white shadow-sm sm:rounded-lg h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reels.map((reel: any, index: number) => (
              <div key={reel?._id ?? index} className="snap-start h-full">
                <ReelItem reel={reel} isActive={index === currentIndex} />
              </div>
            ))}
            {/* Trigger to load next page */}
            <div ref={loadMoreRef} className="w-full h-10" />
          </div>

          {/* Right side indicators */}
          <div className="absolute hidden right-4 top-1/2 transform -translate-y-1/2 sm:flex flex-col space-y-2 z-20">
            {reels
              .slice(Math.floor(currentIndex / 5) * 5, Math.floor(currentIndex / 5) * 5 + 5)
              .map((_, index) => {
                const actualIndex = Math.floor(currentIndex / 5) * 5 + index;
                return (
                  <div
                    key={actualIndex}
                    className={`w-1 h-8 rounded-full transition-colors ${actualIndex === currentIndex ? "bg-purple-400" : "bg-gray-600/50"
                      }`}
                  />
                );
              })}
          </div>

        </div>
      )}
    </>
  );
}
