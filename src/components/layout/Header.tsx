"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projectLinks = [
  { href: '/projekty/godomy-o-edukacji', label: 'Godomy o edukacji' },
  { href: '/projekty/rodzinny-restart', label: 'Rodzinny restart' },
  { href: '/projekty/pierwsza-pomoc-przedpsychologiczna', label: 'Pierwsza Pomoc Przedpsychologiczna' },
  { href: '/projekty/milosc-na-cztery-lapy', label: 'Miłość na cztery łapy' },
  { href: '/projekty/mas-zt', label: 'MAS-ZT' },
  { href: '/projekty/zaloga-na-poklad', label: 'Załoga na pokład' },
  { href: '/projekty/w-kolorowych-ramach', label: 'W kolorowych ramach' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Reakcja na scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Zamknij przy zmianie ścieżki
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Blokowanie scrolla pod spodem gdy menu jest otwarte
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Animacja pełnoekranowego menu GSAP
  useGSAP(() => {
    if (menuOpen) {
      // Menu zjeżdża z góry
      gsap.to(menuRef.current, {
        y: "0%",
        duration: 0.7,
        ease: "expo.inOut"
      });
      // Linki wjeżdżają kaskadowo
      gsap.fromTo(linksRef.current?.children ? Array.from(linksRef.current.children) : [], 
        { y: 50, opacity: 0, rotationX: -20 },
        { y: 0, opacity: 1, rotationX: 0, stagger: 0.05, duration: 0.5, ease: "power2.out", delay: 0.3 }
      );
    } else {
      // Menu chowa się do góry
      gsap.to(menuRef.current, {
        y: "-100%",
        duration: 0.6,
        ease: "expo.inOut"
      });
    }
  }, { dependencies: [menuOpen] });

  // Dynamiczne kolory headera
  const headerTextColor = menuOpen ? "text-[#e8e4df]" : "text-[#3ead8f]";
  // Usunięto całkowicie bordery z logiki tła
  const headerBgColor = menuOpen ? "bg-transparent" : (isScrolled ? "bg-[#e8e4df]" : "bg-transparent");

  return (
    <>
      {/* 1. ULTRA-MINIMALISTYCZNY GÓRNY PASEK (Zawsze na wierzchu, z-60) */}
      <header className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-all duration-500 pointer-events-auto px-6 lg:px-10 py-4 lg:py-6 flex justify-between items-center",
        headerBgColor,
        headerTextColor
      )}>
        <Link 
          href="/" 
          onClick={() => setMenuOpen(false)}
          className="hover:opacity-70 transition-opacity z-10 flex items-center -mt-2 md:-mt-3"
        >
          <img 
            src="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69fcd0ea00013a609109/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjlmY2QwZjEwN2VjYjk2YmQwM2UiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjlmY2QwZWEwMDAxM2E2MDkxMDkiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjI5IiwiaWF0IjoxNzc4MTc2MjQxfQ.P0AH0eeE-9FkEkdOrOq-_3V6wPwBS0FVn0xY6bpBKe0" 
            alt="Fundacja Maszt Logo" 
            className="h-16 md:h-20 lg:h-24 w-auto object-contain transition-all"
            style={{ 
              filter: menuOpen ? "brightness(0) invert(0.9) sepia(0.1) hue-rotate(180deg)" : "none" 
            }}
          />
        </Link>

        {/* Nowy przycisk: zunifikowana czcionka, ramka (pill shape) i ikona hamburgera/X */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-current font-sans text-sm md:text-base font-medium transition-all hover:opacity-70 z-10 bg-transparent"
        >
          <span>{menuOpen ? "Zamknij" : "Menu"}</span>
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          )}
        </button>
      </header>

      {/* 2. PEŁNOEKRANOWE MENU (z-50, ukryte poza ekranem na start y: -100%) */}
      <div 
        ref={menuRef}
        className="fixed inset-0 z-[50] bg-[#3ead8f] text-[#e8e4df] flex flex-col pt-32 lg:pt-40 px-6 lg:px-10 pb-10 overflow-y-auto"
        style={{ transform: "translateY(-100%)" }}
      >
        <div className="max-w-8xl mx-auto w-full h-full flex flex-col justify-between">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Lewa strona - Wielki napis informacyjny */}
            <div className="lg:col-span-4 flex flex-col">
              <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-6 border-b border-[#e8e4df]/20 pb-4">
                Nasza działalność
              </span>
              <p className="font-sans text-xl lg:text-2xl leading-relaxed opacity-90 pr-10">
                Odkryj projekty, w których budujemy infrastrukturę społeczną, by ludzie mogli doświadczać bycia wartością.
              </p>
            </div>

            {/* Prawa strona - Ogromna lista projektów */}
            <div className="lg:col-span-8 flex flex-col gap-2 lg:gap-4" ref={linksRef}>
              {projectLinks.map(({ href, label }, i) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group flex items-baseline gap-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.05] transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-60 hover:opacity-100 hover:translate-x-2"
                    )}
                  >
                    <span className="font-mono text-sm opacity-50 mb-1">0{i + 1}</span>
                    <span className="break-words">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Stopka menu z kontaktem */}
          <div className="mt-20 border-t border-[#e8e4df]/20 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 font-mono text-xs uppercase tracking-widest opacity-70">
            <div className="flex flex-col gap-2">
              <a href="mailto:fundacja@maszt.org" className="hover:text-white transition-colors">fundacja@maszt.org</a>
              <a href="tel:+48792220095" className="hover:text-white transition-colors">+48 792 220 095</a>
            </div>
            <div className="flex flex-col gap-2 sm:text-right">
              <span>ul. Energetyków 22</span>
              <span>44-200 Rybnik</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}