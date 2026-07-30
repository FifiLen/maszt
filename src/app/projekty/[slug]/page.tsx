import BlockRenderer from "@/app/test/components/blockRenderer";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getProjects().map((project) => ({
    slug: project.projectSlug,
  }));
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  // Zostawiamy tylko pierwsze wystąpienie dużej sekcji obrazowej.
  const firstFullImageIndex = project.blocks.findIndex(
    (block) =>
      block.__component === "section.full-image" ||
      block.__component === "section.staggered-images",
  );
  const filteredBlocks = project.blocks.filter(
    (block, index) =>
      (block.__component !== "section.full-image" &&
        block.__component !== "section.staggered-images") ||
      index === firstFullImageIndex,
  );

  return (
    <main className="min-h-screen bg-[#e8e4df] text-[#3ead8f] w-full flex flex-col relative">
      
      {/* Noise Overlay - Global Grain */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* NOWY, WYŚRODKOWANY I ZGRABNY NAGŁÓWEK */}
      <header className="w-full flex justify-center pt-32 lg:pt-40 pb-12 px-6 relative z-10">
        <div className="w-full max-w-5xl flex flex-col items-center text-center border-b border-[#3ead8f]/10 pb-12">
          
          <span className="font-mono text-xs uppercase tracking-widest opacity-60 mb-6">
             Projekt / {project.projectSlug}
          </span>
          
          {/* Usunięto lg:text-[11vw], ustawiono bezpieczne stałe wielkości */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.9] tracking-tighter uppercase w-full">
            {project.projectTitle}
          </h1>
          
        </div>
      </header>

      {/* Kontent z BlockRenderera */}
      <div className="w-full flex flex-col pb-24">
        {filteredBlocks.map((block, index) => (
          <BlockRenderer key={index} block={block} index={index} />
        ))}
      </div>
      
    </main>
  );
}
