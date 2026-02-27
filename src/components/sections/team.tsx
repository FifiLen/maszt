import Image from 'next/image';

interface TeamMember {
  autor: string;
  cytat: string;
}

interface TeamProps {
  team: TeamMember[];
}

export function Team({ team }: TeamProps) {
  return (
    // Zostajemy przy czarnym tle dla mocnego odcięcia sekcji
    <section className="w-full pt-24 md:pt-32 bg-black text-white">
      
      {/* Nagłówek - standardowy dla naszej stylistyki */}
      <div className="w-full px-6 md:px-6 lg:px-6 mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none lowercase text-white">
          jesteśmy <br className="hidden md:block" /> dla ciebie.
        </h2>
        <p className="max-w-sm text-white/60 text-[15px] leading-relaxed tracking-tight pb-2">
          Poznaj załogę, która dba o to, abyś mógł bezpiecznie rozwijać swoje żagle.
        </p>
      </div>

      {/* Roster / Indeks Zespołu - układ wierszowy */}
      <div className="w-full flex flex-col border-t border-white/20">
        {team.map((person, idx) => {
          // Wyciągamy imię/nazwisko i rolę
          const [name, role] = person.autor.split(' (');
          const cleanName = name.trim();
          const cleanRole = role ? role.replace(')', '') : 'Wolontariat';

          let avatarUrl = null;
          if (cleanName.toLowerCase().includes('alicja sobik')) {
            avatarUrl = 'https://maszt.org/wp-content/uploads/2024/03/109_dsc_9025-200x300-1-edited-1.jpg';
          } else if (cleanName.toLowerCase().includes('michał naczyński') || cleanName.toLowerCase().includes('michal naczynski')) {
            avatarUrl = 'https://maszt.org/wp-content/uploads/2024/03/222396601_4766093776753335_516607546998201853_n-edited.jpg';
          } else if (cleanName.toLowerCase().includes('magdalena kufka')) {
            avatarUrl = 'https://maszt.org/wp-content/uploads/2024/03/73_dsc_8939-2-1280x855-1-edited.jpg';
          }

          return (
            <div 
              key={idx} 
              // Każdy wiersz rozciąga się na 100% i na hoverze zamienia się w biały blok
              className="group w-full flex flex-col lg:flex-row border-b border-white/20 hover:bg-white hover:text-black transition-colors duration-500"
            >
              
              {/* LEWA STRONA: Numer, Avatar, Imię, Rola */}
              {/* Na desktopie zajmuje 4/12 szerokości i ma oddzielającą ramkę z prawej strony */}
              <div className="w-full lg:w-4/12 px-6 py-10 md:py-12 lg:py-16 flex items-start gap-6 lg:gap-8 border-b lg:border-b-0 lg:border-r border-white/20 group-hover:border-black/10 transition-colors duration-500">
                
              

                <div className="flex flex-col">
                  {/* Kompaktowy avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 mb-8 relative grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10 group-hover:border-black/10">
                    {avatarUrl ? (
                      <Image src={avatarUrl} fill alt={cleanName} className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/30 group-hover:text-black/30 lowercase tracking-tighter transition-colors duration-500">
                        foto
                      </div>
                    )}
                  </div>
                  
                  {/* Imię i rola */}
                  <h3 className="text-3xl font-bold tracking-tighter lowercase text-white group-hover:text-black transition-colors duration-500">
                    {name}
                  </h3>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-black/40 mt-3 transition-colors duration-500">
                    {cleanRole}
                  </span>
                </div>
              </div>

              {/* PRAWA STRONA: Wielki Cytat */}
              {/* Na desktopie zajmuje 8/12 szerokości */}
              <div className="w-full lg:w-8/12 px-6 py-12 md:py-12 lg:py-16 flex items-center">
                <p className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-[1.3] text-white/90 group-hover:text-black/90 transition-colors duration-500 max-w-4xl relative">
                  {/* Ozdobny "otwierający" cudzysłów w tle dla smaczku */}
                  <span className="absolute -left-6 -top-6 text-[4rem] text-white/10 group-hover:text-black/5 font-serif leading-none select-none transition-colors duration-500">
                    "
                  </span>
                  {person.cytat.replace(/“|”|"/g, '')}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}