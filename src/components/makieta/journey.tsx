"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { STOPS, clamp01, journey, stopWeight } from "./journey-state";
import "./makieta.css";

const MakietaScene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <p className="animate-pulse font-mono text-xs uppercase tracking-widest text-maszt-deep">Rozkładamy makietę…</p>
    </div>
  ),
});

type ProjectLink = { slug: string; name: string; meta: string };
type Panel = {
  kicker: string;
  title: string;
  text: string;
  /** Liczba, która mówi najwięcej o projekcie (karta na desktopie). */
  stat: { value: string; label: string };
  image: { src: string; alt: string };
  project: ProjectLink;
  also?: ProjectLink;
};

// UWAGA: zdjęcia są poglądowe (w tym dwa wygenerowane przez AI) – do podmiany na zdjęcia z projektów.
const PHOTOS = {
  crew: "/media/images/6a05668000247bc08a56-chatgpt-image-14-maj-2026-08-06-33.png",
  table: "/media/images/6a05643b00212f209d8d-chatgpt-image-14-maj-2026-07-56-34.png",
  friends: "/hero-bg-ludzie.jpg",
  change: "/hero-bg.jpg",
};

// Każdy przystanek opowiada o konkretnym projekcie, który pokazuje scena na makiecie.
const PANELS: Record<string, Panel> = {
  energia: {
    kicker: "01 · Skąd nazwa",
    title: "Energia, która płynie dalej",
    text: "Od Elektrowni Rybnik maszty wysokiego napięcia przesyłają energię całemu miastu. My budujemy sieć dla energii ludzi – w „Załodze na pokład” młodzi wolontariusze współtworzą fundację.",
    stat: { value: "56 328 zł", label: "dotacji NIW na rozwój wolontariatu młodzieży" },
    image: { src: PHOTOS.crew, alt: "Młodzi wolontariusze planują działania na pokładzie żaglówki" },
    project: { slug: "zaloga-na-poklad", name: "Załoga na pokład", meta: "wolontariat długoterminowy · 2025" },
  },
  glos: {
    kicker: "02 · Sprawczość",
    title: "Głos młodych się liczy",
    text: "Większość uczniów widzi udział w życiu szkoły jako stratę czasu albo fikcję. Dlatego uczniowie, nauczyciele, dyrektorzy i aktywiści usiedli przy jednym stole i wypracowali konkretne propozycje zmian.",
    stat: { value: "26,5%", label: "rybnickich uczniów czuje się zaangażowanych w decyzje szkolne" },
    image: { src: PHOTOS.table, alt: "Uczniowie i dorośli rozmawiają przy wspólnym stole" },
    project: { slug: "godomy-o-edukacji", name: "Godomy o edukacji", meta: "debata world cafe · 2024" },
    also: { slug: "mas-zt", name: "MAS-ZT", meta: "samorządy uczniowskie 5 szkół" },
  },
  wspolnota: {
    kicker: "03 · Wspólnota",
    title: "Patrz, słuchaj, łącz",
    text: "Młodzież uczy się rozpoznawać stres u siebie i innych oraz wspierać rówieśników w trudnych chwilach – według modelu UNICEF i WHO.",
    stat: { value: "15–19", label: "lat – wiek uczestników, udział w 100% bezpłatny" },
    image: { src: PHOTOS.friends, alt: "Grupa nastolatków rozmawia, siedząc na schodach" },
    project: { slug: "pierwsza-pomoc-przedpsychologiczna", name: "Pierwsza Pomoc przedPsychologiczna", meta: "zdrowie psychiczne · 2025" },
    also: { slug: "biegne-dla-zdrowej-glowy", name: "Biegnę dla zdrowej głowy", meta: "20 młodzieżowych wolontariuszy" },
  },
  zagle: {
    kicker: "04 · Samostanowienie",
    title: "Pod naszymi żaglami",
    text: "Czwórka rybnickich 14-latków przyszła do nas sama z pytaniem, czy pomożemy im zrobić coś dobrego. Wymyślili walentynki z quizem, które kierowały do adopcji zwierząt ze schroniska.",
    stat: { value: "4 379 zł", label: "zebrane dla rybnickiego schroniska" },
    image: { src: PHOTOS.change, alt: "Mural z napisem o zmianie, która nie przychodzi przypadkiem" },
    project: { slug: "milosc-na-cztery-lapy", name: "Miłość na cztery łapy", meta: "pomysł ósmoklasistów · 2025" },
  },
};

