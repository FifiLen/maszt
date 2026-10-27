"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { STOPS, clamp01, journey, stopWeight } from "./journey-state";
import "./makieta.css";

const MakietaScene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <p className="animate-pulse text-sm font-medium text-maszt-deep">Rozkładamy makietę…</p>
    </div>
  ),
});

type ProjectLink = { slug: string; name: string; meta: string };
type Panel = {
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
    title: "Energia, która płynie dalej",
    text: "Od Elektrowni Rybnik maszty wysokiego napięcia przesyłają energię całemu miastu. My budujemy sieć dla energii ludzi – w „Załodze na pokład” młodzi wolontariusze współtworzą fundację.",
    stat: { value: "56 328 zł", label: "dotacji NIW na rozwój wolontariatu młodzieży" },
    image: { src: PHOTOS.crew, alt: "Młodzi wolontariusze planują działania na pokładzie żaglówki" },
    project: { slug: "zaloga-na-poklad", name: "Załoga na pokład", meta: "wolontariat długoterminowy · 2025" },
  },
  glos: {
    title: "Głos młodych się liczy",
    text: "Większość uczniów widzi udział w życiu szkoły jako stratę czasu albo fikcję. Dlatego uczniowie, nauczyciele, dyrektorzy i aktywiści usiedli przy jednym stole i wypracowali konkretne propozycje zmian.",
    stat: { value: "26,5%", label: "rybnickich uczniów czuje się zaangażowanych w decyzje szkolne" },
    image: { src: PHOTOS.table, alt: "Uczniowie i dorośli rozmawiają przy wspólnym stole" },
    project: { slug: "godomy-o-edukacji", name: "Godomy o edukacji", meta: "debata world cafe · 2024" },
    also: { slug: "mas-zt", name: "MAS-ZT", meta: "samorządy uczniowskie 5 szkół" },
  },
  wspolnota: {
    title: "Patrz, słuchaj, łącz",
    text: "Młodzież uczy się rozpoznawać stres u siebie i innych oraz wspierać rówieśników w trudnych chwilach – według modelu UNICEF i WHO.",
    stat: { value: "15–19", label: "lat – wiek uczestników, udział w 100% bezpłatny" },
    image: { src: PHOTOS.friends, alt: "Grupa nastolatków rozmawia, siedząc na schodach" },
    project: { slug: "pierwsza-pomoc-przedpsychologiczna", name: "Pierwsza Pomoc przedPsychologiczna", meta: "zdrowie psychiczne · 2025" },
    also: { slug: "biegne-dla-zdrowej-glowy", name: "Biegnę dla zdrowej głowy", meta: "20 młodzieżowych wolontariuszy" },
  },
  zagle: {
    title: "Pod naszymi żaglami",
    text: "Czwórka rybnickich 14-latków przyszła do nas sama z pytaniem, czy pomożemy im zrobić coś dobrego. Wymyślili walentynki z quizem, które kierowały do adopcji zwierząt ze schroniska.",
    stat: { value: "4 379 zł", label: "zebrane dla rybnickiego schroniska" },
    image: { src: PHOTOS.change, alt: "Mural z napisem o zmianie, która nie przychodzi przypadkiem" },
    project: { slug: "milosc-na-cztery-lapy", name: "Miłość na cztery łapy", meta: "pomysł ósmoklasistów · 2025" },
  },
};

/** Miejsce przystanku na pasku = moment, w którym kamera do niego dojeżdża. */
const stopAt = (i: number) => (i === 0 ? 0 : i < STOPS.length ? STOPS[i].window[0] : Infinity);

/** Gdzie kamera stoi na przystanku (środek jego okna) – tu prowadzi kliknięcie w spis i trasa automatyczna. */
const stopCenter = (i: number) => (i === 0 ? 0 : Math.min(1, (STOPS[i].window[0] + STOPS[i].window[1]) / 2));

// Trasa automatyczna: ile czeka (ms), zanim pojedzie dalej, i jak długo jedzie do następnego przystanku.
const DWELL_START = 3500;
const DWELL_STOP = 9000; // czas na przeczytanie karty
const DWELL_BETWEEN = 2000; // ktoś zatrzymał się w pół drogi – dowozimy do najbliższego przystanku
const GLIDE_MS = 2800;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Sekcja ma 1200svh: 1100svh to trasa kamery, a ostatnie 100svh makieta stoi przypięta na finale,
// gdy wjeżdża na nią następna sekcja (projekty). Zakres przewijania trasy liczymy bez tego ogona.
const journeyRange = (el: HTMLElement) => (el.offsetHeight * 11) / 12 - window.innerHeight;

const noopSubscribe = () => () => {};
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Telefon i tablet: mniejsza mapa cieni i niższa rozdzielczość renderu.
const detectQuality = () =>
  !window.matchMedia("(pointer: coarse)").matches && window.innerWidth >= 900 ? ("high" as const) : ("low" as const);

