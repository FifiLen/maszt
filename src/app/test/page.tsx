import ProjectsSection from './components/projects-section'
import AboutSection from './components/about-section'
import { getProjects } from '@/lib/projects'
import ImageDivider from './components/image-divider'

const page = () => {
  const projectsMapData = getProjects().map((project) => {
    const textBlock = project.blocks.find(
      (block) => block.__component === "section.text-block",
    );

    return {
      slug: project.projectSlug,
      tytul: project.projectTitle,
      opis:
        typeof textBlock?.content === "string"
          ? textBlock.content
          : "Brak opisu",
    };
  });

  return (
    <div className="flex flex-col w-full relative">
      
      {/* Sekcja Hero - Nagłówek wycentrowany na dole ekranu */}
      <div className="w-full relative h-screen flex flex-col justify-end items-center px-6 lg:px-10 pb-16 lg:pb-24 overflow-hidden text-center">
         
         {/* Lokalne zdjęcie tła, publikowane przez CDN Vercela. */}
         <img 
           src="/media/images/69c325d60030fa5b980a-amine-hoov-uiz1w4sehd8-unsplash.jpg"
           alt="Tło Fundacji Maszt"
           className="absolute inset-0 w-full h-full object-cover z-0"
         />

         {/* Przyciemnienie zdjęcia (overlay) */}
         <div className="absolute inset-0 bg-black/40 z-[1]" />
         
         {/* Nagłówek dociśnięty do dołu dzięki "justify-end" na rodzicu */}
         <h1 className="font-heading font-medium tracking-tighter leading-none text-[#3ead8f] text-[10vw] sm:text-6xl md:text-7xl lg:text-[7vw] z-20 relative drop-shadow-lg">
            By ludzie doświadczali<br />bycia wartością
         </h1>
      </div>

      {/* Kontent strony */}
      <div className="z-20 relative bg-[#e8e4df]">
       
        <ProjectsSection projectsData={projectsMapData} /> 
        <ImageDivider imageUrl="/media/images/69c2a44a0017a6777604-fundacja-bg.jpg" altText="Widok na fundację" />
        <AboutSection />
         
      </div>
    </div>
  )
}

export default page;
