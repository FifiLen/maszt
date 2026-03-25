"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FormattedText } from "./formatted-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveFeaturesBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pinning the left column while the right column scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 20%",
        end: "bottom 80%",
        pin: leftColRef.current,
        pinSpacing: false,
        scrub: true,
      });

      // Simple stagger fade-in for feature items
      gsap.from(".feature-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pb-24 lg:pb-40 text-[#3ead8f] relative z-10 w-full overflow-hidden">
      <div className="px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Pinned Left Column */}
        <div ref={leftColRef} className="lg:col-start-3 lg:col-span-3 pt-10">
           <h3 className="font-heading text-4xl md:text-5xl uppercase leading-[0.9] tracking-tighter">
             <FormattedText text={data.heading} />
           </h3>
           <p className="mt-8 font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">
              Co osiągniemy współdziałając
           </p>
        </div>

        {/* Scrolling Right Column */}
        <div className="lg:col-start-6 lg:col-span-6 flex flex-col gap-20 pt-10 min-h-[150vh] xl:min-h-screen">
          {data.items.map((item: any, i: number) => (
            <div key={i} className="feature-item flex flex-col border-t border-[#3ead8f]/30 pt-8">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-60 mb-4">0{i + 1}</span>
              <h4 className="font-heading text-2xl md:text-3xl leading-snug tracking-tight mb-4">
                <FormattedText text={item.title} />
              </h4>
              <p className="font-sans text-base md:text-lg leading-relaxed opacity-80 max-w-2xl">
                <FormattedText text={item.description} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
