"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./home.css";

const MISSION = "Budujemy infrastrukturę społeczną, by ludzie doświadczali bycia wartością.";

const STATEMENT =
  "Na Zalewie Rybnickim wciąż widać łódki z masztami, a od elektrowni maszty wysokiego napięcia przesyłają energię całemu miastu. My budujemy maszt dla ludzi – miejsce, z którego energia młodych płynie dalej.";

/**
 * Hero z wideo w tle, układem jak u Hut 8: cienka linia przez środek ekranu, na niej nazwa fundacji
 * i przejście do makiety, pod nią misja, a w lewym dolnym rogu tekst o masztach nad Zalewem.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  // Pauza wybrana przez użytkownika (przycisk albo „ogranicz ruch”) – wtedy nie wznawiamy sami.
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = section.current;
    const player = video.current;
    if (!node || !player) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) userPaused.current = true;
    // Poza ekranem (np. przy makiecie 3D) wideo stoi i nie zabiera procesora. Przeglądarka sama
    // wstrzymuje wideo w karcie w tle – po powrocie na kartę wznawiamy je.
    let inView = false;
    let covered = false;
    const sync = () => {
      if (inView && !covered && !document.hidden && !userPaused.current) player.play().catch(() => {});
      else player.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(node);
    // Hero jest sticky, a następna sekcja na nie wjeżdża – gdy dojedzie do góry ekranu, hero jest zakryte.
    const coverObserver = new IntersectionObserver(
      ([entry]) => {
        covered = entry.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px -95% 0px" },
    );
    if (node.nextElementSibling) coverObserver.observe(node.nextElementSibling);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      coverObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Jasny odcinek na linii pokazuje, ile zostało do końca pętli – liczony tylko, gdy wideo gra.
  useEffect(() => {
    const player = video.current;
    const bar = progress.current;
    if (!playing || !player || !bar) return;
    let raf = 0;
    const tick = () => {
      bar.style.transform = `scaleX(${player.duration ? player.currentTime / player.duration : 0})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    const player = video.current;
    if (!player) return;
    userPaused.current = !player.paused;
    if (player.paused) player.play().catch(() => {});
    else player.pause();
  };

  return (
    <section
      ref={section}
      id="top"
      data-header="dark"
      className="sticky top-0 isolate flex h-svh min-h-[34rem] flex-col overflow-hidden bg-maszt-ink text-white"
    >
      {/* Łódka płynie środkiem kadru – przesuwamy obraz, żeby nie chowała się za tekstem
          (na komputerze w lewo, pod pustą połowę linii; na telefonie w dół, między linię a tekst o Zalewie). */}
      <video
        ref={video}
        className="absolute -z-20 max-w-none object-cover max-lg:inset-x-0 max-lg:top-0 max-lg:h-[116%] max-lg:w-full lg:inset-y-0 lg:right-0 lg:h-full lg:w-[128%]"
        poster="/video/hero-zalew.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-hidden="true"
      >
        <source src="/video/hero-zalew-720.mp4" type="video/mp4" media="(min-width: 48rem)" />
        <source src="/video/hero-zalew-540.mp4" type="video/mp4" />
      </video>
      {/* Lekkie przyciemnienie: u góry pod nawigację, u dołu pod tekst o Zalewie. */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(18_57_47/0.4),transparent_22%),linear-gradient(to_top,rgb(18_57_47/0.85),rgb(18_57_47/0.25)_45%,rgb(18_57_47/0.1))]"
        aria-hidden="true"
      />

      {/* Przy przykrywaniu cała treść odjeżdża w górę i gaśnie, a wideo ciemnieje (home.css). */}
      <div className="home-shade pointer-events-none absolute inset-0 z-10 bg-maszt-ink opacity-0" aria-hidden="true" />
      <div className="home-cover flex flex-1 flex-col">
        <div className="min-h-28 flex-1" />

        <div className="grid-site w-full">
          <p className="col-[2/14] text-balance text-[clamp(2rem,3.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] max-lg:mb-6 lg:col-[7/12] lg:row-start-2 lg:mt-5">
            <span className="home-in block" style={{ "--d": "0.25s" } as CSSProperties}>
              {MISSION}
            </span>
          </p>

          <div className="home-rule relative col-[2/14] h-px bg-white/35 lg:row-start-1" aria-hidden="true">
            <span className="absolute -top-px right-0 h-[3px] w-24 bg-white/20 lg:w-[calc((100%-11*1.25rem)/12*2+1.25rem)]">
              <span ref={progress} className="block h-full origin-left scale-x-0 bg-white" />
            </span>
          </div>

          <h1 className="home-in col-[2/8] self-start py-4 text-sm font-medium lg:col-[2/6] lg:row-start-2" style={{ "--d": "0.5s" } as CSSProperties}>
            Fundacja Maszt
          </h1>

          <a
            href="#makieta"
            className="home-in col-[8/14] flex items-center gap-3 self-start justify-self-end py-4 text-sm font-medium text-white/80 transition-colors hover:text-white lg:col-[12/14] lg:row-start-2"
            style={{ "--d": "0.6s" } as CSSProperties}
          >
            Zobacz, jak działamy
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 1.5v9M2.5 7 6 10.5 9.5 7" />
            </svg>
          </a>
        </div>

        <div className="grid-site min-h-40 w-full flex-1 items-end pb-8 lg:pb-12">
          <p
            className="home-in col-[2/12] self-end text-pretty text-[15px] leading-relaxed text-white/75 md:col-[2/9] lg:col-[2/6]"
            style={{ "--d": "0.7s" } as CSSProperties}
          >
            {STATEMENT}
          </p>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Zatrzymaj wideo w tle" : "Odtwórz wideo w tle"}
            className="home-in col-[12/14] grid size-10 place-items-center self-end justify-self-end rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white"
            style={{ "--d": "0.8s" } as CSSProperties}
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M2 1h3.5v12H2zM8.5 1H12v12H8.5z" /> : <path d="M2.5 1 13 7 2.5 13z" />}
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
