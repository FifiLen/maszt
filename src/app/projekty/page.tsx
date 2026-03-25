import React from 'react';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';

export const revalidate = 60; // Opcjonalnie: odświeżanie cache'u co 60 sekund

export default async function ProjektyPage() {
  // --- POBIERANIE DANYCH Z APPWRITE ---
  let projectsData: any[] = [];
  try {
    const response = await databases.listDocuments(
      "69c02ef9002fc00e846e", 
      "projects"
    );
    projectsData = response.documents.map((doc: any) => {
      const blocks = JSON.parse(doc.contentBlocks || "[]");
      const textBlock = blocks.find((b: any) => b.__component === "section.text-block");
      
      return {
        slug: doc.projectSlug,
        tytul: doc.projectTitle,
        // Proste usuwanie znaków "**" z opisu, żeby na zwykłej liście wyświetlił się czysty tekst
        opis: textBlock ? textBlock.content.replace(/\*\*/g, '') : "Brak opisu",
      };
    });
  } catch (err) {
    console.error("Błąd pobierania projektów z bazy:", err);
  }

  return (
    <main className="min-h-screen bg-[#e8e4df] text-[#3ead8f] pt-32 lg:pt-48 px-6 lg:px-10 pb-24">
      <div className="max-w-8xl mx-auto w-full">
        
        {/* Nagłówek strony */}
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium leading-none tracking-tighter mb-16 lg:mb-24">
          Wszystkie Projekty
        </h1>

        {/* Lista projektów */}
        <div className="flex flex-col border-t border-[#3ead8f]/20">
          {projectsData.map((project, index) => (
            <Link 
              key={project.slug} 
              href={`/projekty/${project.slug}`}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-8 md:py-12 border-b border-[#3ead8f]/20 hover:bg-[#3ead8f]/[0.03] transition-colors duration-300"
            >
              {/* Numeracja */}
              <div className="md:col-span-1 font-mono text-sm opacity-50 pt-1 md:pt-2">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              {/* Tytuł */}
              <div className="md:col-span-5">
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter leading-[1.05] group-hover:opacity-70 transition-opacity">
                  {project.tytul}
                </h2>
              </div>
              
              {/* Opis i przycisk */}
              <div className="md:col-span-6 flex flex-col justify-between items-start md:items-end mt-4 md:mt-0">
                <p className="font-sans text-base md:text-lg opacity-80 line-clamp-3 md:text-right max-w-xl">
                  {project.opis}
                </p>
                <span className="mt-6 inline-block px-5 py-2.5 rounded-full border border-current font-sans text-sm md:text-base font-medium transition-all group-hover:bg-[#3ead8f] group-hover:text-[#e8e4df]">
                  Zobacz szczegóły
                </span>
              </div>
            </Link>
          ))}

          {/* Stan pusty (gdyby nie było projektów w bazie) */}
          {projectsData.length === 0 && (
            <div className="py-20 text-center opacity-70 font-sans text-lg">
              Brak projektów do wyświetlenia.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}