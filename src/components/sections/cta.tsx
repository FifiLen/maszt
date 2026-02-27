import Link from 'next/link';

export function JoinUs() {
  return (
    // Układ łamiący się z 1 kolumny (mobile) na 2 kolumny (desktop)
    // Twarda, czarna ramka trzymająca sekcję w ryzach
    <section className="w-full flex flex-col lg:flex-row border-t border-black z-20 relative bg-white">
      
      {/* --- LEWA STRONA: MANIFEST (Fioletowy blok) --- */}
      <div className="w-full lg:w-1/2 bg-[#8c4693] px-6 py-8 md:py-12 lg:py-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black">
        
       
        {/* Ogromny, ciasny nagłówek dopasowany do reszty strony */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.85] lowercase text-white mb-12">
          czujesz już <br /> wiatr <br /> w żaglach?
        </h2>
        
        <p className="text-white/90 text-[15px] leading-relaxed max-w-md">
          Samostanowienie, sprawczość i wspólnota pozwalają doświadczać bycia wartościowym człowiekiem! Chcemy, aby w naszej społeczności ludzie mogli odkrywać w sobie te aspekty.
        </p>
      </div>

      {/* --- PRAWA STRONA: KLIKALNE BLOKI (Jeden na drugim) --- */}
      <div className="w-full lg:w-1/2 flex flex-col">

        {/* Akcja 1: Miętowy blok (Wolontariat) */}
        <Link 
          href="/wolontariat" 
          className="group flex-1 bg-[#2ed8a4] text-[#1c3028] px-6 py-8 md:py-12 lg:py-16 border-b border-black flex flex-col justify-between hover:bg-white transition-colors duration-500 min-h-[300px]"
        >
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-sm opacity-50">/01</span>
            {/* Obracająca się strzałka na hover */}
            <svg 
              className="w-8 h-8 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter lowercase leading-[0.9]">
              płynę dalej <br /> razem z wami!
            </h3>
          </div>
        </Link>

        {/* Akcja 2: Ciemno-zielony/Grafitowy blok (Darowizna) */}
        {/* Na hoverze zmienia się na Wasz morski turkus (#3ead8f) */}
        <Link 
          href="/darowizna" 
          className="group flex-1 bg-[#1c3028] text-white px-6 py-8 md:py-12 lg:py-16 flex flex-col justify-between hover:bg-[#3ead8f] transition-colors duration-500 min-h-[300px]"
        >
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-sm opacity-50">/02</span>
            <svg 
              className="w-8 h-8 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter lowercase leading-[0.9]">
              stawiam z wami <br /> nowy żagiel!
            </h3>
          </div>
        </Link>

      </div>

    </section>
  );
}