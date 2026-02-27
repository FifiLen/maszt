import data from '@/lib/data.json';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjektyPage() {
  const slugPath = 'projekty';
  const pageData = data.find((p) => {
    const pPath = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
    return pPath === slugPath;
  });

  if (!pageData) {
    return <div className="p-24 text-4xl font-bold tracking-tighter">404 - nie znaleziono strony.</div>;
  }

  return (
    <div className="flex flex-col w-full text-black bg-white min-h-screen">
      
      {/* =========================================
          1. GIGANTYCZNY HEADER
          ========================================= */}
      <section className="relative w-full pt-28 pb-12 md:pt-40 md:pb-16 px-6 md:px-6 lg:px-6 border-b border-black overflow-hidden flex flex-col justify-end min-h-[40vh] md:min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2569&auto=format&fit=crop" 
            alt="Tło projekty"
            fill
            priority
            className="object-cover select-none"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-5xl mt-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.85] lowercase mb-8 text-white">
            projekty.
          </h1>
        </div>
      </section>

      {/* =========================================
          2. TREŚĆ GŁÓWNA (Z JSONa) - Styl Editorial
          ========================================= */}
      {pageData.tresc && (
        <section className="w-full border-b border-black grid grid-cols-1 lg:grid-cols-12 bg-[#fafafa]">
          <div className="lg:col-span-5 px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between">
            <span className="font-bold text-sm uppercase tracking-widest text-black/40 mb-12 block">
              Założenia
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase leading-[0.9]">
              przekuwamy <br /> idee w czyny.
            </h2>
          </div>
          <div className="lg:col-span-7 px-6 py-8 md:py-12 lg:py-16 flex flex-col justify-center bg-white">
            <div className="whitespace-pre-wrap text-lg md:text-xl leading-relaxed tracking-tight text-black/80 font-light">
              {pageData.tresc}
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          3. KATALOG PROJEKTÓW (Portfolio Grid)
          Struktura na bazie wcześniejszych ustaleń.
          ========================================= */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-3 border-b border-black bg-white">
        
        {/* PROJEKT 01 */}
        <div className="group flex flex-col border-b lg:border-b-0 lg:border-r border-black hover:bg-[#8c4693] hover:text-white transition-colors duration-500 cursor-pointer min-h-[400px]">
          <div className="px-6 py-8 md:py-12 flex justify-between items-start border-b border-black/10 group-hover:border-white/20">
            <span className="font-mono text-sm text-black/40 group-hover:text-white/40 transition-colors">/01</span>
            <span className="text-xs font-bold uppercase tracking-widest border border-black group-hover:border-white px-3 py-1 transition-colors">
              W toku
            </span>
          </div>
          <div className="px-6 py-8 md:py-12 flex-grow flex flex-col justify-end">
            <span className="text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-white/60 mb-4 block transition-colors">
              Zdrowie Psychiczne
            </span>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase leading-[0.9] mb-6">
              rodzinny <br /> restart.
            </h3>
            <p className="text-[15px] font-light tracking-tight leading-relaxed opacity-80">
              Wsparcie dla rodzin i bliskich. Przeciwdziałanie wypaleniu rodzicielskiemu poprzez warsztaty kompetencji oraz grupy wsparcia.
            </p>
          </div>
        </div>

        {/* PROJEKT 02 */}
        <div className="group flex flex-col border-b lg:border-b-0 lg:border-r border-black hover:bg-[#1c3028] hover:text-white transition-colors duration-500 cursor-pointer min-h-[400px]">
          <div className="px-6 py-8 md:py-12 flex justify-between items-start border-b border-black/10 group-hover:border-white/20">
            <span className="font-mono text-sm text-black/40 group-hover:text-white/40 transition-colors">/02</span>
            <span className="text-xs font-bold uppercase tracking-widest border border-[#2ed8a4] text-[#2ed8a4] px-3 py-1">
              Nowość
            </span>
          </div>
          <div className="px-6 py-8 md:py-12 flex-grow flex flex-col justify-end">
             <span className="text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-white/60 mb-4 block transition-colors">
              Aktywność Obywatelska
            </span>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase leading-[0.9] mb-6">
              młodzi, aktywni, <br /> samorządni.
            </h3>
            <p className="text-[15px] font-light tracking-tight leading-relaxed opacity-80">
              Infrastruktura i finansowanie dla nieformalnych grup młodzieżowych. Fundusz Parasolowy w akcji.
            </p>
          </div>
        </div>

        {/* PROJEKT 03 */}
        <div className="group flex flex-col hover:bg-[#3ead8f] hover:text-white transition-colors duration-500 cursor-pointer min-h-[400px]">
          <div className="px-6 py-8 md:py-12 flex justify-between items-start border-b border-black/10 group-hover:border-white/20">
            <span className="font-mono text-sm text-black/40 group-hover:text-white/40 transition-colors">/03</span>
            <span className="text-xs font-bold uppercase tracking-widest border border-black group-hover:border-white px-3 py-1 transition-colors">
              Zakończony
            </span>
          </div>
          <div className="px-6 py-8 md:py-12 flex-grow flex flex-col justify-end">
            <span className="text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-white/60 mb-4 block transition-colors">
              Partycypacja
            </span>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase leading-[0.9] mb-6">
              załoga <br /> na pokład.
            </h3>
            <p className="text-[15px] font-light tracking-tight leading-relaxed opacity-80">
              Godomy o edukacji. Cykl debat rybnickiej samorządności uczniów, upominający się o głos młodych w przestrzeni miejskiej.
            </p>
          </div>
        </div>

      </section>

      {/* =========================================
          4. REJESTR PLIKÓW (Regulaminy, raporty z projektów)
          ========================================= */}
      {pageData.pliki && pageData.pliki.length > 0 && (
        <section className="w-full bg-white flex flex-col">
          
          <div className="px-6 py-8 md:py-12 lg:py-16 border-b border-black bg-[#fafafa]">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase text-black">
              pliki <br className="hidden md:block"/> projektowe.
            </h2>
          </div>

          <div className="w-full flex flex-col">
            {pageData.pliki.map((plik, i) => {
              let rawName = plik.url.split('/').pop() || `Dokument ${i+1}`;
              const ext = rawName.split('.').pop() || '';
              let niceName = rawName.replace(/-/g, ' ').replace(`.${ext}`, '').replace(/12\.07\.2024|1/g, '').trim();
              
              return (
                <a 
                  key={i}
                  href={`/pobrane_pliki/${plik.url.split('/').pop()}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="group w-full grid grid-cols-1 md:grid-cols-12 border-b border-black hover:bg-black transition-colors duration-300 items-stretch"
                >
                  <div className="hidden md:flex md:col-span-1 p-6 border-r border-black/20 group-hover:border-white/20 items-center justify-center transition-colors">
                    <span className="font-mono text-sm text-black/40 group-hover:text-white/40">
                      /0{i + 1}
                    </span>
                  </div>

                  <div className="md:col-span-8 p-6 md:p-8 flex items-center border-b md:border-b-0 md:border-r border-black/20 group-hover:border-white/20 transition-colors">
                    <span className="text-xl md:text-2xl font-bold tracking-tighter capitalize text-black group-hover:text-white transition-colors">
                      {niceName || 'Dokument projektowy'}
                    </span>
                  </div>

                  <div className="md:col-span-3 p-6 md:p-8 flex items-center justify-between group-hover:bg-[#2ed8a4] transition-colors duration-300">
                    <span className="font-bold text-sm uppercase tracking-widest text-black/40 group-hover:text-[#1c3028] transition-colors">
                      {ext}
                    </span>
                    <svg className="w-6 h-6 text-black transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================
          FINALNY CTA
          ========================================= */}
      <section className="w-full bg-[#1c3028] text-white py-24 md:py-32 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter lowercase mb-12">
          masz pomysł <br /> na projekt?
        </h2>
        <Link href="/kontakt" className="group flex items-center gap-4 text-xl md:text-2xl font-bold tracking-tight uppercase border-b-2 border-white pb-2 hover:text-[#2ed8a4] hover:border-[#2ed8a4] transition-colors">
          odezwij się do nas
          <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

    </div>
  );
}