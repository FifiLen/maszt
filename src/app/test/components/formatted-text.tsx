"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function FormattedText({ text }: { text?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const keywords = gsap.utils.toArray<HTMLElement>('.keyword-highlight');
      
      keywords.forEach((keyword) => {
        gsap.to(keyword, {
          color: "#8c4693",
          scrollTrigger: {
            trigger: keyword,
            start: "top 85%",
            end: "bottom 65%",
            scrub: 1,
            toggleActions: "play none none reverse"
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <span ref={containerRef}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const keyword = part.slice(2, -2);
          return (
            <span 
              key={index} 
              className="keyword-highlight transition-colors duration-300" 
              style={{ fontWeight: "inherit" }} // Dziedziczymy weight z paragrafów klienta
            >
              {keyword}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
