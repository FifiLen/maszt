"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { isOngoing, projectIndex } from "@/lib/project-index";
import "./home.css";

const JOIN_HREF = "mailto:fundacja@maszt.org?subject=Chc%C4%99%20do%C5%82%C4%85czy%C4%87%20do%20Masztu";
const noopSubscribe = () => () => {};
const todayIso = () => new Date().toISOString().slice(0, 10);

const TEAM = [
  {
    name: "Alicja Sobik-Lipus",
    role: "Członkini zarządu",
    bio: "Psycholożka i psychoterapeutka, zaangażowana w działania związku zawodowego.",
    photo: "/media/images/69fcba460032f3d10c91-alicja-sobik-fundacja.jpg",
  },
  {
    name: "Michał Naczyński",
    role: "Członek zarządu",
    bio: "Psycholog, psychoterapeuta i koordynator projektów w Stowarzyszeniu Oświatowym Rodzice-Dzieciom w Rybniku. W latach 2021–25 w Zarządzie Krajowym Ogólnopolskiego Związku Zawodowego Psychologów.",
    photo: "/media/images/69fcba970013c62dc3fc-micha-naczynski-fundacja.jpg",
  },
  {
    name: "Magdalena Kufka",
    role: "Członkini zarządu",
    bio: "Psycholożka i psychoterapeutka. Prowadziła projekty w Stowarzyszeniu Pod Wieżą przy rybnickim szpitalu psychiatrycznym.",
    photo: "/media/images/69fcbac800060b948646-magdalena-kufka-fundacja.jpg",
  },
];

type Doc = { title: string; href: string; meta: string };

const DOCS: { group: string; items: Doc[] }[] = [
  {
    group: "Fundacja",
    items: [
      { title: "Statut Fundacji Maszt", href: "/media/documents/69c31c1100299ec86a35-statut-fundacja-maszt-12.07.2024.pdf", meta: "PDF · 52 KB" },
      { title: "Polityka ochrony dzieci", href: "/media/documents/69c31e0c002d99c72101-polityka-ochrony-dzieci.pdf", meta: "PDF · 277 KB" },
      {
        title: "Polityka ochrony dzieci – wersja dla dzieci",
        href: "/media/images/69c31dc8000007d21afa-polityka-ochrony-wersja-graficzna-dla-dzieci.jpg",
        meta: "grafika JPG",
      },
      { title: "RODO", href: "/media/documents/69c31c670013f56a48be-rodo-3-.pdf", meta: "PDF · 201 KB" },
      {
        title: "Regulamin obiegu dokumentów finansowych",
        href: "/media/documents/69c31d85000edc341f89-regulamin-obiegu-dokumentow-finansowych-1-1-.pdf",
        meta: "PDF · 136 KB",
      },
    ],
  },
  {
    group: "Sprawozdania",
    items: [
      {
        title: "Sprawozdanie finansowe i merytoryczne 2025",
        href: "/media/documents/6a250f4100259121a844-sprawozdanie-finansowe-merytoryczne-fundacja-maszt-2025.pdf",
        meta: "PDF · 966 KB",
      },
      {
        title: "Sprawozdanie z działalności 2024",
        href: "/media/documents/69c31d36002ab0c39092-sprawozdanie-z-dzialalnosci-fundacji-2024-compressed.pdf",
        meta: "PDF · 613 KB",
      },
      { title: "Rozliczenie finansowe 2024", href: "/media/documents/69c31e3d0019550634ef-rozliczenie-finansowe-2024.pdf", meta: "PDF · 436 KB" },
    ],
  },
];

// UWAGA: zdjęcia są poglądowe (w tym dwa wygenerowane przez AI) – do podmiany na zdjęcia z projektów.
const PROJECT_PHOTOS: Record<string, string> = {
  "young-minds-real-change": "/hero-bg-ludzie.jpg",
  "biegne-dla-zdrowej-glowy": "/media/images/69c325d60030fa5b980a-amine-hoov-uiz1w4sehd8-unsplash.jpg",
  "mas-zt": "/media/images/6a05643b00212f209d8d-chatgpt-image-14-maj-2026-07-56-34.png",
  "w-kolorowych-ramach": "/hero-bg.jpg",
  "zaloga-na-poklad": "/media/images/6a05668000247bc08a56-chatgpt-image-14-maj-2026-08-06-33.png",
};
const FALLBACK_PHOTOS = Object.values(PROJECT_PHOTOS);

const ARROW = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
  </svg>
);

/**
 * Projekty: zielona sekcja w kolorze masztu wjeżdża na finał makiety (page.tsx), krótko wprowadza i pokazuje
 * projekty jako listę dużych nazw. Z myszką najechany wiersz rozsuwa się z opisem, pozostałe przygasają,
 * a przy kursorze płynie zdjęcie projektu. Na telefonie wiersze mają małą miniaturę.
 */
