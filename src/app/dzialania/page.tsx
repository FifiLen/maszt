import data from '@/lib/data.json';
import Link from 'next/link';
import Image from 'next/image';

export default function DzialaniaPage() {
  // Wyszukujemy dane z JSON, choć w tym layoucie wbijamy je na twardo w pięknej strukturze
  const slugPath = 'dzialania';
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
          1. HEADER / MANIFEST
          ========================================= */}
      <section className="relative w-full pt-28 pb-12 md:pt-40 md:pb-16 px-6 md:px-6 lg:px-6 border-b border-black overflow-hidden flex flex-col justify-end min-h-[40vh] md:min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2670&auto=format&fit=crop" 
            alt="Tło dzialania"
            fill
            priority
            className="object-cover select-none"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 max-w-5xl mt-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.85] lowercase mb-8 text-white">
            działania.
          </h1>
        </div>
      </section>

      {/* =========================================
          DZIAŁANIE 01: ZDROWIE PSYCHICZNE
          Tło: Białe (sterylne, kliniczne)
          ========================================= */}
      <section className="w-full border-b border-black grid grid-cols-1 lg:grid-cols-12 bg-white">
        
        {/* Lewy panel (Tytuł i Status) */}
        <div className="lg:col-span-5 px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between">
          <div>
            <span className="font-mono text-sm text-black/40 mb-8 block">/01</span>
            <span className="inline-block px-3 py-1 border border-black text-xs font-bold uppercase tracking-widest mb-6">
              Palący problem XXI w.
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter lowercase leading-[0.85] mb-12">
              zdrowie <br /> psychiczne.
            </h2>
          </div>

          {/* Status Tracker */}
          <div className="flex flex-col gap-6 mt-12 border-t border-black/10 pt-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Aktualnie realizujemy</span>
              <span className="font-bold text-lg tracking-tight">✦ Rodzinny restart</span>
              <span className="font-bold text-lg tracking-tight">✦ Pierwsza Pomoc przedPsychologiczna</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Chcemy zrealizować</span>
              <span className="font-medium text-lg tracking-tight text-black/70">Grupa wsparcia dla rodziców dzieci z zaburzeniami psychicznymi</span>
            </div>
          </div>
        </div>

        {/* Prawy panel (Opis i Akcje) */}
        <div className="lg:col-span-7 px-6 py-8 md:py-12 lg:py-16 flex flex-col">
          <p className="text-lg md:text-xl font-light tracking-tight leading-relaxed text-black/80 mb-12">
            Chcemy promować dbanie o zdrowie psychiczne, zdrowe warunki wychowawcze i zawodowe, przeciwdziałać wypaleniu rodzicielskiemu, nadużywaniu substancji. Są to ważne i palące potrzeby społeczne. Szczególnie ważni są dla nas rodzice, których dzieci korzystają z leczenia w ośrodkach prywatnych – wiedząc, jak bardzo rodzice potrzebują wsparcia, chcemy móc zapewnić im je w formie nieodpłatnej.
          </p>
          
          <div className="bg-black/5 p-8 border border-black/10 mb-16">
            <h3 className="text-3xl font-bold tracking-tighter lowercase mb-6 text-[#2ed8a4]">nasze formy wsparcia.</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-base font-light tracking-tight text-black/80">
              <li className="flex items-start gap-2"><span className="text-[#2ed8a4]">✦</span> kampanie informacyjne</li>
              <li className="flex items-start gap-2"><span className="text-[#2ed8a4]">✦</span> tworzenie materiałów psychoedukacyjnych</li>
              <li className="flex items-start gap-2"><span className="text-[#2ed8a4]">✦</span> warsztaty dot. stresu dla rodziców</li>
              <li className="flex items-start gap-2"><span className="text-[#2ed8a4]">✦</span> grupy wsparcia</li>
              <li className="flex items-start gap-2"><span className="text-[#2ed8a4]">✦</span> warsztaty kompetencji wychowawczych</li>
            </ul>
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-black/10">
            <Link href="/kontakt" className="bg-black text-white px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#8c4693] transition-colors text-center flex items-center justify-center">
              Zaangażuj się!
            </Link>
            <Link href="/darowizna" className="bg-transparent border border-black text-black px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors text-center flex items-center justify-center">
              Sfinansuj 30 min zajęć
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          DZIAŁANIE 02: AKTYWNOŚĆ OBYWATELSKA (Parasol)
          Tło: Ciemny grafit (#1c3028)
          ========================================= */}
      <section className="w-full border-b border-black grid grid-cols-1 lg:grid-cols-12 bg-[#1c3028] text-white">
        
        {/* Lewy panel */}
        <div className="lg:col-span-5 px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col justify-between">
          <div>
            <span className="font-mono text-sm text-white/40 mb-8 block">/02</span>
            <span className="inline-block px-3 py-1 border border-white/30 text-xs font-bold uppercase tracking-widest mb-6">
              Każdy z nas tworzy lepszy świat.
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter lowercase leading-[0.85] mb-12">
              aktywność <br /> obywatelska.
            </h2>
          </div>

          {/* Status Tracker */}
          <div className="flex flex-col gap-6 mt-12 border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2ed8a4] mb-2">Aktualnie realizujemy</span>
              <span className="font-bold text-lg tracking-tight">✦ Młodzi, Aktywni, Samorządni</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Ostatnio zrealizowaliśmy</span>
              <span className="font-medium text-lg tracking-tight text-white/70">Akcja charytatywna "Miłość na cztery łapy"</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Chcemy zrealizować</span>
              <span className="font-medium text-lg tracking-tight text-white/70">Profesjonalnie w socialach dla młodych</span>
            </div>
          </div>
        </div>

        {/* Prawy panel */}
        <div className="lg:col-span-7 px-6 py-8 md:py-12 lg:py-16 flex flex-col">
          <p className="text-lg md:text-xl font-light tracking-tight leading-relaxed text-white/90 mb-12">
            Stawiamy na młodych ludzi i ich chęć do testowania własnych pomysłów. Mówiąc, że budujemy infrastrukturę, chcemy stać się organizacją parasolową dla grup nieformalnych, by pod naszymi żaglami mogli sięgać po granty, realizować swoje projekty i korzystać z naszego wsparcia administracyjnego.
          </p>
          
          {/* Sub-moduł: Fundusz Parasolowy */}
          <div className="bg-white/5 p-8 border border-white/10 mb-16">
            <h3 className="text-3xl font-bold tracking-tighter lowercase mb-6 text-[#2ed8a4]">fundusz parasolowy.</h3>
            <p className="text-base font-light leading-relaxed text-white/80 mb-6">
              Dla nieformalnych grup młodych ludzi (do 30 r.ż.) oferujemy wsparcie administracyjne i księgowe, by umożliwić im realizację ich własnych pomysłów (np. akcje wolontaryjne, wpisy dla dawców szpiku).
            </p>
            <p className="text-sm font-light text-white/60 leading-relaxed border-l border-white/20 pl-4">
              Środki z funduszu mogą zostać wykorzystane wyłącznie w celach zgodnych z definicją pożytku publicznego – nie na cele polityczne. Mają wspierać samodzielność młodych.
            </p>
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8 border-t border-white/10">
            <Link href="/kontakt" className="bg-[#2ed8a4] text-[#1c3028] px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors text-center flex items-center justify-center">
              Pomoc w grancie
            </Link>
            <Link href="/kontakt" className="bg-transparent border border-white/30 text-white px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#1c3028] transition-colors text-center flex items-center justify-center">
              Skorzystaj z funduszu
            </Link>
            <Link href="/darowizna" className="bg-transparent border border-[#2ed8a4] text-[#2ed8a4] px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#2ed8a4] hover:text-[#1c3028] transition-colors text-center flex items-center justify-center">
              Wesprzyj to
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          DZIAŁANIE 03: PARTYCYPACJA MŁODYCH
          Tło: Głęboki fiolet (#8c4693)
          ========================================= */}
      <section className="w-full border-b border-black grid grid-cols-1 lg:grid-cols-12 bg-[#8c4693] text-white">
        
        {/* Lewy panel */}
        <div className="lg:col-span-5 px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black/20 flex flex-col justify-between">
          <div>
            <span className="font-mono text-sm text-white/40 mb-8 block">/03</span>
            <span className="inline-block px-3 py-1 border border-white/30 text-xs font-bold uppercase tracking-widest mb-6">
              Dzieci i młodzież częścią społeczeństwa.
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter lowercase leading-[0.85] mb-12">
              partycypacja <br /> młodych.
            </h2>
          </div>

          {/* Status Tracker */}
          <div className="flex flex-col gap-6 mt-12 border-t border-black/20 pt-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-[#abeedb] mb-2">Aktualnie realizujemy</span>
              <span className="font-bold text-lg tracking-tight">✦ Załoga na pokład</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Ostatnio zrealizowaliśmy</span>
              <span className="font-medium text-lg tracking-tight text-white/70">Godomy o edukacji. Rybnicka debata o samorządności uczniów.</span>
            </div>
          </div>
        </div>

        {/* Prawy panel */}
        <div className="lg:col-span-7 px-6 py-8 md:py-12 lg:py-16 flex flex-col">
          <p className="text-lg md:text-xl font-light tracking-tight leading-relaxed text-white/90 mb-12">
            Upominamy się o głos dzieci i młodzieży w debacie publicznej, edukacji oraz w domu. Podejmujemy się działań, które mają nauczyć dorosłych tworzenia warunków umożliwiających młodym ludziom wypowiedzenie się na każdy temat. Chcemy pokazać młodzieży, że ich głos jest ważny! Organizujemy warsztaty, konferencje młodzieżowe, debaty i panele.
          </p>
          
          {/* Sub-moduł: Fundusz Partycypacyjny */}
          <div className="bg-black/10 p-8 border border-black/20 mb-16">
            <h3 className="text-3xl font-bold tracking-tighter lowercase mb-6 text-[#abeedb]">fundusz partycypacyjny.</h3>
            <p className="text-base font-light leading-relaxed text-white/90 mb-6">
              Chcemy uczyć dzieci i młodzież asertywnego wyrażania swoich opinii, a dorosłych – jak ich słuchać. Środki z funduszu służą organizacji kampanii, warsztatów, a także opłaceniu wyjazdów młodzieży na debaty i wydarzenia krajowe czy międzynarodowe.
            </p>
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8 border-t border-black/20">
            <Link href="/kontakt" className="bg-white text-[#8c4693] px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors text-center flex items-center justify-center">
              Zorganizuj event
            </Link>
            <Link href="/kontakt" className="bg-transparent border border-white/30 text-white px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#8c4693] transition-colors text-center flex items-center justify-center">
              Skorzystaj z funduszu
            </Link>
            <Link href="/darowizna" className="bg-black text-white px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#abeedb] hover:text-black transition-colors text-center flex items-center justify-center">
              Wesprzyj głos młodych
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          FINALNY CTA
          ========================================= */}
      <section className="w-full bg-[#abeedb] text-[#1c3028] py-24 md:py-32 flex flex-col items-center justify-center border-b border-black text-center px-6">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter lowercase mb-12">
          sprawdź, dla kogo <br /> jesteśmy partnerem.
        </h2>
        <Link href="/oferta" className="group flex items-center gap-4 text-xl md:text-2xl font-bold tracking-tight uppercase border-b-2 border-[#1c3028] pb-2 hover:opacity-50 transition-opacity">
          zobacz ofertę komercyjną
          <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

    </div>
  );
}