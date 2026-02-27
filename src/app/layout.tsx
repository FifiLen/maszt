import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Fundacja Maszt",
  description: "Strona internetowa Fundacji Maszt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${dmSans.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20 text-center space-y-8 flex-grow">
          <div className="bg-neutral-100 p-8 rounded-full mb-4 shadow-[0px_4px_10px_rgba(0,0,0,0.05)] border border-neutral-200">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-emerald-700"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="m9.5 12.5 5 5" />
              <path d="m9.5 17.5 5-5" />
            </svg>
          </div>
          
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 font-sans">
              Strona w budowie
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed max-w-xl mx-auto font-sans">
              Przerwa techniczna. Prowadzimy obecnie prace konserwacyjne, aby nasza strona działała jeszcze lepiej. 
            </p>
            <p className="text-neutral-500 font-medium pt-4 font-sans">
              Wróć do nas już niebawem!
            </p>
          </div>
        </div>

        {/* --- UKRYTE NA CZAS PRAC ---
        <Header />
        <main className="flex-grow flex flex-col relative z-20 bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.5)]">
          {children}
        </main>
        <div className="sticky bottom-0 left-0 w-full z-0 flex flex-col bg-black">
          <Footer />
        </div>
        */}
      </body>
    </html>
  );
}
