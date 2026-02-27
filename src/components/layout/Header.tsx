"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; 

interface HeaderProps {
  theme?: 'dark' | 'light';
}

export function Header({ theme: initialTheme = 'light' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Strony z jasnym tłem na samej górze potrzebują ciemnego tekstu nawigacji
  const lightPages = ['/kontakt', '/wolontariat', '/darowizna', '/parasol', '/parnterstwa', '/partycypacja'];
  const theme = lightPages.includes(pathname) ? 'light' : 'dark';
  const isDark = theme === 'dark' && !isScrolled;

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-colors duration-200",
      // Stała wysokość, zmienia się tylko tło i subtelna linia na dole po scrollu
      isScrolled ? "bg-white border-b border-black/5" : "bg-transparent"
    )}>
      {/* w-full zamiast max-w. px-6 do px-16 rozciąga nawigację od krawędzi do krawędzi */}
      <div className="w-full px-6 md:px-6 lg:px-6 py-1 grid grid-cols-3 items-center">
        
        {/* Lewa strona - Linki */}
        <nav className={cn(
          "hidden md:flex items-center justify-start gap-8 text-[15px] font-medium tracking-tight",
          isDark ? "text-white/80" : "text-black/70"
        )}>
          <Link href="/o-nas" className={cn("transition-colors duration-200", isDark ? "hover:text-white" : "hover:text-black")}>o nas</Link>
          <Link href="/dzialania" className={cn("transition-colors duration-200", isDark ? "hover:text-white" : "hover:text-black")}>działania</Link>
          <Link href="/oferta" className={cn("transition-colors duration-200", isDark ? "hover:text-white" : "hover:text-black")}>oferta</Link>
        </nav>

        {/* Środek - Logo */}
        <div className="flex justify-center">
          <Link href="/" className={cn(
            "text-2xl font-bold tracking-tighter transition-colors duration-200",
            isDark ? "text-white" : "text-black"
          )}>
            fundacja maszt.
          </Link>
        </div>

        {/* Prawa strona - Linki + CTA */}
        <div className={cn(
          "hidden md:flex items-center justify-end gap-8 text-[15px] font-medium tracking-tight",
          isDark ? "text-white/80" : "text-black/70"
        )}>
          <Link href="/projekty" className={cn("transition-colors duration-200", isDark ? "hover:text-white" : "hover:text-black")}>projekty</Link>
          <Link href="/wolontariat" className={cn("transition-colors duration-200", isDark ? "hover:text-white" : "hover:text-black")}>wolontariat</Link>
          <Link href="/kontakt" className={cn("transition-colors duration-200", isDark ? "hover:text-white" : "hover:text-black")}>kontakt</Link>
          
          {/* Separator */}
          {/* <div className={cn("w-px h-4 mx-1 transition-colors duration-200", isDark ? "bg-white/30" : "bg-black/15")}></div> */}
          
          {/* Przycisk Wesprzyj */}
          {/* <Link 
            href="/darowizna" 
            className={cn(
              "group flex items-center gap-1.5 font-semibold tracking-tight hover:opacity-70 transition-opacity duration-200",
              isDark ? "text-white" : "text-black"
            )}
          >
            wesprzyj
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link> */}
        </div>

      </div>
    </header>
  );
}