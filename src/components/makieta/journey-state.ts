// Wspólny stan podróży po makiecie. Zmienny obiekt (bez Reacta), żeby pętla
// animacji nie wywoływała re-renderów – czyta go zarówno DOM, jak i scena 3D.
export const journey = {
  /** Postęp przewijania sekcji, 0–1 (bez wygładzenia). */
  target: 0,
  /** Wygładzony postęp, którym steruje się kamerą i panelami. */
  progress: 0,
};

export type Stop = {
  id: string;
  label: string;
  /** Zakres postępu, w którym kamera stoi przy przystanku i widać panel. */
  window: [number, number];
};

export const STOPS: Stop[] = [
  { id: "start", label: "Start", window: [0, 0.07] },
  { id: "energia", label: "Energia", window: [0.15, 0.26] },
  { id: "glos", label: "Głos młodych", window: [0.37, 0.48] },
  { id: "wspolnota", label: "Wspólnota", window: [0.57, 0.68] },
  { id: "zagle", label: "Pod żaglami", window: [0.75, 0.84] },
  { id: "maszt", label: "Maszt", window: [0.965, 1.01] },
];

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function smoothstep(a: number, b: number, v: number) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** 0–1: jak bardzo przystanek jest „aktywny” (z miękkim wejściem i wyjściem). */
export function stopWeight(stop: Stop, p: number, fade = 0.03) {
  const [a, b] = stop.window;
  // Pierwszy przystanek jest widoczny od razu, bez wejścia.
  const entry = a <= 0 ? 1 : smoothstep(a - fade, a + fade * 0.5, p);
  return Math.min(entry, 1 - smoothstep(b - fade * 0.5, b + fade, p));
}

/** Postęp wspinaczki na maszt w finale. */
export const climbProgress = (p: number) => smoothstep(0.885, 0.965, p);
/** Rozwinięcie flagi na szczycie masztu. */
export const flagProgress = (p: number) => smoothstep(0.955, 0.99, p);
