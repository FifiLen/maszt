import data from '@/lib/data.json';
import Link from 'next/link';

export async function generateStaticParams() {
  // Generujemy ścieżki dla WSZYSTKICH podstron (oprócz strony głównej url === baseUrl)
  return data
    .filter(page => {
      const urlObj = new URL(page.url);
      const path = urlObj.pathname.replace(/^\/|\/$/g, '');
      return path.length > 0; // Pomijamy główną (/)
    })
    .map((page) => {
      const urlObj = new URL(page.url);
      const path = urlObj.pathname.replace(/^\/|\/$/g, '');
      
      return {
        slug: path ? path.split('/') : [],
      };
    });
}

export default async function InnerPage({ params }: { params: Promise<{ slug: string[] }> }) {
  // Oczekujemy na parametry w Next 15+
  const resolvedParams = await params;
  
  // Szukamy odpowiedniej podstrony z JSON-a
  const slugPath = resolvedParams.slug.join('/');
  
  // Dokładne dopasowanie URL z JSON-a
  const pageData = data.find((p) => {
    const pUrlObj = new URL(p.url);
    const pPath = pUrlObj.pathname.replace(/^\/|\/$/g, '');
    return pPath === slugPath;
  });

  if (!pageData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4 border-2 border-dashed border-gray-400 p-4">404 - Nie znaleziono</h1>
        <p className="text-gray-600 mb-8 border border-dashed border-gray-300 p-4 max-w-lg">
          [ Niestety nie znaleziono takiej podstrony w naszych zescrapowanych danych ]
        </p>
        <Link href="/" className="border-2 border-black bg-gray-200 px-6 py-2 font-bold uppercase tracking-wider text-sm hover:bg-gray-300">
          Wróć na stronę główną
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full text-black">
      
      {/* Header podstrony */}
      <section className="w-full border-b py-16 flex flex-col items-center justify-center text-center bg-gray-100 px-6 md:px-6 lg:px-6">
        <div className="w-full max-w-4xl space-y-4">
          <div className="mx-auto w-fit border border-dashed border-gray-400 px-3 py-1 text-xs text-gray-500 uppercase font-mono">
            [ Ścieżka: /{slugPath} ]
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold border border-dashed border-gray-400 p-4 bg-white uppercase tracking-wider">
            {pageData.tytul}
          </h1>
        </div>
      </section>

      {/* Kontent podstrony */}
      <section className="w-full py-16 px-6 md:px-6 lg:px-6 flex justify-center">
        <article className="w-full max-w-3xl border border-gray-300 bg-white px-6 py-8 md:py-12 shadow-sm min-h-[500px] flex flex-col">
          <div className="mb-8 border-b-2 border-black pb-2 w-fit">
            <h2 className="text-xl font-bold uppercase tracking-widest">[ Zescrapowana Treść ]</h2>
          </div>
          
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-serif flex-grow border border-dashed border-gray-200 p-6 bg-gray-50 text-sm md:text-base">
            {pageData.tresc}
          </div>
          
          {/* Wyświetlanie linków do pobranych plików */}
          {pageData.pliki && pageData.pliki.length > 0 && (
            <div className="mt-12 p-6 border-2 border-dashed border-gray-400 bg-gray-50">
              <h3 className="font-bold uppercase tracking-wider mb-4 text-sm">[ Załączniki z tej strony ]</h3>
              <ul className="space-y-3">
                {pageData.pliki.map((plik, i) => {
                  const fileName = plik.url.split('/').pop();
                  return (
                    <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 border border-gray-300 p-3 bg-white">
                      <a href={`/pobrane_pliki/${fileName}`} target="_blank" rel="noreferrer" className="font-bold underline text-sm truncate flex-grow">
                        📄 {fileName}
                      </a>
                      <span className="text-xs font-mono text-gray-400 truncate max-w-xs block">
                        ({plik.url})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
