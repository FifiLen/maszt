import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#8c4693] text-[#e8e4df] flex flex-col relative z-10 pt-16 lg:pt-24">
      <div className="max-w-8xl mx-auto w-full px-6 lg:px-10">
        
        {/* Górna część - Główne przesłanie */}
        <div className="pb-12 md:pb-20 border-b border-[#e8e4df]/20">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] tracking-tight max-w-4xl">
            Chcemy sprawić, aby każdy człowiek doświadczył tego, że jest wartością. Odnajdź miejsce dla siebie w naszych działaniach.
          </h2>
        </div>

        {/* Środkowa część - Informacje w 3 kolumnach */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 md:py-16">
          
          {/* Kolumna 1: Kontakt */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-6">Kontakt</h3>
            <div className="font-sans text-base lg:text-lg flex flex-col space-y-2 opacity-90">
              <p>ul. Energetyków 22</p>
              <p>44-200 Rybnik</p>
              <div className="h-4"></div>
              <a href="tel:+48792220095" className="hover:text-white transition-colors duration-300 w-fit">
                +48 792 220 095
              </a>
              <a href="mailto:fundacja@maszt.org" className="hover:text-white transition-colors duration-300 w-fit">
                fundacja@maszt.org
              </a>
            </div>
          </div>

          {/* Kolumna 2: Dane rejestrowe */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-6">Fundacja Maszt</h3>
            <div className="font-sans text-base lg:text-lg flex flex-col space-y-2 opacity-90">
              <p>NIP: 6423255265</p>
              <p>REGON: 529416225</p>
              <p>KRS: 0001118111</p>
            </div>
          </div>

          {/* Kolumna 3: Darowizny */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-6">Wesprzyj nas</h3>
            <div className="font-sans text-base lg:text-lg flex flex-col space-y-2 opacity-90">
              <p className="text-sm opacity-70">Numer konta:</p>
              <p className="font-mono tracking-tight md:tracking-wider break-all xl:break-normal">
                32 1870 1045 2078 1083 0313 0001
              </p>
              <div className="h-2"></div>
              <p className="text-sm opacity-70">Tytuł przelewu:</p>
              <p>Darowizna na cele statutowe</p>
            </div>
          </div>

        </div>

        {/* =========================================================
        UKRYTA SEKCJA DOKUMENTÓW (ZAKOMENTOWANA PÓKI CO)
        =========================================================
        <div className="py-10 border-t border-[#e8e4df]/20 flex flex-col space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Dokumenty i Prawo</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <a target="_blank" rel="noopener noreferrer" href="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31c1100299ec86a35/view?project=69b30650001b6b60508c" className="hover:text-white transition-colors underline underline-offset-4 opacity-80 hover:opacity-100">Statut Fundacji</a>
            <a target="_blank" rel="noopener noreferrer" href="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31d36002ab0c39092/view?project=69b30650001b6b60508c" className="hover:text-white transition-colors underline underline-offset-4 opacity-80 hover:opacity-100">Sprawozdanie 2024</a>
            <a target="_blank" rel="noopener noreferrer" href="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31e3d0019550634ef/view?project=69b30650001b6b60508c" className="hover:text-white transition-colors underline underline-offset-4 opacity-80 hover:opacity-100">Rozliczenie 2024</a>
            <a target="_blank" rel="noopener noreferrer" href="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31e0c002d99c72101/view?project=69b30650001b6b60508c" className="hover:text-white transition-colors underline underline-offset-4 opacity-80 hover:opacity-100">Polityka ochrony dzieci</a>
            <a target="_blank" rel="noopener noreferrer" href="https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31c670013f56a48be/view?project=69b30650001b6b60508c" className="hover:text-white transition-colors underline underline-offset-4 opacity-80 hover:opacity-100">RODO</a>
          </div>
        </div> 
        */}

      </div>

      {/* Dolny pasek (Copyright) */}
      <div className="w-full bg-[#7a3e82] px-6 lg:px-10 py-6 mt-auto">
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-80">
          <span className="mb-2 sm:mb-0">&copy; {currentYear} Fundacja Maszt</span>
          <span>Rybnik, Polska</span>
        </div>
      </div>
    </footer>
  );
}