/** Włącza i wyłącza trasę automatyczną. Pierścień wokół przycisku odlicza czas do następnego przystanku (--t). */
function AutoToggle({ on, onToggle, refFn, className }: { on: boolean; onToggle: () => void; refFn: (el: HTMLButtonElement | null) => void; className?: string }) {
  return (
    <button
      ref={refFn}
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Zatrzymaj automatyczną trasę po makiecie" : "Włącz automatyczną trasę po makiecie"}
      className={cn("mk-auto group/auto grid size-10 place-items-center rounded-full bg-maszt-sand/90 text-maszt-ink shadow-sm ring-1 ring-maszt-ink/10 backdrop-blur transition-colors hover:bg-maszt-sand", className)}
    >
      <svg className="mk-auto__ring absolute inset-0 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill="none" strokeWidth="2" />
      </svg>
      <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
        {on ? <path d="M2 1h3.5v12H2zM8.5 1H12v12H8.5z" /> : <path d="M2.5 1 13 7 2.5 13z" />}
      </svg>
    </button>
  );
}

export function Makieta({ id, className }: { id?: string; className?: string }) {
  const root = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const railItems = useRef<(HTMLButtonElement | null)[]>([]);
  const hint = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const mobileBar = useRef<HTMLDivElement>(null);
  const autoButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(true);
  // Trasa automatyczna jest domyślnie włączona, chyba że ktoś ma ustawione ograniczenie ruchu.
  const reducedMotion = useSyncExternalStore(noopSubscribe, prefersReducedMotion, () => false);
  const [autoChoice, setAutoChoice] = useState<boolean | null>(null);
  const auto = autoChoice ?? !reducedMotion;
  const autoRef = useRef(auto);
  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);
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

    // Trasa automatyczna: gdy nikt nie dotyka strony, kamera sama jedzie od przystanku do przystanku.
    // Każdy ruch użytkownika (kółko, dotyk, klawisz, klik) przerywa przejazd i odlicza czekanie od nowa.
    let lastInput = performance.now();
    let settledSince = performance.now();
    let glide: { from: number; to: number; start: number } | null = null;
    let lastCountdown = -1;
    const onInput = () => {
      lastInput = performance.now();
      glide = null;
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    inputs.forEach((type) => window.addEventListener(type, onInput, { passive: true }));
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const el = root.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        journey.target = clamp01(-rect.top / journeyRange(el));
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
        // Przystanek „osiągnięty”, gdy linia energii do niego doszła; „bieżący” – ostatni osiągnięty.
        const reached = p >= stopAt(i) - 0.002;
        const current = reached && !(p >= stopAt(i + 1) - 0.002);
        const item = railItems.current[i];
        if (item) {
          if (item.hasAttribute("data-reached") !== reached) item.toggleAttribute("data-reached", reached);
          if (item.hasAttribute("data-current") !== current) item.toggleAttribute("data-current", current);
        }
      });
      let countdown = 0;
      if (el && glide) {
        const t = clamp01((now - glide.start) / GLIDE_MS);
        window.scrollTo({ top: glide.from + (glide.to - glide.from) * easeInOut(t), behavior: "instant" });
        if (t >= 1) glide = null;
      } else if (el && autoRef.current && !document.hidden) {
        const rect = el.getBoundingClientRect();
        // Tylko gdy makieta wypełnia ekran (przypięta), a kamera dojechała tam, gdzie wskazuje przewinięcie.
        const pinned = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
        // Czekanie liczymy od chwili, gdy makieta jest na ekranie i kamera stoi.
        if (!pinned || Math.abs(journey.target - p) > 0.003) settledSince = now;
        const t = journey.target;
        const here = STOPS.findIndex((_, i) => Math.abs(t - stopCenter(i)) < 0.015);
        // Na przystanku jedziemy do następnego, w pół drogi – do najbliższego (także wstecz).
        const nearest = STOPS.reduce((best, _, i) => (Math.abs(t - stopCenter(i)) < Math.abs(t - stopCenter(best)) ? i : best), 0);
        const next = here === -1 ? nearest : here + 1 < STOPS.length ? here + 1 : -1;
        if (pinned && next !== -1) {
          const dwell = here === -1 ? DWELL_BETWEEN : here === 0 ? DWELL_START : DWELL_STOP;
          countdown = clamp01((now - Math.max(lastInput, settledSince)) / dwell);
          if (countdown >= 1) {
            const top = rect.top + window.scrollY;
            glide = { from: window.scrollY, to: top + stopCenter(next) * journeyRange(el), start: now };
            countdown = 0;
          }
        }
      }
      const roundedCountdown = Math.round(countdown * 200) / 200;
      if (roundedCountdown !== lastCountdown) {
        lastCountdown = roundedCountdown;
        autoButtons.current.forEach((button) => button?.style.setProperty("--t", String(roundedCountdown)));
      }

      const rounded = Math.round(p * 2000) / 2000;
      if (rounded !== lastProgress) {
        lastProgress = rounded;
        if (hint.current) hint.current.style.opacity = String(1 - clamp01(rounded / 0.03));
        rail.current?.style.setProperty("--p", String(rounded));
        mobileBar.current?.style.setProperty("--p", String(rounded));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      inputs.forEach((type) => window.removeEventListener(type, onInput));
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + stopCenter(i) * journeyRange(el), behavior: "smooth" });
  };

  return (
    <section ref={root} id={id} className={cn("relative h-[1200svh]", className)} aria-label="Makieta: misja Fundacji Maszt">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <div className="absolute inset-0">{quality && <MakietaScene active={active} quality={quality} />}</div>
        {/* Miękkie wejście z piaskowego hero w jaśniejszą ziemię makiety. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-maszt-sand via-maszt-sand/60 to-transparent" aria-hidden="true" />

        {/* Podkład pod tekst: na telefonie pas na dole, na desktopie miękka plama w lewym dolnym rogu. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-maszt-sand via-maszt-sand/85 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_48%_60%_at_8%_88%,var(--color-maszt-sand)_30%,transparent_100%)] opacity-90 md:block" />

        {/* Start: ta sama skala i krawędź co misja w hero i tekst fioletowej sekcji. */}
        <div
          ref={(el) => {
            panels.current[0] = el;
          }}
          className="mk-panel absolute inset-x-5 bottom-10 md:inset-x-auto md:bottom-12 md:left-6 md:max-w-xl"
          style={{ "--w": 1 } as CSSProperties}
        >
          <h2 className="text-balance text-[clamp(2rem,3.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-maszt-ink">
            Zobacz, jak budujemy infrastrukturę społeczną
          </h2>
          <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-maszt-ink/75 lg:text-base">
            Przewijaj – kamera przejdzie przez cztery miejsca, w których młodzi ludzie biorą sprawy w swoje ręce.
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
              className="mk-panel mk-card invisible absolute inset-x-4 bottom-10 sm:inset-x-6 md:inset-x-auto md:bottom-6 md:left-6 md:top-28 md:flex md:w-[min(36vw,520px)] md:flex-col md:rounded-[28px] md:bg-maszt-sand md:p-3 md:shadow-[0_30px_80px_-30px_rgba(18,57,47,0.3)]"
            >
              <div className="mk-card__photo relative hidden min-h-[120px] flex-1 overflow-hidden rounded-[20px] bg-maszt-ink/10 md:block">
                <Image src={panel.image.src} alt={panel.image.alt} fill sizes="520px" className="object-cover" />
              </div>

              <div className="flex flex-col md:px-4 md:pb-2 md:pt-6">
                <h2
                  className="mk-stagger font-heading text-4xl font-medium leading-[0.98] tracking-tighter text-maszt-ink lg:text-[2.75rem]"
                  style={{ "--d": 0.1 } as CSSProperties}
                >
                  {panel.title}
                </h2>
                <p className="mk-stagger mt-4 text-base leading-relaxed text-maszt-ink/75" style={{ "--d": 0.2 } as CSSProperties}>
                  {panel.text}
                </p>
                <p className="mk-stagger mk-card__stat mt-5 hidden items-baseline gap-3 md:flex" style={{ "--d": 0.3 } as CSSProperties}>
                  <span className="shrink-0 font-heading text-3xl font-medium tracking-tighter text-maszt-deep">{panel.stat.value}</span>
                  <span className="text-sm leading-snug text-maszt-ink/65">{panel.stat.label}</span>
                </p>
                {/* Projekty z tego przystanku: główny z pełną strzałką, kolejny ciszej. */}
                <ul className="mk-stagger mt-6" style={{ "--d": 0.4 } as CSSProperties}>
                  {[panel.project, panel.also].map(
                    (project, j) =>
                      project && (
                        <li key={project.slug} className={cn(j > 0 && "mk-card__also")}>
                          <Link
                            href={`/projekty/${project.slug}`}
                            className="group flex items-center justify-between gap-4 border-t border-maszt-ink/10 py-3.5"
                          >
                            <span className="min-w-0">
                              <span className="block font-medium leading-snug text-maszt-ink">{project.name}</span>
                              <span className="block text-sm text-maszt-ink/55">{project.meta}</span>
                            </span>
                            <span
                              className={cn(
                                "grid size-9 shrink-0 place-items-center rounded-full transition-colors",
                                j === 0
                                  ? "bg-maszt-ink text-maszt-sand group-hover:bg-maszt-deep"
                                  : "border border-maszt-ink/20 text-maszt-ink group-hover:border-maszt-ink",
                              )}
                              aria-hidden="true"
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
                              </svg>
                            </span>
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            </article>
          );
        })}

        {/* Finał: ta sama skala i miejsce co start, a zamiast przycisków spokojne linki na cienkiej linii jak w hero. */}
        <div
          ref={(el) => {
            panels.current[STOPS.length - 1] = el;
          }}
          className="mk-panel invisible absolute inset-x-5 bottom-10 md:inset-x-auto md:bottom-12 md:left-6 md:w-[min(36rem,calc(100%-3rem))]"
        >
          <h2 className="text-balance text-[clamp(2rem,3.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-maszt-ink">
            Wejdź z nami na Maszt
          </h2>
          <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-maszt-ink/75 lg:text-base">
            Samostanowienie, sprawczość i wspólnota pozwalają doświadczać bycia wartościowym człowiekiem.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-1 border-t border-maszt-ink/20 text-sm font-medium text-maszt-ink">
            {[
              { href: "/projekty", label: "Poznaj projekty" },
              { href: "mailto:fundacja@maszt.org?subject=Chc%C4%99%20do%C5%82%C4%85czy%C4%87%20do%20Masztu", label: "Dołącz do Masztu" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center gap-3 py-4 transition-colors hover:text-maszt-deep">
                {link.label}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Spis przystanków przy prawej krawędzi: linia energii ładuje się w dół podczas przewijania (desktop).
            Nazwa widać przy bieżącym przystanku, resztę po najechaniu na spis. */}
        <nav
          ref={rail}
          className="mk-rail mk-rail--y group/rail absolute right-8 top-1/2 hidden h-[min(22rem,48svh)] w-48 -translate-y-1/2 md:block"
          aria-label="Przystanki makiety"
        >
          <span className="absolute inset-y-0 right-[7.5px] w-px bg-maszt-ink/15" aria-hidden="true" />
          <span className="mk-rail__fill absolute inset-y-0 right-[6.5px] w-[3px] rounded-full bg-maszt-green" aria-hidden="true" />
          <span className="mk-rail__track pointer-events-none absolute inset-y-0 right-2 w-0" aria-hidden="true">
            <span className="mk-rail__head absolute left-0 top-0 size-2.5 rounded-full bg-maszt-green" />
          </span>
          {STOPS.map((stop, i) => (
            <button
              key={stop.id}
              ref={(el) => {
                railItems.current[i] = el;
              }}
              onClick={() => jumpTo(i)}
              style={{ top: `${stopAt(i) * 100}%` }}
              className="mk-rail__stop group absolute right-0 flex -translate-y-1/2 items-center gap-3 py-1 text-[13px] font-medium text-maszt-ink/55 transition-colors hover:text-maszt-ink data-[current]:text-maszt-ink"
            >
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 [text-shadow:0_0_6px_var(--color-maszt-sand),0_0_12px_var(--color-maszt-sand)] group-hover/rail:opacity-100 group-focus-visible:opacity-100 group-data-[current]:opacity-100">
                {stop.label}
              </span>
              <span className="relative size-4 shrink-0 rounded-full border-2 border-maszt-ink/25 bg-maszt-sand transition-colors group-hover:border-maszt-ink group-data-[reached]:border-maszt-deep group-data-[reached]:bg-maszt-green" />
            </button>
          ))}
          <AutoToggle
            on={auto}
            onToggle={() => setAutoChoice(!auto)}
            refFn={(el) => {
              autoButtons.current[0] = el;
            }}
            className="absolute -right-3 top-[calc(100%+2.5rem)]"
          />
        </nav>
        <AutoToggle
          on={auto}
          onToggle={() => setAutoChoice(!auto)}
          refFn={(el) => {
            autoButtons.current[1] = el;
          }}
          className="absolute right-5 top-24 md:hidden"
        />

        {/* Telefon: sama cienka linia postępu przy dolnej krawędzi. */}
        <div ref={mobileBar} className="mk-rail absolute inset-x-0 bottom-0 h-[3px] bg-maszt-ink/10 md:hidden" aria-hidden="true">
          <span className="mk-rail__fill absolute inset-0 bg-maszt-green" />
        </div>

        <div ref={hint} className="pointer-events-none absolute bottom-10 right-8 hidden items-center gap-3 text-[13px] font-medium text-maszt-ink/60 md:flex">
          Przewiń
          <span className="relative block h-8 w-px overflow-hidden bg-maszt-ink/15">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-hint_1.6s_ease-in-out_infinite] bg-maszt-ink" />
          </span>
        </div>

        {/* Przyciemnienie, gdy wjeżdża następna sekcja (makieta.css). */}
        <div className="mk-shade pointer-events-none absolute inset-0 z-10 bg-maszt-ink opacity-0" aria-hidden="true" />
      </div>
    </section>
  );
}
