import Link from 'next/link';
import Image from 'next/image';

interface Project {
  title: string;
  description: string;
  image?: string;
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  // Paleta zapożyczona z /projekty/page.tsx dla idealnej zgodności layoutów!
  const hoverColors = [
    'hover:bg-[#8c4693]', 
    'hover:bg-[#1c3028]', 
    'hover:bg-[#3ead8f]'  
  ];

  return (
    <section className="w-full bg-white flex flex-col">
      
      {/* Nagłówek - utrzymujemy brutalistyczne marginesy */}
      <div className="w-full px-6 py-24 md:py-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none lowercase text-black">
          wybrane <br className="hidden md:block" /> projekty.
        </h2>
        
        {/* Przycisk do wszystkich projektów */}
        <Link 
          href="/projekty" 
          className="group inline-flex items-center gap-2 text-black font-semibold tracking-tighter lowercase border-b border-black pb-1 hover:text-black/60 hover:border-black/60 transition-colors"
        >
          wszystkie projekty
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Siatka Projektów - IDENTYCZNA z katalogiem w /projekty/page.tsx */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 border-y border-black bg-white">
        {projects.map((proj, idx) => {
          const hoverClass = hoverColors[idx % hoverColors.length];

          // Dopasowany styling pierwszego tagu analogicznie do /projekty/page.tsx
          const tagProps = idx === 1 
            ? "border-[#2ed8a4] text-[#2ed8a4] group-hover:border-white group-hover:text-white" 
            : "border-black group-hover:border-white text-black group-hover:text-white";

          return (
            <Link
              key={idx}
              href="/projekty"
              className={`relative group flex flex-col border-b lg:border-b-0 lg:border-r border-black last:border-b-0 lg:last:border-r-0 ${hoverClass} hover:text-white transition-colors duration-500 cursor-pointer min-h-[400px] bg-white`}
            >
              
              {/* Opcjonalne Zdjęcie w tle na hover - lekka widoczność żeby nie psuć brutalistycznego układu */}
              {proj.image && (
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none mix-blend-multiply grayscale">
                  <Image 
                    src={proj.image} 
                    fill 
                    alt={proj.title} 
                    className="object-cover"
                  />
                </div>
              )}

              <div className="relative z-10 px-6 py-8 md:py-12 flex justify-between items-start border-b border-black/10 group-hover:border-white/20 transition-colors">
                <span className="font-mono text-sm text-black/40 group-hover:text-white/40 transition-colors">
                  /0{idx + 1}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest border px-3 py-1 transition-colors ${tagProps}`}>
                  Realizacja
                </span>
              </div>
              
              <div className="relative z-10 px-6 py-8 md:py-12 grow flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-white/60 mb-4 block transition-colors">
                  Inicjatywa
                </span>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter lowercase leading-[0.9] mb-6">
                  {proj.title}
                </h3>
                <p className="text-[15px] font-light tracking-tight leading-relaxed opacity-80 line-clamp-4">
                  {proj.description}
                </p>
              </div>

            </Link>
          );
        })}
      </div>
      
    </section>
  );
}