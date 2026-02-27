import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Głęboka czerń, biały tekst. selection odwraca kolory przy zaznaczaniu tekstu.
    <footer className="w-full bg-black text-white px-6 md:px-6 lg:px-6 pt-24 md:pt-32 pb-8 flex flex-col selection:bg-white selection:text-black">
      
      {/* --- GÓRNA CZĘŚĆ: GRID INFORMACYJNY --- */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24 lg:mb-32">
        
        {/* Kolumna 1: Misja */}
        <div className="flex flex-col">
          <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-8">
            [ o nas ]
          </h3>
          <p className="text-white/80 text-[15px] leading-relaxed tracking-tight max-w-sm">
            Budujemy infrastrukturę społeczną, by ludzie doświadczali bycia wartością. Dajemy wiatr w żagle tym, którzy chcą działać.
          </p>
        </div>

        {/* Kolumna 2: Nawigacja */}
        <div className="flex flex-col">
          <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-8">
            [ nawigacja ]
          </h3>
          <ul className="flex flex-col gap-4 text-xl md:text-2xl font-bold tracking-tighter lowercase">
            <li>
              <Link href="/o-nas" className="hover:text-white/50 transition-colors duration-300">o nas</Link>
            </li>
            <li>
              <Link href="/dzialania" className="hover:text-white/50 transition-colors duration-300">działania</Link>
            </li>
            <li>
              <Link href="/oferta" className="hover:text-white/50 transition-colors duration-300">oferta</Link>
            </li>
            <li>
              <Link href="/projekty" className="hover:text-white/50 transition-colors duration-300">projekty</Link>
            </li>
          </ul>
        </div>

        {/* Kolumna 3: Działania / Projekty */}
        <div className="flex flex-col">
          <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-8">
            [ inicjatywy ]
          </h3>
          <ul className="flex flex-col gap-4 text-xl md:text-2xl font-bold tracking-tighter lowercase">
            <li>
              <Link href="/parasol" className="hover:text-white/50 transition-colors duration-300">parasol</Link>
            </li>
            <li>
              <Link href="/partycypacja" className="hover:text-white/50 transition-colors duration-300">partycypacja</Link>
            </li>
            <li>
              <Link href="/partnerstwa" className="hover:text-white/50 transition-colors duration-300">partnerstwa</Link>
            </li>
            <li>
              <Link href="/wolontariat" className="hover:text-white/50 transition-colors duration-300">wolontariat</Link>
            </li>
          </ul>
        </div>

        {/* Kolumna 4: Kontakt */}
        <div className="flex flex-col">
          <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-8">
            [ kontakt ]
          </h3>
          <div className="flex flex-col gap-6 text-[15px] tracking-tight text-white/80">
            {/* Klikalny, duży email z efektem */}
            <a 
              href="mailto:kontakt@maszt.org" 
              className="group inline-flex items-center gap-2 text-xl font-bold tracking-tighter text-white hover:text-white/70 transition-colors"
            >
              kontakt@maszt.org
              <svg className="w-5 h-5 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            <p className="leading-relaxed">
              Fundacja Maszt<br />
              ul. Przykładowa 12/3<br />
              44-200 Rybnik
            </p>
            
            <a href="tel:+48000000000" className="hover:text-white transition-colors">
              +48 000 000 000
            </a>
          </div>
        </div>

      </div>

      {/* --- ŚRODEK: GIGANTYCZNE LOGO --- */}
      {/* text-[13vw] sprawia, że tekst jest responsywny względem szerokości ekranu i zawsze wypełnia go od lewej do prawej */}
      <div className="w-full border-t border-white/20 pt-8 md:pt-16 pb-8 md:pb-12 flex items-center justify-center overflow-hidden">
        <h2 className="text-[14vw] font-bold tracking-tighter leading-[0.75] lowercase text-white text-center select-none">
          fundacja maszt.
        </h2>
      </div>

      {/* --- DÓŁ: COPYRIGHT I SOCIALE --- */}
      <div className="w-full border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs font-mono lowercase tracking-widest">
        <p>
          &copy; {currentYear} fundacja maszt. wszelkie prawa zastrzeżone.
        </p>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors duration-300">facebook</a>
          <a href="#" className="hover:text-white transition-colors duration-300">instagram</a>
          <a href="#" className="hover:text-white transition-colors duration-300">linkedin</a>
        </div>
      </div>

    </footer>
  );
}