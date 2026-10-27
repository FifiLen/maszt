import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/#o-fundacji", label: "O fundacji" },
  { href: "/projekty", label: "Projekty" },
  { href: "/#zarzad", label: "Ludzie Masztu" },
  { href: "/#dokumenty", label: "Dokumenty" },
];

function Label({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-medium text-maszt-ink/50">{children}</h3>;
}

// Spokojna stopka jak w pokazie dla Tenixa: piasek, logo z dużymi linkami, pod nimi dane w trzech kolumnach.
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="kontakt" className="grid-site relative z-10 scroll-mt-24 bg-maszt-sand pb-10 pt-16 text-maszt-ink">
      <div className="col-[2/14] grid gap-10 border-t border-maszt-ink/15 pt-12 md:grid-cols-12 md:gap-5">
        <div className="md:col-span-5">
          <Logo label="Fundacja Maszt" className="h-10" />
          <p className="mt-5 max-w-[26ch] text-maszt-ink/70">By ludzie doświadczali bycia wartością.</p>
        </div>
        <nav aria-label="Stopka" className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-2xl font-medium tracking-[-0.03em] transition-colors hover:text-maszt-deep lg:text-3xl">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="col-[2/14] mt-16 grid gap-12 md:grid-cols-12 md:gap-5">
        <div className="flex flex-col gap-4 md:col-span-4 lg:col-span-3">
          <Label>Kontakt</Label>
          <div className="flex flex-col gap-1.5">
            <a href="mailto:fundacja@maszt.org" className="w-fit transition-colors hover:text-maszt-deep">
              fundacja@maszt.org
            </a>
            <a href="tel:+48792220095" className="w-fit transition-colors hover:text-maszt-deep">
              +48 792 220 095
            </a>
            <p className="mt-2 text-maszt-ink/70">
              ul. Energetyków 22
              <br />
              44-200 Rybnik
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:col-span-3 lg:col-start-5">
          <Label>Fundacja Maszt</Label>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-maszt-ink/70">
            <dt>KRS</dt>
            <dd className="tabular-nums text-maszt-ink">0001118111</dd>
            <dt>NIP</dt>
            <dd className="tabular-nums text-maszt-ink">6423255265</dd>
            <dt>REGON</dt>
            <dd className="tabular-nums text-maszt-ink">529416225</dd>
          </dl>
        </div>

        <div id="wesprzyj" className="flex scroll-mt-28 flex-col gap-4 md:col-span-5 lg:col-span-4 lg:col-start-9">
          <Label>Wesprzyj nas</Label>
          <p className="tabular-nums">32 1870 1045 2078 1083 0313 0001</p>
          <p className="text-maszt-ink/70">Tytuł przelewu: Darowizna na cele statutowe</p>
        </div>
      </div>

      <div className="col-[2/14] mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-maszt-ink/15 pt-6 text-sm text-maszt-ink/60">
        <p>© {year} Fundacja Maszt</p>
        <p>Rybnik, Polska</p>
      </div>
    </footer>
  );
}
