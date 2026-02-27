import Link from 'next/link';

interface OfferBlock {
  tytul: string;
  desc: string;
}

interface OfferProps {
  offerDesc: string;
  offerBlocks: OfferBlock[];
}

export function Offer({ offerDesc, offerBlocks }: OfferProps) {
  return (
    <section className="w-full bg-white flex flex-col border-y border-black">
      
      {/* --- GÓRA: NAGŁÓWEK I OPIS (Oddzielone od kafelków) --- */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        
        {/* Lewa strona - Wyłącznie tytuł */}
        <div className="px-6 py-8 md:py-12 lg:py-16 flex items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none lowercase text-black">
            oferta <br className="hidden md:block" /> komercyjna.
          </h2>
        </div>
        
        {/* Prawa strona - Ten długi paragraf, teraz ma przestrzeń */}
        {/* Usunięto bg-[#fafafa], aby lewa i prawa strona gładko się łączyły bez ramki */}
        <div className="px-6 py-8 md:py-12 lg:py-16 flex items-center bg-white">
          <p className="text-black/80 text-[15px] leading-relaxed tracking-tight max-w-xl">
            {offerDesc}
          </p>
        </div>
        
      </div>

      {/* --- DÓŁ: 3 RÓWNE KAFELKI Z OFERTAMI --- */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3">
        {offerBlocks.map((block, idx) => (
          <Link 
            key={idx}
            href="/oferta"
            // Każdy kafelek to równa kolumna, na hoverze robi się czarny
            className="group flex flex-col px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black last:border-b-0 lg:last:border-r-0 hover:bg-black transition-colors duration-500 min-h-[400px]"
          >
            
            {/* Góra kafelka: Numer i Strzałka */}
            <div className="flex justify-between items-start">
              <span className="font-mono text-sm text-black/30 group-hover:text-white/40 transition-colors duration-500">
                /0{idx + 1}
              </span>
              
              {/* Strzałka lekko obrócona (wskazuje prawy górny róg), na hover animuje się */}
              <svg 
                className="w-6 h-6 text-black/20 group-hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>

            {/* Przestrzeń wypychająca treść na dół (naprawia problem z Twojego screena) */}
            <div className="flex-grow"></div>

            {/* Dół kafelka: Tytuł i krótki opis złączone w jeden solidny blok */}
            <div className="mt-16">
              <h3 className="text-2xl lg:text-3xl font-bold tracking-tighter lowercase text-black group-hover:text-white transition-colors duration-500 mb-4">
                {block.tytul}
              </h3>
              <p className="text-black/70 group-hover:text-white/70 text-[14px] leading-relaxed tracking-tight transition-colors duration-500">
                {block.desc}
              </p>
            </div>

          </Link>
        ))}
      </div>
      
    </section>
  );
}