const noopSubscribe = () => () => {};
// Telefon i tablet: mniejsza mapa cieni i niższa rozdzielczość renderu.
const detectQuality = () =>
  !window.matchMedia("(pointer: coarse)").matches && window.innerWidth >= 900 ? ("high" as const) : ("low" as const);

export function Makieta() {
  const root = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const railItems = useRef<(HTMLButtonElement | null)[]>([]);
  const hint = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  // Na serwerze nie renderujemy sceny (null); w przeglądarce wybieramy jakość raz, przy montowaniu.
  const quality = useSyncExternalStore(noopSubscribe, detectQuality, () => null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "100px" });
    if (root.current) observer.observe(root.current);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const lastWeights: number[] = [];
    let lastProgress = -1;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const el = root.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        journey.target = clamp01(-rect.top / (rect.height - window.innerHeight));
      }
      // Bezwładność kamery: przewijanie „ciągnie” makietę z lekkim opóźnieniem.
      const ease = 1 - Math.exp(-dt * (reduced ? 30 : 4));
      journey.progress += (journey.target - journey.progress) * ease;
      const p = journey.progress;

      STOPS.forEach((stop, i) => {
        // Zaokrąglamy wagę i piszemy do DOM tylko przy zmianie – bez zbędnych przeliczeń stylów.
        const w = Math.round(stopWeight(stop, p, i === 0 ? 0.04 : 0.03) * 500) / 500;
        const panel = panels.current[i];
        if (panel && lastWeights[i] !== w) {
          lastWeights[i] = w;
          panel.style.setProperty("--w", String(w));
          panel.style.visibility = w < 0.01 ? "hidden" : "visible";
          panel.style.pointerEvents = w > 0.5 ? "auto" : "none";
        }
        const on = w > 0.5 || (p >= stop.window[0] && p < (STOPS[i + 1]?.window[0] ?? 2));
        const item = railItems.current[i];
        if (item && item.hasAttribute("data-active") !== on) item.toggleAttribute("data-active", on);
      });
      const rounded = Math.round(p * 2000) / 2000;
      if (rounded !== lastProgress) {
        lastProgress = rounded;
        if (hint.current) hint.current.style.opacity = String(1 - clamp01(rounded / 0.03));
        if (bar.current) bar.current.style.transform = `scaleY(${rounded})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = root.current;
    if (!el) return;
    const [a, b] = STOPS[i].window;
    const p = i === 0 ? 0 : Math.min(1, (a + b) / 2);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section ref={root} className="relative h-[1100svh]" aria-label="Makieta: misja Fundacji Maszt">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div className="absolute inset-0">{quality && <MakietaScene active={active} quality={quality} />}</div>

        {/* Podkład pod tekst: na telefonie pas na dole, na desktopie miękka plama w lewym dolnym rogu. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-maszt-sand via-maszt-sand/85 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_48%_60%_at_8%_88%,var(--color-maszt-sand)_30%,transparent_100%)] opacity-90 md:block" />

        {/* Start */}
        <div
          ref={(el) => {
            panels.current[0] = el;
          }}
          className="mk-panel absolute inset-x-4 bottom-10 sm:inset-x-6 md:bottom-16 md:left-10 md:right-auto md:max-w-2xl"
          style={{ "--w": 1 } as CSSProperties}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-maszt-deep">Fundacja Maszt · Rybnik</p>
          <h1 className="mt-5 font-heading text-[clamp(2.75rem,6.4vw,6.5rem)] font-medium leading-[0.92] tracking-tighter text-maszt-ink">
            By ludzie doświadczali bycia wartością
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-maszt-ink/75">
            Budujemy infrastrukturę społeczną. Przejdź z nami przez makietę i zobacz, jak to działa.
          </p>
        </div>

        {/* Przystanki: na telefonie tekst na dole ekranu, na desktopie karta na całą wysokość ze zdjęciem. */}
        {STOPS.slice(1, -1).map((stop, i) => {
          const panel = PANELS[stop.id];
          return (
            <article
              key={stop.id}
              ref={(el) => {
                panels.current[i + 1] = el;
              }}
              className="mk-panel mk-card invisible absolute inset-x-4 bottom-10 sm:inset-x-6 md:inset-x-auto md:bottom-6 md:left-6 md:top-32 md:flex md:w-[min(36vw,520px)] md:flex-col md:rounded-[28px] md:bg-maszt-sand/95 md:p-3 md:shadow-[0_40px_90px_-40px_rgba(18,57,47,0.45)] md:ring-1 md:ring-maszt-ink/10"
            >
              <div className="mk-card__photo relative hidden min-h-[120px] flex-1 overflow-hidden rounded-[20px] bg-maszt-ink/10 md:block">
                <Image src={panel.image.src} alt={panel.image.alt} fill sizes="520px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-maszt-ink/45 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 rounded-full bg-maszt-sand/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-maszt-ink">
                  {panel.kicker}
                </span>
                <span className="absolute bottom-3 right-5 font-heading text-7xl font-medium leading-none tracking-tighter text-maszt-sand/90">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col md:px-5 md:pb-3 md:pt-6">
                <span className="block h-px w-12 bg-maszt-ink/40 md:hidden" aria-hidden="true" />
                <p className="mk-stagger mt-5 font-mono text-xs uppercase tracking-widest text-maszt-deep md:hidden">{panel.kicker}</p>
                <h2
                  className="mk-stagger mt-3 font-heading text-4xl font-medium leading-[0.98] tracking-tighter text-maszt-ink md:mt-0 lg:text-[2.75rem]"
                  style={{ "--d": 0.1 } as CSSProperties}
                >
                  {panel.title}
                </h2>
                <p
                  className="mk-stagger mt-4 text-base leading-relaxed text-maszt-ink/75"
                  style={{ "--d": 0.2 } as CSSProperties}
                >
                  {panel.text}
                </p>
                <div
                  className="mk-stagger mk-card__stat mt-5 hidden items-baseline gap-4 border-t border-maszt-ink/10 pt-4 md:flex"
                  style={{ "--d": 0.3 } as CSSProperties}
                >
                  <span className="shrink-0 font-heading text-4xl font-medium tracking-tighter text-maszt-deep">{panel.stat.value}</span>
                  <span className="text-sm leading-snug text-maszt-ink/70">{panel.stat.label}</span>
                </div>
                <Link
                  href={`/projekty/${panel.project.slug}`}
                  className="mk-stagger group mt-6 flex items-center gap-4 rounded-2xl border border-maszt-ink/15 bg-maszt-sand/85 p-4 transition-colors hover:border-maszt-deep hover:bg-white/70 md:mt-5 md:border-transparent md:bg-maszt-ink md:hover:border-transparent md:hover:bg-maszt-deep"
                  style={{ "--d": 0.4 } as CSSProperties}
                >
                  <span className="size-2.5 shrink-0 rounded-full bg-maszt-green shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-maszt-green)_20%,transparent)]" aria-hidden="true" />
                  <span className="flex min-w-0 grow flex-col">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-maszt-deep md:text-maszt-green">
                      Projekt · {panel.project.meta}
                    </span>
                    <span className="mt-1 font-heading text-lg font-medium leading-tight tracking-tight text-maszt-ink md:text-xl md:text-maszt-sand">
                      {panel.project.name}
                    </span>
                  </span>
                  <span className="text-xl text-maszt-ink transition-transform group-hover:translate-x-1 md:text-maszt-sand" aria-hidden="true">
                    →
                  </span>
                </Link>
                {panel.also && (
                  <p className="mk-stagger mk-card__also mt-3 text-sm text-maszt-ink/70" style={{ "--d": 0.5 } as CSSProperties}>
                    Zobacz też:{" "}
                    <Link
                      href={`/projekty/${panel.also.slug}`}
                      className="font-medium text-maszt-ink underline decoration-maszt-ink/30 underline-offset-4 hover:decoration-maszt-ink"
                    >
                      {panel.also.name}
                    </Link>{" "}
                    <span className="text-maszt-ink/50">– {panel.also.meta}</span>
                  </p>
                )}
              </div>
            </article>
          );
        })}

        {/* Finał: wejdź z nami na maszt */}
        <div
          ref={(el) => {
            panels.current[STOPS.length - 1] = el;
          }}
          className="mk-panel invisible absolute inset-x-4 bottom-10 sm:inset-x-6 md:bottom-auto md:left-10 md:right-auto md:top-1/2 md:max-w-xl md:-translate-y-1/2"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-maszt-deep">05 · Maszt</p>
          <h2 className="mt-4 font-heading text-[clamp(2.75rem,5.6vw,5.75rem)] font-medium leading-[0.92] tracking-tighter text-maszt-ink">
            Wejdź z nami na <span className="text-maszt-deep">MASZT</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-maszt-ink/75">
            Samostanowienie, sprawczość i wspólnota pozwalają doświadczać bycia wartościowym człowiekiem.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projekty"
              className="rounded-full bg-maszt-ink px-6 py-3.5 font-medium text-maszt-sand transition-colors hover:bg-maszt-deep"
            >
              Poznaj projekty
            </Link>
            <a
              href="mailto:fundacja@maszt.org?subject=Chc%C4%99%20do%C5%82%C4%85czy%C4%87%20do%20MASZTU"
              className="rounded-full border border-maszt-ink px-6 py-3.5 font-medium text-maszt-ink transition-colors hover:bg-maszt-ink hover:text-maszt-sand"
            >
              Dołącz do MASZTU
            </a>
          </div>
        </div>

        {/* Nawigacja przystankami */}
        <nav className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block lg:right-10" aria-label="Przystanki makiety">
          <div className="relative flex flex-col gap-5 rounded-2xl bg-maszt-sand/90 py-4 pl-8 pr-5">
            <span className="absolute bottom-5 left-3 top-5 w-px bg-maszt-ink/15" aria-hidden="true" />
            <span ref={bar} className="absolute left-3 top-5 h-[calc(100%-2.5rem)] w-px origin-top bg-maszt-green" aria-hidden="true" />
            {STOPS.map((stop, i) => (
              <button
                key={stop.id}
                ref={(el) => {
                  railItems.current[i] = el;
                }}
                onClick={() => jumpTo(i)}
                className="group relative text-left font-mono text-[11px] uppercase tracking-widest text-maszt-ink/45 transition-colors hover:text-maszt-ink data-[active]:text-maszt-ink"
              >
                <span className="absolute -left-[23.5px] top-1/2 size-2 -translate-y-1/2 rounded-full border border-maszt-ink/30 bg-maszt-sand transition-colors group-data-[active]:border-maszt-deep group-data-[active]:bg-maszt-green" />
                {stop.label}
              </button>
            ))}
          </div>
        </nav>

        <div ref={hint} className="pointer-events-none absolute bottom-6 right-6 hidden items-center md:flex gap-3 font-mono text-[11px] uppercase tracking-widest text-maszt-ink/60 md:right-10">
          Przewiń
          <span className="relative block h-8 w-px overflow-hidden bg-maszt-ink/15">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-hint_1.6s_ease-in-out_infinite] bg-maszt-ink" />
          </span>
        </div>
      </div>
    </section>
  );
}
