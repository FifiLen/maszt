"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ImageSplitBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Pin the Left Column (Typography)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 25%", 
        end: "bottom 85%", // Unpins right before section ends
        pin: leftColRef.current,
        pinSpacing: false,
      });

      // 2. Add micro-parallax to the images in the right column
      const images = gsap.utils.toArray<HTMLElement>(".parallax-img");
      images.forEach((img, index) => {
        // Math to make them scroll slightly slower or faster depending on index
        const speedMultiplier = index % 2 === 0 ? 15 : -15; 
        
        gsap.to(img, {
          yPercent: speedMultiplier,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Requires at least 2 images
  const images = data.images || [];

  return (
    <div ref={containerRef} className="pb-24 lg:pb-64 text-[#3ead8f] relative z-10 w-full mt-24">
      <div className="px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        
        {/* LEFT: Pinned Context (Cols 3-5) */}
        <div ref={leftColRef} className="lg:col-start-3 lg:col-span-3 pt-12">
           <h3 className="font-heading text-4xl md:text-5xl uppercase leading-[0.9] tracking-tighter mb-8">
             {data.heading || "Wizualne Detale"}
           </h3>
           <p className="font-sans text-base md:text-lg leading-relaxed opacity-80">
             {data.description || "Odkrywanie przestrzeni pomiędzy akcją."}
           </p>
        </div>

        {/* RIGHT: Scrolling Stack (Cols 6-11) */}
        <div className="lg:col-start-6 lg:col-span-6 flex flex-col gap-16 md:gap-32 mt-20 lg:mt-0">
          {images.map((img: any, i: number) => (
            <div 
              key={i} 
              // Create an artificial offset based on index to break perfect vertical rhythm
              className={`w-full overflow-hidden bg-[#3ead8f]/10 ${i % 2 !== 0 ? 'lg:w-[85%] lg:ml-auto' : 'lg:w-[90%]'}`}
            >
              {/* Image removed temporarily */}
              {/* <img 
                src={img.url} 
                alt={img.alt || `Split Image ${i}`}
                // Scale is 1.15 to prevent showing empty background during parallax shift
                className="parallax-img w-full h-auto scale-[1.15] transform origin-center grayscale hover:grayscale-0 transition-[filter] duration-700 block" 
              /> */}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
