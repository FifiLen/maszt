"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ImageSplitBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Add micro-parallax to the single full-width image
      const images = gsap.utils.toArray<HTMLElement>(".parallax-img", containerRef.current);
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Use the first image only
  const images = data.images || [];
  const firstImage = images.length > 0 ? images[0] : null;

  return (
    <div ref={containerRef} className="pb-16 md:pb-24 lg:pb-32 text-[#3ead8f] relative z-10 w-full mt-16 md:mt-24">
      
      {/* TEXT SECTION */}
      <div className="px-6 lg:px-10 w-full max-w-7xl mx-auto mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="max-w-3xl">
           <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.9] tracking-tighter mb-4 md:mb-6">
             {data.heading || "Wizualne Detale"}
           </h3>
           <p className="font-sans text-base md:text-lg lg:text-xl leading-relaxed opacity-80 max-w-2xl">
             {data.description || "Odkrywanie przestrzeni pomiędzy akcją."}
           </p>
        </div>
      </div>

      {/* FULL WIDTH IMAGE SECTION */}
      <div className="w-full h-[50vh] md:h-[70vh] lg:h-[90vh] overflow-hidden relative bg-[#3ead8f]/10 flex items-center justify-center">
        {firstImage ? (
          <img 
            src={firstImage.url} 
            alt={firstImage.alt || `Wizualizacja`}
            // Scale is 1.15 to prevent showing empty background during parallax shift
            className="parallax-img w-full h-full object-cover scale-[1.15] transform origin-center grayscale hover:grayscale-0 transition-[filter] duration-700 block" 
          />
        ) : (
          <div className="parallax-img w-full h-full flex flex-col items-center justify-center bg-[#3ead8f]/10 scale-[1.15] transform origin-center">
            <span className="font-mono text-xs md:text-sm text-[#3ead8f]/40 uppercase tracking-widest border border-[#3ead8f]/20 px-6 py-3 rounded-full">
              Zdjęcie w przygotowaniu
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
