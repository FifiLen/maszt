export function Contact() {
  return (
    <section className="w-full bg-white">
      
      {/* Nagłówek wspólny dla wszystkich sekcji - powiększone marginesy dla oddechu */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-24 md:py-32 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none lowercase text-black">
          odezwij <br className="hidden md:block" /> się.
        </h2>
        <p className="max-w-md text-black/60 text-lg leading-relaxed tracking-tight">
          Zawsze szukamy nowych możliwości i ciekawych współprac. Napisz do nas, jeśli chcesz współtworzyć z nami nowe projekty.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 border-y border-black">
        
        {/* =========================================
            LEWA STRONA: INFORMACJE 
            ========================================= */}
        <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-black px-6 md:px-12 lg:px-16 py-12 md:py-16 hover:bg-[#fafafa] transition-colors duration-300 group">
          
          <div className="flex flex-col grow">
            {/* Czysta etykieta bez nawiasów */}
            <span className="font-mono text-sm uppercase tracking-widest text-black/40 group-hover:text-black/60 transition-colors duration-300 mb-12 block">
              dane kontaktowe
            </span>

            <div className="flex flex-col gap-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter lowercase mb-8">
              <a href="mailto:fundacja@maszt.org" className="hover:opacity-60 transition-opacity w-fit flex items-center gap-3">
                fundacja@maszt.org
                <svg className="w-8 h-8 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a href="tel:+48792220095" className="hover:opacity-60 transition-opacity w-fit">
                +48 792 220 095
              </a>
            </div>

            <p className="text-black/70 text-lg leading-relaxed tracking-tight max-w-sm mb-16">
              ul. Energetyków 22 <br />
              44-200 Rybnik
            </p>

            {/* Dane rejestrowe - wyczyszczone z technicznego nalotu */}
            <div className="mt-auto pt-8 border-t border-black/10 flex flex-col gap-6 text-sm tracking-tight text-black/60 uppercase group-hover:border-black/20 transition-colors">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-bold tracking-widest opacity-60">NIP</span>
                  <span className="text-black text-lg font-medium">6423255265</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold tracking-widest opacity-60">KRS</span>
                  <span className="text-black text-lg font-medium">0001118111</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold tracking-widest opacity-60">Numer konta</span>
                <span className="text-black text-xl md:text-2xl font-bold tracking-tighter mt-1 mb-1">
                  32 1870 1045 2078 1083 0313 0001
                </span>
                <span className="text-xs normal-case tracking-normal opacity-80">
                  z dopiskiem „Darowizna na cele statutowe”
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            PRAWA STRONA: FORMULARZ
            ========================================= */}
        <div className="flex flex-col px-6 md:px-12 lg:px-16 py-12 md:py-16 hover:bg-[#fafafa] transition-colors duration-300 group">
          
          <div className="mb-12 flex justify-between items-start">
            <span className="font-mono text-sm uppercase tracking-widest text-black/40 group-hover:text-black/60 transition-colors duration-300">
              formularz
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-black/40">
              otwarte
            </span>
          </div>

          <form className="w-full flex flex-col flex-grow justify-between gap-12">
            
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-2 relative">
                <label className="text-xl md:text-2xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 focus-within:text-black transition-colors">
                  imię i nazwisko <span className="text-sm font-medium normal-case text-black/30 mb-1">(wymagane)</span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-black transition-colors text-2xl font-medium rounded-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xl md:text-2xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 focus-within:text-black transition-colors">
                    e-mail <span className="text-sm font-medium normal-case text-black/30 mb-1">(wymagane)</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-black transition-colors text-2xl font-medium rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xl md:text-2xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 focus-within:text-black transition-colors">
                    telefon
                  </label>
                  <input 
                    type="tel" 
                    className="w-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-black transition-colors text-2xl font-medium rounded-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative grow">
                <label className="text-xl md:text-2xl font-bold tracking-tighter lowercase flex items-end gap-2 text-black/50 focus-within:text-black transition-colors">
                  wiadomość <span className="text-sm font-medium normal-case text-black/30 mb-1">(wymagane)</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  className="w-full h-full bg-transparent border-b-2 border-black/20 py-4 outline-none focus:border-black transition-colors text-2xl font-medium resize-none rounded-none"
                ></textarea>
              </div>
            </div>

            <div className="pt-8 w-full mt-12">
              <button 
                type="submit"
                className="w-full bg-black text-white py-6 md:py-8 text-2xl md:text-3xl font-bold tracking-tighter lowercase hover:bg-black/80 transition-colors duration-300 flex justify-between px-8 items-center group/btn"
              >
                wyślij
                <svg className="w-8 h-8 transform group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}