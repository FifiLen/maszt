"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { isOngoing, projectIndex } from "@/lib/project-index";
import { Logo } from "./Logo";

const JOIN_HREF = "mailto:fundacja@maszt.org?subject=Chc%C4%99%20do%C5%82%C4%85czy%C4%87%20do%20Masztu";

const LINKS = [
  { href: "/#o-fundacji", label: "O fundacji" },
  { href: "/#dokumenty", label: "Dokumenty" },
  { href: "#kontakt", label: "Kontakt" },
  { href: "#wesprzyj", label: "Wesprzyj" },
];

// Jasne, prawie kryjące tło pigułek – bez backdrop-blur, który nad sceną 3D kosztowałby co klatkę.
const PILL = "pointer-events-auto rounded-full bg-[#f7f5f2]/95 shadow-[0_6px_24px_rgba(18,57,47,0.14)] ring-1 ring-maszt-ink/5";

// Status „trwa” liczymy tylko w przeglądarce – strona jest statyczna, a data budowania bywa sprzed tygodni.
const noopSubscribe = () => () => {};
const todayIso = () => new Date().toISOString().slice(0, 10);

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-maszt-ink px-2 py-0.5 text-[11px] font-medium text-maszt-sand">
      <span className="size-1.5 animate-pulse rounded-full bg-maszt-green" />
      trwa
    </span>
  );
}

