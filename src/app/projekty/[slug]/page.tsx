import BlockRenderer from "@/app/test/components/blockRenderer";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const response = await databases.listDocuments(
      "69c02ef9002fc00e846e",
      "projects"
    );
    return response.documents.map((doc: any) => ({
      slug: doc.projectSlug,
    }));
  } catch (err) {
    console.error("Błąd podczas generowania ścieżek projektów:", err);
    return [];
  }
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params; 
  
  let projectTitle = "";
  let projectSlug = "";
  let parsedBlocks: any[] = [];
  
  try {
    const response = await databases.listDocuments(
      "69c02ef9002fc00e846e", 
      "projects", 
      [
        Query.equal("projectSlug", resolvedParams.slug)
      ]
    );
    
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      projectTitle = doc.projectTitle;
      projectSlug = doc.projectSlug;
      parsedBlocks = JSON.parse(doc.contentBlocks || "[]");
    }
  } catch (err) {
    console.error("Błąd pobierania danych z bazy dla projektu:", resolvedParams.slug, err);
  }

  if (!projectTitle) {
    notFound();
  }

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
             Projekt / {projectSlug}
          </span>
          
          {/* Usunięto lg:text-[11vw], ustawiono bezpieczne stałe wielkości */}
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.9] tracking-tighter uppercase w-full">
            {projectTitle}
          </h1>
          
        </div>
      </header>

      {/* Kontent z BlockRenderera */}
      <div className="w-full flex flex-col pb-24">
        {parsedBlocks.map((block: any, index: number) => (
          <BlockRenderer key={index} block={block} index={index} />
        ))}
      </div>
      
    </main>
  );
}