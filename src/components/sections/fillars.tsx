import Link from 'next/link';

interface FillarItem {
  tytul: string;
  tresc: string;
}

interface FillarsProps {
  obszary: FillarItem[];
}

export function Fillars({ obszary }: FillarsProps) {
  return (
    <section className="w-full pt-24 bg-white">
      
      <div className="w-full px-6 md:px-6 lg:px-6 mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none lowercase text-black">
          trzy filary <br className="hidden md:block" /> naszej działalności.
        </h2>
        <p className="max-w-sm text-black/60 text-[15px] leading-relaxed tracking-tight">
          Zbudowaliśmy Fundację Maszt na solidnych fundamentach. To przestrzenie, w których edukujemy, wspieramy i dajemy wiatr w żagle.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 border-y border-black">
        {obszary.map((item, idx) => (
          <div 
            key={idx} 
            // 1. ZMIANA: Usunięto paddingi (px i py) stąd, aby dzieci mogły dotykać krawędzi
            className="flex flex-col border-b lg:border-b-0 lg:border-r border-black last:border-b-0 lg:last:border-r-0 hover:bg-[#f8f8f8] transition-colors duration-300 group"
          >
            
            {/* 2. ZMIANA: Dodano wrapper na treść z górnym i bocznym paddingiem */}
            <div className="flex flex-col flex-grow px-6 md:px-6 lg:px-6 pt-12 pb-10 md:pt-16 lg:pt-20 lg:pb-12">
              <span className="text-6xl md:text-7xl font-light text-black/10 tracking-tighter mb-8 group-hover:text-black transition-colors duration-300 select-none">
                0{idx + 1}
              </span>
              
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter lowercase mb-6 text-black">
                {item.tytul}
              </h3>
              
              <p className="text-black/70 text-[15px] leading-relaxed tracking-tight">
                {item.tresc}
              </p>
            </div>
            
            {/* 3. ZMIANA: Link jest teraz pełnoszerokościowym "stopką-przyciskiem" */}
            <Link 
              href={`/dzialania#${item.tytul.toLowerCase().replace(/ /g, '-')}`} 
              // Dodano własne paddingi, border-t zajmuje teraz całą szerokość
              className="mt-auto px-6 py-6 md:px-6 lg:px-6 border-t border-black flex items-center justify-between group-hover:border-black transition-all duration-300 text-black hover:bg-black/5"
            >
              <span className="text-[14px] font-semibold tracking-tight lowercase">czytaj dalej</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
          </div>
        ))}
      </div>

    </section>
  );
}