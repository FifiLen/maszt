// Krótki opis projektów do nawigacji (mega-menu, menu mobilne).
// Treść stron projektów jest w src/content/projects.json – tu tylko skrót i daty.

export type ProjectSummary = {
  slug: string;
  name: string;
  period: string;
  /** Daty rozpoczęcia i zakończenia (RRRR-MM-DD) – „trwa” i postęp projektu w czasie. */
  startsOn: string;
  endsOn: string;
  lead: string;
};

const PROJECTS: ProjectSummary[] = [
  { slug: "young-minds-real-change", startsOn: "2026-06-01", name: "Young Minds, Real Change", period: "VI–XII 2026", endsOn: "2026-12-31", lead: "Zdrowie młodych – bez moralizowania i straszenia" },
  { slug: "biegne-dla-zdrowej-glowy", startsOn: "2026-09-01", name: "Biegnę dla zdrowej głowy", period: "IX–X 2026", endsOn: "2026-10-18", lead: "Młodzieżowi wolontariusze uczą się wspierać rówieśników" },
  { slug: "mas-zt", startsOn: "2025-04-07", name: "MAS-ZT", period: "IV 2025 – VII 2026", endsOn: "2026-07-31", lead: "Samorządy uczniowskie pięciu rybnickich szkół" },
  { slug: "w-kolorowych-ramach", startsOn: "2025-01-01", name: "W kolorowych ramach", period: "2025", endsOn: "2025-12-31", lead: "Razem dla neuroróżnorodności" },
  { slug: "zaloga-na-poklad", startsOn: "2025-04-01", name: "Załoga na pokład", period: "IV–X 2025", endsOn: "2025-10-31", lead: "Wolontariat długoterminowy młodzieży" },
  { slug: "pierwsza-pomoc-przedpsychologiczna", startsOn: "2025-01-06", name: "Pierwsza Pomoc przedPsychologiczna", period: "I–VI 2025", endsOn: "2025-06-30", lead: "Patrz, słuchaj, łącz – wsparcie rówieśnicze" },
  { slug: "rodzinny-restart", startsOn: "2025-01-06", name: "Rodzinny restart", period: "2025", endsOn: "2025-06-30", lead: "Warsztaty dla rodziców nastolatków" },
  { slug: "milosc-na-cztery-lapy", startsOn: "2025-02-01", name: "Miłość na cztery łapy", period: "II 2025", endsOn: "2025-02-28", lead: "Akcja czwórki 14-latków dla schroniska" },
  { slug: "godomy-o-edukacji", startsOn: "2024-01-01", name: "Godomy o edukacji", period: "2024", endsOn: "2024-12-31", lead: "Debata o samorządności uczniów" },
];

/** Projekty od trwających i najnowszych. */
export function projectIndex(today: string | null) {
  return [...PROJECTS].sort((a, b) => {
    const ongoing = (p: ProjectSummary) => (today && p.endsOn >= today ? 1 : 0);
    return ongoing(b) - ongoing(a) || b.endsOn.localeCompare(a.endsOn);
  });
}

export const isOngoing = (project: ProjectSummary, today: string | null) => Boolean(today && project.endsOn >= today);

/** Jaka część czasu trwania projektu już minęła (0–1). */
export function elapsed(project: ProjectSummary, today: string) {
  const start = Date.parse(project.startsOn);
  const end = Date.parse(project.endsOn);
  return Math.min(1, Math.max(0, (Date.parse(today) - start) / (end - start)));
}
