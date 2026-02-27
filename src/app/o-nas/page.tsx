import { Team } from '@/components/sections/team';
import data from '@/lib/data.json';
import Link from 'next/link';
import Image from 'next/image';
// Upewnij się, że ścieżka do komponentu Team jest poprawna w Twoim projekcie:

export default function AboutPage() {
  const slugPath = 'o-nas';
  const pageData = data.find((p) => {
    const pPath = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
    return pPath === slugPath;
  });

  if (!pageData) {
    return <div className="p-24 text-4xl font-bold tracking-tighter">404 - nie znaleziono strony.</div>;
  }

  // Mapujemy dane Zespołu z JSONa do formatu, jakiego oczekuje nasz komponent <Team />
  // Używamy biogramów jako "cytatów", co w naszym wielkim layoucie wierszowym będzie wyglądać super profesjonalnie.
  const teamData = [
    { 
      autor: "Alicja Sobik-Lipus (Członkini Zarządu)", 
      cytat: "Psycholożka, psychoterapeutka, była zaangażowana w działania związku zawodowego." 
    },
    { 
      autor: "Michał Naczyński (Członek Zarządu)", 
      cytat: "Psycholog, psychoterapeuta. Koordynator projektów przy Stowarzyszeniu Oświatowym Rodzice-Dzieciom w Rybniku. Członek Zarządu Krajowego Ogólnopolskiego Związku Zawodowego Psychologów (2021-25)." 
    },
    { 
      autor: "Magdalena Kufka (Członkini Zarządu)", 
      cytat: "Psycholożka, psychoterapeutka. Prowadziła projekty w Stowarzyszeniu Pod Wieżą przy rybnickim szpitalu psychiatrycznym." 
    }
  ];

  return (
    <div className="flex flex-col w-full text-black bg-white min-h-screen">
      
      {/* =========================================
          1. HEADER / MANIFEST
          ========================================= */}
      <section className="relative w-full pt-28 pb-12 md:pt-40 md:pb-16 px-6 md:px-6 lg:px-6 border-b border-black overflow-hidden flex flex-col justify-end min-h-[40vh] md:min-h-[50vh]">
        
        {/* Warstwa Tła */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2548&auto=format&fit=crop" 
            alt="Tło o nas"
            fill
            priority
            className="object-cover select-none"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mt-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.85] lowercase mb-8 text-white">
            o nas.
          </h1>
        </div>
      </section>

      {/* =========================================
          2. GENEZA / O FUNDACJI (Split screen)
          ========================================= */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 border-b border-black">
        
        {/* Lewa strona - Dlaczego to robimy? */}
        <div className="px-6 py-8 md:py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-black flex flex-col justify-between">
          <span className="font-bold text-sm uppercase tracking-widest text-black/40 mb-12 block">
            Idea
          </span>
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-black/80">
            Fundacja Maszt została powołana przez Centrum Psychoterapii i Psychiatrii CognitivaMed. Świadczenie pomocy psychologicznej w chwilach kryzysu lub choroby uświadamia, jak bardzo ludzie – dzieci, młodzież, dorośli – cierpią z poczucia bycia niewystarczającymi. Nawet jeśli próbują pokazać, że są silni i kompetentni, nie potrafią odnaleźć miejsca, w którym mogliby siebie takimi przetestować. Chcemy, aby w naszej lokalnej społeczności ludzie mogli odkrywać w sobie siłę.
          </p>
        </div>

        {/* Prawa strona - Dlaczego "Maszt"? (Rybnik) */}
        <div className="px-6 py-8 md:py-12 lg:py-16 flex flex-col justify-between bg-[#f8f8f8]">
          <span className="font-bold text-sm uppercase tracking-widest text-black/40 mb-12 block">
            Korzenie
          </span>
          <div className="text-lg md:text-xl leading-relaxed tracking-tight text-black/80">
            Fundacja powstała w Rybniku, a jej siedziba mieści się w dzielnicy Orzepowice. Na północ znajduje się Zalew Rybnicki, na którym nadal można zobaczyć łódki z masztami i wiatrem dmuchającym w żagle. <br/><br/>
            Zalew powstał sztucznie na potrzeby Elektrowni Rybnik, od której maszty wysokiego napięcia przesyłają ogrom energii mieszkańcom miasta i okolic. Było dla nas oczywiste, że Rybnik nierozerwalnie związany jest z masztem.
          </div>
        </div>

      </section>

      {/* =========================================
          3. ZESPÓŁ (Używamy gotowego komponentu)
          ========================================= */}
      {/* Przekazujemy zmapowane dane do propsa team */}
      <Team team={teamData} />

      {/* =========================================
          4. RADA FUNDACJI (Ciemny przerywnik)
          ========================================= */}
      <section className="w-full bg-[#1c3028] text-white px-6 py-8 md:py-12 lg:py-16 border-b border-black grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
        <div className="lg:col-span-4 flex items-start">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase">
            rada <br/> fundacji.
          </h2>
        </div>
        <div className="lg:col-span-8 flex items-center">
          <p className="text-xl md:text-2xl font-light tracking-tight leading-relaxed text-white/90 max-w-3xl">
            W przyszłości czeka nas zawiązanie Rady Fundacji, która ma wspierać nas w budowaniu kierunków działań i rozwoju, służyć radą, wsparciem oraz doświadczeniem. Każda osoba, która znajdzie się w tym miejscu, będzie dla nas ważna, cenna i wiemy, że wiele będziemy jej zawdzięczać.
          </p>
        </div>
      </section>

      {/* =========================================
          5. DOKUMENTY (Rejestr plików)
          ========================================= */}
      {pageData.pliki && pageData.pliki.length > 0 && (
        <section className="w-full bg-white flex flex-col">
          
          <div className="px-6 py-8 md:py-12 lg:py-16 border-b border-black bg-[#abeedb]">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase text-[#1c3028]">
              dokumenty <br className="hidden md:block"/> i transparentność.
            </h2>
          </div>

          <div className="w-full flex flex-col">
            {pageData.pliki.map((plik, i) => {
              // Formatujemy nazwy plików, żeby wyglądały profesjonalnie (usuwamy myślniki, rozszerzenia, poprawiamy wielkość liter)
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
                  {/* Numer porządkowy */}
                  <div className="hidden md:flex md:col-span-1 p-6 border-r border-black/20 group-hover:border-white/20 items-center justify-center transition-colors">
                    <span className="font-mono text-sm text-black/40 group-hover:text-white/40">
                      /0{i + 1}
                    </span>
                  </div>

                  {/* Nazwa pliku */}
                  <div className="md:col-span-8 p-6 md:p-8 flex items-center border-b md:border-b-0 md:border-r border-black/20 group-hover:border-white/20 transition-colors">
                    <span className="text-xl md:text-2xl font-bold tracking-tighter capitalize text-black group-hover:text-white transition-colors">
                      {niceName || 'Dokument fundacji'}
                    </span>
                  </div>

                  {/* Format i Akcja */}
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

    </div>
  );
}