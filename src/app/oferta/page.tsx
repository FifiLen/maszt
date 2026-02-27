import data from '@/lib/data.json';
import Link from 'next/link';
import Image from 'next/image';

export default function OfertaPage() {
  const slugPath = 'oferta';
  const pageData = data.find((p) => {
    const pPath = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
    return pPath === slugPath;
  });

  if (!pageData) {
    return <div className="p-24 text-4xl font-bold tracking-tighter">404 - nie znaleziono strony.</div>;
  }

  // Wyciągamy plik raportu, by go później zgrabnie użyć
  const raportPlik = pageData.pliki && pageData.pliki.length > 0 ? pageData.pliki[0] : null;

  return (
    <div className="flex flex-col w-full text-black bg-white min-h-screen">
      
      {/* =========================================
          1. HEADER / MANIFEST
          ========================================= */}
      <section className="relative w-full pt-28 pb-12 md:pt-40 md:pb-16 px-6 md:px-6 lg:px-6 border-b border-black overflow-hidden flex flex-col justify-end min-h-[40vh] md:min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop" 
            alt="Tło oferta"
            fill
            priority
            className="object-cover select-none"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-5xl mt-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.85] lowercase mb-8 text-white">
            oferta <br /> komercyjna.
          </h1>
        </div>
      </section>

      {/* =========================================
          2. MODEL BIZNESOWY / USP (Value Proposition)
          ========================================= */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        
        {/* Lewa: Dlaczego to robimy? */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-[#f8f8f8]">
          <div>
            <span className="font-mono text-sm uppercase tracking-widest text-black/40 mb-8 block">
              [ Model Działania ]
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter lowercase leading-[0.9] mb-8">
              biznes na korzyść <br /> mieszkańców.
            </h2>
            <p className="text-lg md:text-xl font-light tracking-tight leading-relaxed text-black/80">
              Sięganie po granty publiczne i fundusze zagraniczne ogranicza ciągłość działań każdej organizacji. Zmienność rynku nie pozwala na uzależnianie się od darowizn. Dlatego działamy w obszarze usług. Fundacja Maszt ma za zadanie generować dochód, który w 100% służy realizowaniu celów statutowych.
            </p>
          </div>
        </div>

        {/* Prawa: Trzy komponenty (Zabawa paletą) */}
        <div className="flex flex-col">
          <div className="px-6 py-8 md:py-12 border-b border-black flex flex-col justify-center bg-white">
            <h3 className="text-2xl font-bold tracking-tighter lowercase mb-6">każda nasza usługa to 3 komponenty:</h3>
            
            <ul className="flex flex-col gap-4 font-mono text-sm md:text-base tracking-tight">
              <li className="flex items-start gap-4">
                <span className="text-black/30">/01</span>
                <span>Wynagrodzenia trenera/specjalisty oraz koszty realizacji.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-black/30">/02</span>
                <span>Środki na utrzymanie Fundacji <span className="font-bold">(zwykle 1-10%)</span>.</span>
              </li>
            </ul>
          </div>

          {/* Główny atut: Nadwyżka */}
          <div className="px-6 py-8 md:py-12 flex-grow flex flex-col justify-center bg-[#2ed8a4] text-[#1c3028]">
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-sm opacity-50">/03</span>
              <span className="text-xs font-bold uppercase tracking-widest border border-[#1c3028] px-3 py-1">Ty wybierasz!</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tighter lowercase leading-[0.9] mb-4">
              nadwyżka idzie na projekt fundacji.
            </h3>
            <p className="text-base font-medium tracking-tight leading-relaxed opacity-90">
              Zamawiając usługę u nas wiesz, co dzieje się z Twoimi pieniędzmi. Masz możliwość podjąć decyzję, czy chcesz wesprzeć warsztaty dla rodziców dzieci w spektrum autyzmu, czy też projekt wolontariatu w Twojej dzielnicy.
            </p>
          </div>
        </div>

      </section>

      {/* =========================================
          3. PAKIETY USŁUG (Architektoniczna siatka 2x2)
          ========================================= */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
        
        {/* USŁUGA 1: Komunikacja */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b lg:border-r border-black flex flex-col group hover:bg-[#1c3028] hover:text-white transition-colors duration-500">
          <div className="flex justify-between items-start mb-16">
            <span className="font-mono text-sm text-black/40 group-hover:text-white/40">/01</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase mb-8 leading-[0.9]">
            komunikacja, <br /> wychowanie.
          </h3>
          <p className="text-lg font-light tracking-tight leading-relaxed opacity-80 mb-8 flex-grow">
            Prowadzimy szkolenia w obszarach komunikacji (współpraca, asertywność, negocjacje). Instytucje chcące wspierać rodziców zapraszamy na warsztaty kompetencji rodzicielskich. Proponujemy formy od klasycznych wykładów po gry symulacyjne. Zawsze badamy zapotrzebowanie uczestników przed realizacją.
          </p>
        </div>

        {/* USŁUGA 2: Zdrowie psychiczne */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b border-black flex flex-col group hover:bg-[#8c4693] hover:text-white transition-colors duration-500">
          <div className="flex justify-between items-start mb-16">
            <span className="font-mono text-sm text-black/40 group-hover:text-white/40">/02</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase mb-8 leading-[0.9]">
            zdrowie <br /> psychiczne.
          </h3>
          <p className="text-lg font-light tracking-tight leading-relaxed opacity-80 mb-8 flex-grow">
            Warsztaty z radzenia sobie ze stresem, mindfulness, przeciwdziałanie wypaleniu zawodowemu. Dla szkół proponujemy strategie pracy z uczniami z trudnościami emocjonalnymi, Treningi Umiejętności Społecznych (TUS) oraz metody przeciwdziałania przemocy rówieśniczej.
          </p>
        </div>

        {/* USŁUGA 3: Procesy partycypacyjne */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col group hover:bg-black hover:text-white transition-colors duration-500">
          <div className="flex justify-between items-start mb-16">
            <span className="font-mono text-sm text-black/40 group-hover:text-white/40">/03</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase mb-8 leading-[0.9]">
            procesy <br /> partycypacyjne.
          </h3>
          <p className="text-lg font-light tracking-tight leading-relaxed opacity-80 mb-8 flex-grow">
            Gotowość do słuchania opinii to połowa drogi do innowacji. Pomożemy Wam zorganizować konsultacje, debaty, warsztaty w szkole lub zakładzie pracy. Wspieramy samorządy uczniowskie, motywujemy pracowników i rozwiązujemy problemy w środowisku pracy.
          </p>
        </div>

        {/* USŁUGA 4: Badania i raporty */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 border-black flex flex-col group bg-[#fafafa] hover:bg-white transition-colors duration-500 relative">
          <div className="flex justify-between items-start mb-16">
            <span className="font-mono text-sm text-black/40">/04</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase mb-8 leading-[0.9]">
            badania <br /> i raporty.
          </h3>
          <p className="text-lg font-light tracking-tight leading-relaxed opacity-80 mb-12 flex-grow">
            Nasz zespół ma potężne doświadczenie badawcze (analizy sytuacji zarobowej, opinie środowiskowe, badania potrzeb młodzieży). Możemy razem z Wami lub na Wasze zlecenie opracować proces badawczy, przeprowadzić ankiety, zanalizować wyniki i wydać twarde rekomendacje.
          </p>
          
          {/* Wyciągnięty przycisk pobierania raportu, jeśli istnieje w JSON */}
          {raportPlik && (
            <a 
              href={`/pobrane_pliki/${raportPlik.url.split('/').pop()}`}
              target="_blank" 
              rel="noreferrer"
              className="inline-flex w-full items-center justify-between border-2 border-black p-4 md:p-6 hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="flex flex-col">
                <span className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">[ Nasze badania ]</span>
                <span className="font-bold tracking-tight text-lg">Raport: Godomy o edukacji</span>
              </div>
              <svg className="w-6 h-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>

      </section>

      {/* =========================================
          4. FORMULARZ KONTAKTOWY (Dedykowany pod zapytania)
          ========================================= */}
      <section className="w-full border-t border-black grid grid-cols-1 lg:grid-cols-2">
        
        {/* Lewa: Wielkie Call to Action */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between bg-[#1c3028] text-white">
          <div>
            <h2 className="text-6xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter lowercase leading-[0.8] mb-12">
              napisz, <br /> czego <br /> potrzebujesz.
            </h2>
            <p className="text-xl font-light tracking-tight leading-relaxed opacity-90 max-w-md">
              Dla nas nie jesteś kolejną firmą czy urzędem. Jesteś częścią społeczności, która wspólnie buduje nasze społeczeństwo. Zapraszamy do wysłania zapytania ofertowego.
            </p>
          </div>
        </div>

        {/* Prawa: Brutalistyczny Formularz */}
        <div className="px-6 py-8 md:py-12 lg:py-16 bg-white flex flex-col">
          <form className="w-full h-full flex flex-col justify-between gap-16">
            
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 group relative">
                <label className="text-xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 group-focus-within:text-[#2ed8a4] transition-colors">
                  nazwa firmy / instytucji <span className="text-xs font-mono uppercase tracking-widest text-black/30 mb-1">/ req</span>
                </label>
                <input type="text" required className="w-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-[#2ed8a4] transition-colors text-2xl font-medium rounded-none" />
              </div>

              <div className="flex flex-col gap-2 group relative">
                <label className="text-xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 group-focus-within:text-[#2ed8a4] transition-colors">
                  e-mail <span className="text-xs font-mono uppercase tracking-widest text-black/30 mb-1">/ req</span>
                </label>
                <input type="email" required className="w-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-[#2ed8a4] transition-colors text-2xl font-medium rounded-none" />
              </div>

              <div className="flex flex-col gap-2 group relative">
                <label className="text-xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 group-focus-within:text-[#2ed8a4] transition-colors">
                  telefon
                </label>
                <input type="tel" className="w-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-[#2ed8a4] transition-colors text-2xl font-medium rounded-none" />
              </div>

              <div className="flex flex-col gap-2 group relative flex-grow">
                <label className="text-xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 group-focus-within:text-[#2ed8a4] transition-colors">
                  treść zapytania <span className="text-xs font-mono uppercase tracking-widest text-black/30 mb-1">/ req</span>
                </label>
                <textarea required rows={3} className="w-full h-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-[#2ed8a4] transition-colors text-xl font-medium resize-none rounded-none"></textarea>
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white py-8 text-3xl font-bold tracking-tighter lowercase hover:bg-[#2ed8a4] hover:text-[#1c3028] transition-colors duration-300 flex justify-center items-center gap-4 mt-8">
              wyślij zapytanie
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

          </form>
        </div>

      </section>

    </div>
  );
}