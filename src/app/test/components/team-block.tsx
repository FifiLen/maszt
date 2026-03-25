"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FormattedText } from "./formatted-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TeamBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Photos — clip-path reveal
      const photos = gsap.utils.toArray<HTMLElement>(".team-grid-photo");
      photos.forEach((photo, i) => {
        gsap.fromTo(photo,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.0,
            delay: i * 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
            }
          }
        );

        // Subtle parallax on image inside
        const img = photo.querySelector("img, .team-grid-placeholder");
        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: photo,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          });
        }
      });

      // Text info — stagger fade-in
      const infos = gsap.utils.toArray<HTMLElement>(".team-grid-info");
      gsap.from(infos, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const gradients = [
    "linear-gradient(145deg, #3ead8f 0%, #2d8a72 40%, #1a5e4d 100%)",
    "linear-gradient(145deg, #8c4693 0%, #6b3570 40%, #4a2150 100%)",
    "linear-gradient(145deg, #3ead8f 0%, #8c4693 50%, #4a2150 100%)",
  ];

  return (
    <div ref={containerRef} className="pb-24 lg:pb-40 text-[#3ead8f] w-full mt-10">
      {/* Section Heading */}
      <div className="px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-12 lg:mb-20">
        <div className="lg:col-start-2 lg:col-span-4">
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40 block mb-3">
            Zarząd Fundacji
          </span>
          <h3 className="font-heading text-4xl md:text-5xl lg:text-[3.5vw] uppercase leading-[0.85] tracking-tighter">
            <FormattedText text={data.heading} />
          </h3>
        </div>
      </div>

      {/* 3-Column Photo Grid */}
      <div className="px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {data.members.map((member: any, i: number) => (
          <div key={i} className="flex flex-col">
            {/* Photo */}
            <div className="team-grid-photo overflow-hidden mb-5 lg:mb-6" style={{ aspectRatio: "3/4" }}>
              {/* Image removed temporarily - will be added back when photos are available */}
              {/* member.image && <img src={member.image} alt={member.name} ... /> */}
              <div
                className="team-grid-placeholder w-full h-full flex items-end p-6 lg:p-8 relative overflow-hidden scale-[1.15] origin-center"
                style={{ background: gradients[i % gradients.length] }}
              >
                {/* Decorative grid overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-[33%] left-0 right-0 border-t border-white/30"></div>
                  <div className="absolute top-[66%] left-0 right-0 border-t border-white/30"></div>
                  <div className="absolute left-[33%] top-0 bottom-0 border-l border-white/30"></div>
                  <div className="absolute left-[66%] top-0 bottom-0 border-l border-white/30"></div>
                </div>
                <span className="font-heading text-[18vw] md:text-[8vw] text-white/10 leading-none tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
                  {member.name.charAt(0)}
                </span>
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest relative z-10">
                  Zdjęcie w przygotowaniu
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="team-grid-info flex flex-col gap-2">
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40">
                {member.number} — {member.role}
              </span>
              <h4 className="font-heading text-xl md:text-2xl lg:text-[1.6vw] uppercase leading-[0.9] tracking-tighter">
                <FormattedText text={member.name} />
              </h4>
              <p className="font-sans text-sm md:text-base leading-relaxed opacity-60 mt-1">
                <FormattedText text={member.description} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
