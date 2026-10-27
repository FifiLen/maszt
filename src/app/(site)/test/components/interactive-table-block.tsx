"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FormattedText } from "./formatted-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveTableBlock({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sprawdzamy, czy tabela ma 3 czy 2 kolumny na podstawie danych z JSON
  const hasThreeColumns = data.columns && data.columns.length === 3;

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".table-row-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pb-24 lg:pb-40 text-[#3ead8f] max-w-8xl mx-auto relative z-10 w-full overflow-hidden">
      {/* Sekcja Nagłówka */}
      <div className="px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 border-t border-[#3ead8f]/30 pt-10 mb-10">
        <div className="lg:col-start-2 lg:col-span-10">
           <h3 className="font-heading text-4xl md:text-5xl uppercase leading-[0.9] tracking-tighter">
             <FormattedText text={data.heading} />
           </h3>
        </div>
      </div>

      <div className="px-6 lg:px-10 flex flex-col gap-4">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-12 gap-6 border-b border-[#3ead8f]/30 pb-4 font-mono text-xs md:text-sm uppercase tracking-widest opacity-60">
           <div className="col-start-2 col-span-3">{data.columns[0]}</div>
           <div className={`col-start-5 ${hasThreeColumns ? 'col-span-4' : 'col-span-7'}`}>{data.columns[1]}</div>
           {hasThreeColumns && (
             <div className="col-start-9 col-span-3">{data.columns[2]}</div>
           )}
        </div>

        {/* Wiersze tabeli */}
        {data.items.map((item: any, i: number) => (
          <div key={i} className="table-row-item grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 border-b border-[#3ead8f]/20 py-6 hover:bg-[#3ead8f]/[0.02] transition-colors group">
            
            {/* Kolumna 1: Działanie / Etap */}
            <div className="lg:col-start-2 lg:col-span-3">
              <span className="lg:hidden font-mono text-xs uppercase tracking-widest opacity-50 block mb-2">{data.columns[0]}</span>
              <h4 className="font-heading text-2xl md:text-3xl leading-snug tracking-tight">
                <FormattedText text={item.action} />
              </h4>
            </div>
            
            {/* Kolumna 2: Opis / Szczegóły */}
            <div className={`lg:col-start-5 ${hasThreeColumns ? 'col-span-4' : 'col-span-7'}`}>
              <span className="lg:hidden font-mono text-xs uppercase tracking-widest opacity-50 block mb-2">{data.columns[1]}</span>
              <p className="font-sans text-base md:text-lg leading-relaxed opacity-80 whitespace-pre-line">
                <FormattedText text={item.description} />
              </p>
            </div>
            
            {/* Kolumna 3: Odbiorcy (rendrowane tylko, jeśli podano w JSON) */}
            {hasThreeColumns && (
              <div className="lg:col-start-9 lg:col-span-3">
                <span className="lg:hidden font-mono text-xs uppercase tracking-widest opacity-50 block mb-2">{data.columns[2]}</span>
                <p className="font-sans text-sm md:text-base leading-relaxed opacity-60 bg-[#3ead8f]/5 p-4 rounded-sm">
                  <FormattedText text={item.recipients} />
                </p>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}