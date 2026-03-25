import { databases } from "@/lib/appwrite";
import AboutSection from "./test/components/about-section";
import ImageDivider from "./test/components/image-divider";
import ProjectsSection from "./test/components/projects-section";

const page = async () => {
  // --- POBIERANIE DANYCH Z APPWRITE ---
  let projectsMapData: any[] = [];
  try {
    const response = await databases.listDocuments(
      "69c02ef9002fc00e846e", 
      "projects"
    );
    projectsMapData = response.documents.map((doc: any) => {
      const blocks = JSON.parse(doc.contentBlocks || "[]");
      const textBlock = blocks.find((b: any) => b.__component === "section.text-block");
      const imgBlock = blocks.find((b: any) => b.__component === "section.full-image" || b.__component === "section.image-portal");
      
      return {
        slug: doc.projectSlug,
        tytul: doc.projectTitle,
        opis: textBlock ? textBlock.content : "Brak opisu",
        image: imgBlock ? (imgBlock.image?.url || imgBlock.images?.[0]?.url) : "/test-bg.jpg"
      };
    });
  } catch (err) {
    console.error("Błąd pobierania projektów z bazy:", err);
  }

  return (
    <div className="flex flex-col w-full relative">
      
      {/* Sekcja Hero - Nagłówek wycentrowany na dole ekranu */}
      <div className="w-full relative h-screen flex flex-col justify-end items-center px-6 lg:px-10 pb-16 lg:pb-24 overflow-hidden text-center">
         
         {/* Zdjęcie tła z Appwrite */}
         <img 
           src="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c325d60030fa5b980a/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzI1ZGVhZTcxZmYwNDVkYTYiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzI1ZDYwMDMwZmE1Yjk4MGEiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjI0IiwiaWF0IjoxNzc0Mzk2ODk0fQ.aX-rRBj43AhROotvU9by00cEFNGjsbomiVA0hWe4bGA"
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
        <ImageDivider imageUrl="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c2a44a0017a6777604/view?project=69b30650001b6b60508c" altText="Widok na fundację" />
        <AboutSection />
         
      </div>
    </div>
  )
}

export default page;