import data from '@/lib/data.json';
import Link from 'next/link';

export default function Page() {
  const slugPath = 'partycypacja';
  const pageData = data.find((p) => {
    const pPath = new URL(p.url).pathname.replace(/^\/|\/$/g, '');
    return pPath === slugPath;
  });

  if (!pageData) {
    return <div>404</div>;
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

      {/* Kontent podstrony z JSON */}
      <section className="w-full py-16 px-6 md:px-6 lg:px-6 flex justify-center">
        <article className="w-full max-w-3xl border border-gray-300 bg-white px-6 py-8 md:py-12 shadow-sm min-h-[500px] flex flex-col">
          <div className="mb-8 border-b-2 border-black pb-2 w-fit">
            <h2 className="text-xl font-bold uppercase tracking-widest">[ Zescrapowana Treść Strony: {pageData.tytul} ]</h2>
          </div>
          
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-serif grow border border-dashed border-gray-200 p-6 bg-gray-50 text-sm md:text-base">
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
                      <a href={`/pobrane_pliki/${fileName}`} target="_blank" rel="noreferrer" className="font-bold underline text-sm truncate grow">
                        📄 {fileName}
                      </a>
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
