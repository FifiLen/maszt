import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center overflow-hidden bg-black">
      
      {/* Warstwa Tła */}
      <div className="absolute inset-0 z-0">
        <Image
          // Podmień na swoje zdjęcie/grafikę z folderu public np. src="/hero-bg.jpg"
          src="https://images.unsplash.com/photo-1520962880247-cfaf541c8724?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Tło Fundacja Maszt"
          fill
          priority
          className="object-cover select-none"
        />
        {/* Przyciemnienie zdjęcia, żeby biały tekst zawsze był czytelny */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Typografia Kaskadowa */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 mt-16">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem] font-bold text-white tracking-tighter leading-[0.85] lowercase select-none">
          <span className="block transition-transform duration-700 hover:translate-x-2">
            budujemy
          </span>
          <span className="block md:ml-[8%] transition-transform duration-700 hover:translate-x-2">
            infrastrukturę społeczną,
          </span>
          <span className="block md:ml-[16%] transition-transform duration-700 hover:translate-x-2">
            by ludzie doświadczali
          </span>
          <span className="block md:ml-[24%] text-[#2ed8a4] transition-transform duration-700 hover:translate-x-2">
            bycia wartością.
          </span>
        </h1>
      </div>

      {/* Wskaźnik scrollowania na samym dole */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>

    </section>
  );
}