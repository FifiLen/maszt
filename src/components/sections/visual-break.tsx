"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils'; 

// Poszerzona lista zdjęć, żeby wypełnić wyższą sekcję (4 zdjęcia na kolumnę)
const images = [
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
  "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=800&q=80",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  // 8 nowych zdjęć
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80",
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&q=80",
  "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80",
  "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&q=80",
  "https://images.unsplash.com/photo-1558403194-611308249627?w=800&q=80",
];

const col1 = images.slice(0, 6);
const col2 = images.slice(6, 12);
const col3 = images.slice(12, 18);
const col4 = images.slice(18, 24);

export function VisualBreak() {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });

  // Zwiększone wartości przesunięcia (-40vh do 40vh), bo sekcja jest wyższa
  const yDown = useTransform(scrollYProgress, [0, 1], ['-40vh', '40vh']);
  const yUp = useTransform(scrollYProgress, [0, 1], ['40vh', '-40vh']);

  return (
    // Zmiana wysokości na h-[150vh] (1.5x wysokość ekranu)
    <section 
      ref={galleryRef} 
      className="relative h-[150vh] w-full bg-black overflow-hidden border-y border-black"
    >
      {/* Zmniejszony gap między zdjęciami na wniosek (wcześniej gap-3/gap-4) */}
      <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 p-1 md:p-2">
        
        <Column images={col1} y={yDown} />
        <Column images={col2} y={yUp} className="hidden md:flex" />
        <Column images={col3} y={yDown} />
        <Column images={col4} y={yUp} className="hidden md:flex" />

      </div>

      {/* Nakładka z napisem - mocny kontrast do kolorowych zdjęć w tle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-2xl">
        <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-bold tracking-tighter lowercase text-[#2ed8a4] select-none mix-blend-overlay">
          życie <br /> fundacji.
        </h2>
      </div>
    </section>
  );
}

// --- Podkomponent pojedynczej kolumny ---
interface ColumnProps {
  images: string[];
  y: MotionValue<string>;
  className?: string;
}

function Column({ images, y, className }: ColumnProps) {
  return (
    <motion.div 
      style={{ y }} 
      // h-[200%] zapewnia zapas zdjęć przy dłuższym scrollowaniu
      // Zmniejszony gap również między obrazkami w kolumnie
      className={cn("relative h-[200%] flex flex-col gap-1 md:gap-2 -top-[50%]", className)}
    >
      {images.map((src, idx) => (
        <div key={idx} className="relative w-full aspect-[3/4] overflow-hidden  group">
          <Image 
            src={src}
            alt="Zdjęcie z galerii Fundacji Maszt"
            fill
            // Usunięte filtry szarości. Czysty kolor od samego początku.
            // Zostawiłem tylko delikatne powiększenie na hover dla interakcji.
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </motion.div>
  );
}