export function Projects({ className }: { className?: string }) {
  const today = useSyncExternalStore(noopSubscribe, todayIso, () => null);
  const all = projectIndex(today);
  const featured = all.slice(0, 5);
  const photo = (slug: string, i: number) => PROJECT_PHOTOS[slug] ?? FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length];

  const list = useRef<HTMLUListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // Ostatnio pokazane zdjęcie zostaje w podglądzie, gdy ten gaśnie po wyjechaniu kursorem z listy.
  const [shown, setShown] = useState(0);

  // Podgląd dojeżdża do kursora z lekkim opóźnieniem; pozycję piszemy prosto do stylu, bez renderów Reacta.
  useEffect(() => {
    const ul = list.current;
    const box = preview.current;
    if (!ul || !box) return;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const place = () => {
      box.style.translate = `${x}px ${y}px`;
    };
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      place();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const aim = (event: PointerEvent) => {
      const rect = ul.getBoundingClientRect();
      tx = event.clientX - rect.left;
      ty = event.clientY - rect.top;
    };
    // Przy wejściu na listę podgląd pojawia się od razu przy kursorze, potem już za nim płynie.
    const enter = (event: PointerEvent) => {
      aim(event);
      x = tx;
      y = ty;
      place();
    };
    const move = (event: PointerEvent) => {
      aim(event);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    ul.addEventListener("pointerenter", enter);
    ul.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      ul.removeEventListener("pointerenter", enter);
      ul.removeEventListener("pointermove", move);
    };
  }, []);

  const show = (i: number) => {
    setActive(i);
    setShown(i);
  };

  return (
    <section
      id="projekty"
      data-header="green"
      className={cn(
        "projekty grid-site relative rounded-t-[2rem] bg-maszt-green pb-24 pt-28 text-white shadow-[0_-30px_60px_-20px_rgb(0_0_0/0.3)] lg:rounded-t-[2.5rem] lg:pb-32 lg:pt-36",
        className,
      )}
    >
      <p className="reveal col-[2/14] text-balance text-[clamp(1.75rem,3.3vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:col-[2/12]">
        Każdy projekt zaczyna się od pomysłu młodych ludzi. My dajemy im pokład, załogę i&nbsp;wiatr w&nbsp;żagle – tak powstało już {all.length}
        &nbsp;projektów.
      </p>

      <div className="reveal relative col-[2/14] mt-16 lg:mt-24">
        <ul ref={list} className="proj-rows border-t border-white/35" onPointerLeave={() => setActive(null)}>
          {featured.map((project, i) => {
            const live = isOngoing(project, today);
            return (
              <li key={project.slug} className="proj-row border-b border-white/35" onPointerEnter={() => show(i)}>
                <Link href={`/projekty/${project.slug}`} className="group flex items-center gap-4 py-5 md:grid md:grid-cols-12 md:items-start md:gap-5 md:py-7">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-maszt-ink/20 md:hidden">
                    <Image src={photo(project.slug, i)} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="min-w-0 md:col-span-8">
                    <span className="block text-balance text-2xl font-medium leading-[1.1] tracking-[-0.03em] md:text-[clamp(1.75rem,3vw,3rem)]">
                      {project.name}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2 text-sm font-medium md:hidden">
                      {live && <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />}
                      {project.period}
                    </span>
                    <span className="proj-lead hidden md:grid">
                      <span className="min-h-0 overflow-hidden">
                        <span className="block max-w-xl pt-3 text-pretty text-lg">{project.lead}</span>
                      </span>
                    </span>
                  </span>
                  <span className="hidden items-center justify-end gap-4 pt-2 font-medium md:col-span-4 md:flex">
                    {live && (
                      <span className="flex items-center gap-2">
                        <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
                        Trwa teraz
                      </span>
                    )}
                    <span className="tabular-nums">{project.period}</span>
                    <span className="grid size-9 place-items-center rounded-full border border-white/50 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-maszt-green">
                      {ARROW}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Podgląd przy kursorze (tylko z myszką, home.css). */}
        <div
          ref={preview}
          className="proj-preview pointer-events-none absolute left-0 top-0 z-10 -ml-32 -mt-40 h-80 w-64 overflow-hidden rounded-2xl bg-maszt-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)]"
          data-on={active !== null || undefined}
          aria-hidden="true"
        >
          {featured.map((project, i) => (
            <Image
              key={project.slug}
              src={photo(project.slug, i)}
              alt=""
              fill
              sizes="256px"
              className={cn("object-cover transition-opacity duration-300", i === shown ? "opacity-100" : "opacity-0")}
            />
          ))}
        </div>
      </div>

      <div className="col-[2/14] flex justify-end">
        <Link href="/projekty" className="group flex items-center gap-3 py-5 font-medium transition-opacity hover:opacity-80">
          Wszystkie projekty
          <span className="transition-transform group-hover:translate-x-0.5">{ARROW}</span>
        </Link>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section id="zarzad" className="grid-site scroll-mt-24 bg-maszt-sand pb-28 lg:pb-40">
      <figure className="reveal col-[2/14] border-t border-maszt-ink/15 pt-16 lg:col-[2/12] lg:pt-24">
        <blockquote className="text-balance text-lead font-medium text-maszt-ink">
          „Łódź jest tak silna, jak bardzo zaangażowana w pracę jest jej cała załoga.”
        </blockquote>
        <figcaption className="mt-6 text-maszt-ink/60">Magdalena Kufka, zarząd fundacji</figcaption>
      </figure>

      <div className="reveal col-[2/14] mt-24 lg:col-[2/7] lg:mt-36">
        <h2 className="text-balance text-h2 font-medium text-maszt-ink">Ludzie Masztu</h2>
        <p className="mt-6 max-w-md text-lg text-maszt-ink/70">
          Zarząd fundacji tworzą psychologowie i psychoterapeuci, którzy na co dzień pomagają ludziom w kryzysie.
        </p>
      </div>
      <ul className="reveal-stagger col-[2/14] mt-14 grid gap-12 md:grid-cols-3 md:gap-5 lg:mt-20">
        {TEAM.map((person) => (
          <li key={person.name} className="flex flex-col border-t border-maszt-ink/15 pt-6">
            <Image src={person.photo} alt={person.name} width={112} height={112} className="size-28 rounded-2xl object-cover" />
            <h3 className="mt-8 text-2xl font-medium tracking-[-0.03em] text-maszt-ink">{person.name}</h3>
            <p className="mt-1 text-sm font-medium text-maszt-green">{person.role}</p>
            <p className="mt-4 max-w-sm text-pretty text-maszt-ink/70">{person.bio}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Documents() {
  return (
    <section id="dokumenty" className="grid-site scroll-mt-24 bg-maszt-sand pb-6">
      <div className="col-[2/14] grid gap-12 rounded-3xl bg-white px-6 py-14 md:grid-cols-12 md:gap-5 lg:px-14 lg:py-20">
        <div className="reveal self-start md:sticky md:top-28 md:col-span-5">
          <h2 className="text-balance text-h2 font-medium text-maszt-ink">Dokumenty</h2>
          <p className="mt-6 max-w-sm text-lg text-maszt-ink/70">Statut, zasady, których się trzymamy, i sprawozdania z każdego roku działalności.</p>
        </div>
        <div className="flex flex-col gap-10 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          {DOCS.map(({ group, items }) => (
            <div key={group} className="reveal">
              <h3 className="text-sm font-medium text-maszt-ink/50">{group}</h3>
              <ul className="mt-3">
                {items.map((doc) => (
                  <li key={doc.href}>
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-6 border-t border-maszt-ink/10 py-4"
                    >
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug text-maszt-ink transition-colors group-hover:text-maszt-deep">{doc.title}</span>
                        <span className="mt-0.5 block text-sm text-maszt-ink/50">{doc.meta}</span>
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        className="shrink-0 text-maszt-ink/40 transition-[color,translate] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-maszt-ink"
                        aria-hidden="true"
                      >
                        <path d="M4 10 10 4M5 4h5v5" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="dolacz" className="grid-site bg-maszt-sand pb-6 pt-6">
      <div data-header="green" className="relative col-[2/14] overflow-hidden rounded-3xl bg-maszt-green px-6 py-16 text-maszt-ink lg:px-14 lg:py-24">
        <h2 className="reveal max-w-4xl text-balance text-h2 font-medium">Wejdź z nami na Maszt</h2>
        <p className="mt-6 max-w-xl text-lg text-maszt-ink/75">
          Zostań wolontariuszem, przynieś własny pomysł albo wesprzyj nas darowizną. To wymaga energii do działania i ekipy osób, które wejdą na Maszt razem z
          nami.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={JOIN_HREF} className="rounded-full bg-maszt-ink px-6 py-3.5 font-medium text-white transition-colors hover:bg-white hover:text-maszt-ink">
            Napisz do nas
          </a>
          <a href="#wesprzyj" className="rounded-full border border-maszt-ink/25 px-6 py-3.5 font-medium transition-colors hover:border-maszt-ink">
            Wesprzyj fundację
          </a>
        </div>
        <Image
          src="/media/images/69fcd0b600179d8b442f-cropped-fundacja-maszt-logo-kolor-4283840181-e1715188429123.png"
          alt=""
          width={263}
          height={263}
          unoptimized
          className="pointer-events-none absolute -bottom-10 -right-6 h-48 w-auto opacity-[0.12] mix-blend-multiply grayscale lg:h-72"
        />
      </div>
    </section>
  );
}
