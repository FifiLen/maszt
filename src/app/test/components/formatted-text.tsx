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
    const ctx = gsap.context(() => {
      const keywords = gsap.utils.toArray<HTMLElement>('.keyword-highlight');
      
      keywords.forEach((keyword) => {
        // Animujemy szerokość tła (efekt malowania markerem)
        gsap.to(keyword, {
          backgroundSize: "100% 40%", 
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

  const parts = text.split(
    /(\*\*.*?\*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\)|\n)/g,
  );

  return (
    <span ref={containerRef}>
      {parts.map((part, index) => {
        if (part === "\n") {
          return <br key={index} />;
        }

        const linkMatch = part.match(
          /^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)$/,
        );

        if (linkMatch) {
          const [, label, url] = linkMatch;
          const isExternal = url.startsWith("http");

          return (
            <a
              key={index}
              href={url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="font-semibold underline decoration-current/40 underline-offset-4 transition-opacity hover:opacity-60 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {label}
            </a>
          );
        }

        if (part.startsWith('**') && part.endsWith('**')) {
          const keyword = part.slice(2, -2);
          return (
            <span 
              key={index} 
              className="keyword-highlight" 
              style={{ 
                fontWeight: "600", // Lekkie pogrubienie, żeby słowo i tak się wyróżniało
                color: "inherit",  // Ważne: tekst zachowuje swój bazowy, CZYTELNY kolor
                // Przygotowanie tła pod efekt zakreślacza (używamy rgba dla przezroczystości)
                backgroundImage: "linear-gradient(120deg, rgba(46, 216, 164, 0.25) 0%, rgba(46, 216, 164, 0.25) 100%)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "0% 40%", // Startowo tło ma 0% szerokości i 40% wysokości litery
                backgroundPosition: "0 85%", // Obniżamy tło, żeby przypominało grube podkreślenie
                display: "inline", // Zabezpieczenie, żeby tło dobrze łamało się w liniach
              }}
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
