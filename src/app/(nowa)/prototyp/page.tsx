import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { Contact, Documents, Projects, Team } from "@/components/home/sections";
import { Makieta } from "@/components/makieta/journey";

export const metadata: Metadata = {
  title: "Fundacja Maszt – makieta",
  robots: { index: false, follow: false },
};

// Rytm strony: hero (z misją) → skąd się wzięliśmy → makieta → projekty → zarząd → dokumenty → kontakt.
// Jak u Hut 8 kolejne sekcje wjeżdżają na poprzednie: hero jest sticky, „Skąd się wzięliśmy” na nie najeżdża
// (timeline-scope pozwala hero animować się w takt tej sekcji), a makieta z ujemnym marginesem przykrywa
// przypięty ostatni ekran fioletowej sekcji. Tak samo zielone projekty wjeżdżają na przypięty finał makiety
// (makieta zostawia na to ostatnie 100svh), a makieta pod nimi ciemnieje.
export default function PrototypePage() {
  return (
    <>
      <div className="[timeline-scope:--intro]">
        <Hero />
        <Intro />
      </div>
      <div className="[timeline-scope:--projekty]">
        <Makieta
          id="makieta"
          className="z-20 -mt-[100svh] overflow-clip rounded-t-[2rem] bg-maszt-sand shadow-[0_-30px_60px_-20px_rgb(0_0_0/0.3)] lg:rounded-t-[2.5rem]"
        />
        <Projects className="z-30 -mt-[100svh]" />
      </div>
      <Team />
      <Documents />
      <Contact />
    </>
  );
}
