"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import { FormattedText } from "./formatted-text";

// Rejestrujemy pluginy
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export type ProjectMapData = {
  slug: string;
  tytul: string;
  opis: string;
  keywords?: string[];
};

// --- GŁÓWNY KOMPONENT SEKCI ---
export default function ProjectsSection({ projectsData }: { projectsData: ProjectMapData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  const allKeywords = useMemo(() => {
    const keys = new Set<string>();
    projectsData.forEach((p) => p.keywords?.forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    if (!activeKeyword) return projectsData;
    return projectsData.filter((p) => p.keywords?.includes(activeKeyword));
  }, [projectsData, activeKeyword]);

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleDeactivate = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <section className="w-full flex flex-col bg-[#e8e4df]">
      <ProjectsIntro />

      {/* FILTRY - Zaktualizowane przyciski */}
      {allKeywords.length > 0 && (
        <div className="w-full px-6 lg:px-10 pb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveKeyword(null)}
            className={`px-5 py-2.5 rounded-full border border-current font-sans text-sm md:text-base font-medium transition-all duration-300 ${
              activeKeyword === null
                ? "bg-[#3ead8f] text-[#e8e4df] border-transparent"
                : "bg-transparent text-[#3ead8f] hover:opacity-70"
            }`}
          >
            Wszystkie
          </button>
          {allKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => setActiveKeyword(keyword)}
              className={`px-5 py-2.5 rounded-full border border-current font-sans text-sm md:text-base font-medium transition-all duration-300 ${
                activeKeyword === keyword
                  ? "bg-[#3ead8f] text-[#e8e4df] border-transparent"
                  : "bg-transparent text-[#3ead8f] hover:opacity-70"
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>
      )}

      {/* LISTA PROJEKTÓW */}
      <div 
        className="w-full flex flex-col"
        onMouseLeave={handleDeactivate}
      >
        {filteredProjects.map((project, index) => (
          <ProjectRow
            key={project.slug}
            index={index}
            project={project}
            isActive={activeIndex === index}
            onActivate={() => handleActivate(index)}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="p-10 text-center text-[#3ead8f] font-sans">
            Brak projektów dla wybranego filtru.
          </div>
        )}
      </div>
    </section>
  );
}

// --- INTRO ---
function ProjectsIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-[40vh] md:min-h-[50vh] flex flex-col justify-end items-start px-6 lg:px-10 pb-10 text-[#3ead8f]"
    >
      <h1 
        ref={titleRef}
        className="font-heading text-6xl md:text-7xl lg:text-8xl font-medium leading-none tracking-tighter"
      >
        Nasze Projekty
      </h1>
    </div>
  );
}

// --- RZĄD AKORDEONU ---
interface ProjectRowProps {
  index: number;
  project: ProjectMapData;
  isActive: boolean;
  onActivate: () => void;
}

const ProjectRow = React.memo(({ index, project, isActive, onActivate }: ProjectRowProps) => {
  const rowRef = useRef<HTMLAnchorElement>(null); 
  const bgRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const ease = "power3.inOut";
    
    gsap.set(bgRef.current, { scaleY: 0, transformOrigin: "top" });
    gsap.set(btnRef.current, { autoAlpha: 0, y: 10 });

    if (isActive) {
      gsap.to(bgRef.current, { scaleY: 1, duration: 0.4, ease, force3D: true });
      gsap.to(btnRef.current, { autoAlpha: 1, y: 0, duration: 0.3, delay: 0.2, ease: "power2.out" });
    } else {
      gsap.to(btnRef.current, { autoAlpha: 0, y: 10, duration: 0.2, ease: "power2.in" });
      gsap.to(bgRef.current, { scaleY: 0, duration: 0.4, delay: 0.1, ease, force3D: true });
    }
  }, [isActive]);

  return (
    <Link
      href={`/projekty/${project.slug}`}
      ref={rowRef}
      onMouseEnter={onActivate}
      className="relative block w-full cursor-pointer border-t border-[#3ead8f] group overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#3ead8f] w-full h-full scale-y-0 origin-top will-change-transform"
      />

      <div className={`relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 p-6 lg:p-10 min-h-[220px] transition-colors duration-500 ${
        isActive ? "text-[#e8e4df]" : "text-[#3ead8f]"
      }`}>
        
        {/* NUMER */}
        <div className="md:col-span-1 font-heading text-2xl lg:text-3xl font-medium">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* TYTUŁ I PRZYCISK */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-4xl lg:text-5xl uppercase leading-[0.9] tracking-tighter">
              <FormattedText text={project.tytul} />
            </h2>
            {project.keywords && project.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {project.keywords.map((kw, i) => (
                  <span key={i} className="text-xs font-mono uppercase opacity-70">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-4">
            {/* Zaktualizowany przycisk "Czytaj więcej" w kształcie pigułki */}
            <span
              ref={btnRef}
              className="inline-block invisible opacity-0 translate-y-2 w-fit px-5 py-2.5 rounded-full border border-current font-sans text-sm md:text-base font-medium bg-[#e8e4df] text-[#3ead8f] transition-all hover:opacity-70"
            >
              Czytaj więcej
            </span>
          </div>
        </div>

        {/* OPIS */}
        <div className="md:col-span-5 md:col-start-8 flex items-start">
          <p className="text-left font-sans text-sm md:text-base lg:text-lg leading-relaxed opacity-90 line-clamp-6">
            <FormattedText text={project.opis} />
          </p>
        </div>

      </div>
    </Link>
  );
});

ProjectRow.displayName = "ProjectRow";