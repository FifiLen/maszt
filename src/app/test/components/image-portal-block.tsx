"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ImagePortalBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // The timeline that controls the portal expansion
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center", // Pin when the image reaches center of screen
          end: "+=150%", // Scroll distance to expand (adjust for speed)
          scrub: true,
          pin: true,
        }
      });

      // 1. Expand the mask to full screen
      tl.to(imageWrapperRef.current, {
        width: "100%",
        height: "100vh",
        ease: "none",
      }, 0);

      // 2. Scale the photo slightly alongside the expansion for a "sucking in" feeling
      tl.fromTo(imageRef.current, 
        { scale: 1.5 }, // Start zoomed in
        { scale: 1, ease: "none" }, // Zoom out to natural size
      0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    // We add h-screen so the start position is perfectly centered
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#e8e4df]">
      
      {/* Editorial grid context framing the initial portal */}
      <div className="absolute inset-0 px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pointer-events-none z-0">
        <div className="lg:col-start-3 lg:col-span-3 flex items-center h-full">
           {data.caption && (
             <p className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-40 transform -rotate-90 origin-left -translate-y-12 whitespace-nowrap">
               {data.caption}
             </p>
           )}
        </div>
      </div>

      {/* The Portal Wrapper -> Starts at a strict layout width, ends at 100vw */}
      <div 
        ref={imageWrapperRef} 
        // Initial state: takes up approx the 6-col Content Zone size
        className="w-[90vw] md:w-[60vw] lg:w-[45vw] h-[50vh] md:h-[60vh] overflow-hidden relative z-10 will-change-transform flex items-center justify-center"
      >
        <div className="w-full h-full bg-[#3ead8f]/10 flex items-center justify-center">
          {/* Image removed temporarily */}
          {/* <img 
            ref={imageRef}
            src={data.images?.[0]?.url || "/test-bg.jpg"} 
            alt={data.images?.[0]?.alt || "Portal Image"}
            className="w-full h-full object-cover origin-center"
          /> */}
          <span className="font-mono text-xs text-[#3ead8f]/30 uppercase tracking-widest">Zdjęcie w przygotowaniu</span>
        </div>
      </div>
      
    </div>
  );
}