/**
 * Nagłówek jak w pokazie dla Tenixa: samo logo z lewej (bez tła), z prawej pływająca pigułka z nawigacją i CTA.
 * CTA „Projekty”: najechanie lub fokus otwiera kartę z projektami, kliknięcie przenosi do /projekty.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const today = useSyncExternalStore(noopSubscribe, todayIso, () => null);
  const projects = projectIndex(today);

  // Karty są „przypięte” do ścieżki, na której je otwarto – po przejściu na inną stronę same się zamykają.
  const [panelFor, setPanelFor] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const panelOpen = panelFor === pathname;
  const menuOpen = menuFor === pathname;

  const headerRef = useRef<HTMLElement>(null);
  const projectsButton = useRef<HTMLAnchorElement>(null);
  const closeTimer = useRef<number>(0);
  // Po Escape oddajemy fokus przyciskowi – ten fokus nie może od razu otworzyć karty ponownie.
  const skipFocusOpen = useRef(false);

  // Escape i klik poza nagłówkiem zamykają otwarte karty.
  useEffect(() => {
    if (!panelOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPanelFor(null);
      setMenuFor(null);
      if (panelOpen) {
        skipFocusOpen.current = true;
        projectsButton.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setPanelFor(null);
        setMenuFor(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [panelOpen, menuOpen]);

  // Kolor logo zależy od sekcji pod nim (data-header="dark" | "purple" | "green", logo.css). Sprawdzamy, co leży
  // pod logo, i zapisujemy to na <html> – zwykły atrybut zamiast stanu, bo zmienia się tylko kolor logo.
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const check = () => {
      raf = 0;
      const under = document.elementsFromPoint(32, 36).find((el) => !headerRef.current?.contains(el));
      root.setAttribute("data-header-under", under?.closest("[data-header]")?.getAttribute("data-header") ?? "none");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeAttribute("data-header-under");
    };
  }, [pathname]);

  const openPanel = () => {
    window.clearTimeout(closeTimer.current);
    setPanelFor(pathname);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPanelFor(null), 180);
  };
  const closeAll = () => {
    setPanelFor(null);
    setMenuFor(null);
  };

  return (
    <header
      ref={headerRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between p-3 sm:p-4 lg:p-6"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPanelFor(null);
      }}
    >
      <Link href="/" onClick={closeAll} className="pointer-events-auto flex h-14 items-center pl-2" aria-label="Fundacja Maszt – strona główna">
        <Logo className="logo-auto h-9 lg:h-11" />
      </Link>

      <div
        className="relative"
        onPointerEnter={(e) => e.pointerType === "mouse" && panelOpen && window.clearTimeout(closeTimer.current)}
        onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
      >
        <nav className={cn(PILL, "flex h-14 items-center gap-1 p-1.5 pl-2 text-[15px] text-maszt-ink")} aria-label="Główna nawigacja">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeAll}
              className="rounded-full px-3.5 py-2 font-medium transition-colors hover:bg-maszt-ink/[0.06] max-lg:hidden"
            >
              {link.label}
            </Link>
          ))}
          <Link
            ref={projectsButton}
            href="/projekty"
            onClick={closeAll}
            onPointerEnter={(e) => e.pointerType === "mouse" && openPanel()}
            onFocus={() => {
              if (skipFocusOpen.current) skipFocusOpen.current = false;
              else openPanel();
            }}
            aria-describedby="karta-projekty-opis"
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors",
              panelOpen || pathname.startsWith("/projekty")
                ? "bg-maszt-ink text-maszt-sand"
                : "bg-maszt-green text-maszt-ink hover:bg-maszt-ink hover:text-maszt-sand",
            )}
          >
            Projekty
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className={cn("transition-transform duration-300 max-lg:hidden", panelOpen && "rotate-180")}
              aria-hidden="true"
            >
              <path d="M2.5 4.5 6 8l3.5-3.5" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setMenuFor(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobilne"
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-maszt-ink/[0.06] lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 9h16M4 15h10"} />
            </svg>
          </button>
        </nav>

        {/* Karta projektów (desktop) – w DOM zaraz za przyciskiem, więc Tab wchodzi w listę. */}
        <div
          id="karta-projekty"
          inert={!panelOpen}
          className={cn(
            "pointer-events-auto absolute right-0 top-full hidden w-[min(680px,calc(100vw-3rem))] origin-top-right pt-3 transition-[opacity,scale,translate] duration-300 ease-out lg:block motion-reduce:transition-none",
            panelOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0",
          )}
        >
          <p id="karta-projekty-opis" className="sr-only">
            Otwiera listę projektów. Kliknięcie przenosi do wszystkich projektów.
          </p>
          <div className="rounded-[28px] bg-[#f7f5f2] p-2 shadow-[0_18px_50px_rgba(18,57,47,0.22)] ring-1 ring-maszt-ink/5">
            <ul className="grid grid-cols-2 gap-0.5">
              {projects.map((project, i) => {
                const active = pathname === `/projekty/${project.slug}`;
                return (
                  <li
                    key={project.slug}
                    className={cn(
                      "transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none",
                      panelOpen ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                    )}
                    style={{ transitionDelay: panelOpen ? `${40 + i * 25}ms` : "0ms" } as CSSProperties}
                  >
                    <Link
                      href={`/projekty/${project.slug}`}
                      onClick={closeAll}
                      aria-current={active ? "page" : undefined}
                      className={cn("group flex h-full flex-col rounded-[20px] px-4 py-3 transition-colors hover:bg-maszt-ink/[0.05]", active && "bg-maszt-ink/[0.05]")}
                    >
                      <span className="flex items-center gap-2 text-[13px] text-maszt-ink/55">
                        {isOngoing(project, today) && <LiveBadge />}
                        {project.period}
                      </span>
                      <span className="mt-1 flex items-center justify-between gap-3 font-heading text-[17px] font-medium leading-tight tracking-tight text-maszt-ink">
                        {project.name}
                        <span className="text-maszt-deep opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-1 flex items-center justify-between gap-4 rounded-[22px] bg-maszt-ink px-5 py-3 text-maszt-sand">
              <a href={JOIN_HREF} className="text-sm text-maszt-sand/75 underline-offset-4 hover:text-maszt-sand hover:underline">
                Masz pomysł na projekt? Napisz do nas
              </a>
              <Link
                href="/projekty"
                onClick={closeAll}
                className="group flex items-center gap-2 rounded-full bg-maszt-green px-4 py-2 text-sm font-semibold text-maszt-ink transition-colors hover:bg-maszt-sand"
              >
                Wszystkie projekty
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Menu mobilne: mała karta pod pigułką, jak w pokazie dla Tenixa. */}
        {menuOpen && (
          <div
            id="menu-mobilne"
            className="pointer-events-auto absolute right-0 top-full mt-3 flex w-[min(320px,calc(100vw-1.5rem))] flex-col rounded-[24px] bg-[#f7f5f2] p-2 text-maszt-ink shadow-[0_18px_50px_rgba(18,57,47,0.22)] ring-1 ring-maszt-ink/5 lg:hidden"
          >
            {[{ href: "/", label: "Strona główna" }, ...LINKS].map((link) => (
              <Link key={link.href} href={link.href} onClick={closeAll} className="rounded-2xl px-4 py-3 text-[17px] font-medium hover:bg-maszt-ink/[0.06]">
                {link.label}
              </Link>
            ))}
            <Link
              href="/projekty"
              onClick={closeAll}
              className="mt-1 flex items-center justify-between rounded-2xl bg-maszt-ink px-4 py-3 text-[17px] font-medium text-maszt-sand"
            >
              Wszystkie projekty
              <span aria-hidden="true">→</span>
            </Link>
            <a href={JOIN_HREF} className="px-4 pb-1 pt-3 text-sm text-maszt-ink/60 underline-offset-4 hover:underline">
              Dołącz do Masztu
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
