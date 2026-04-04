"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function LeftGutter() {
  return <div className="lg:col-span-5 hidden lg:block"></div>;
}

export default function ImageGalleryBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- 1. ZEWNĘTRZNY PARALLAX (Ruch całych okien) ---
      gsap.to(".parallax-container-1", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", 
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".parallax-container-2", {
        yPercent: -55,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".parallax-container-3", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // --- 2. WEWNĘTRZNY PARALLAX (Zdjęcia wewnątrz okien) ---
      const innerImages = gsap.utils.toArray<HTMLImageElement>(".inner-parallax-img");
      
      innerImages.forEach((img) => {
        // Skalujemy zdjęcie w GSAP. Scale 1.3 daje mu zapas miejsca w górę i w dół wewnątrz kontenera.
        gsap.set(img, { scale: 1.3 });

        gsap.fromTo(
          img,
          { yPercent: -20 }, // Zdjęcie zaczyna mocno przesunięte do góry
          {
            yPercent: 20,    // I kończy mocno przesunięte w dół
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const images = data.images || [];
  if (images.length < 3) return null;

  return (
    <div className="px-6 lg:px-10 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        <LeftGutter />

        <div 
          ref={containerRef} 
          className="lg:col-span-7 lg:col-start-6 relative w-full min-h-[80vh] md:min-h-[100vh] lg:min-h-[120vh]"
        >
          {/* Globalne style dla nakładki w kolorze #3ead8f */}
          <style jsx global>{`
            .parallax-container::after {
              content: '';
              position: absolute;
              inset: 0; /* skrót na top:0, left:0, w:100%, h:100% */
              background-color: #3ead8f;
              mix-blend-mode: multiply; /* Nakłada kolor tylko na cienie i półcienie */
              opacity: 1;
              transition: opacity 0.7s ease;
              z-index: 1;
              pointer-events: none;
            }
            /* Usuwamy nakładkę, gdy najedziemy na kontener (który ma klasę 'group') */
            .parallax-container.group:hover::after {
              opacity: 0;
            }
          `}</style>

          {/* 1. ZDJĘCIE */}
          {/* Dodano klasę 'group' i 'aspect-[4/5]' - kontener staje się sztywnym "oknem" dla obrazka */}
          <div className="group parallax-container parallax-container-1 absolute left-0 top-[5%] w-[60%] md:w-[45%] z-10 overflow-hidden aspect-[4/5] bg-[#3ead8f]/10">
            {/* Image removed temporarily */}
            {/* <img 
              src={images[0].url} 
              alt={images[0].alt || "Galeria 1"} 
              className="inner-parallax-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 origin-center" 
            /> */}
          </div>

          {/* 2. ZDJĘCIE */}
          <div className="group parallax-container parallax-container-2 absolute right-0 top-[25%] lg:top-[30%] w-[55%] md:w-[40%] z-20 overflow-hidden aspect-[4/5] bg-[#3ead8f]/10">
            {/* Image removed temporarily */}
            {/* <img 
              src={images[1].url} 
              alt={images[1].alt || "Galeria 2"} 
              className="inner-parallax-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 origin-center" 
            /> */}
          </div>

          {/* 3. ZDJĘCIE */}
          <div className="group parallax-container parallax-container-3 absolute left-[15%] top-[60%] lg:top-[65%] w-[70%] md:w-[50%] z-30 overflow-hidden aspect-[4/5] md:aspect-[16/9] bg-[#3ead8f]/10">
            {/* Image removed temporarily */}
            {/* <img 
              src={images[2].url} 
              alt={images[2].alt || "Galeria 3"} 
              className="inner-parallax-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 origin-center" 
            /> */}
          </div>
        </div>
        
      </div>
    </div>
  );
}