// Ujęcia kamery. Przystanki mają dwa klucze (wejście i wyjście z postoju) z zerową prędkością,
// klucze „przelotowe” zachowują prędkość – kamera płynnie sunie wzdłuż przewodów.

type Key = {
  at: number;
  target: [number, number, number];
  /** Azymut w stopniach (0 = od strony +z), elewacja w stopniach, dystans. */
  az: number;
  el: number;
  dist: number;
  /** Przesunięcie kadru w poziomie (ułamek szerokości) – robi miejsce na panel tekstu. */
  shift: number;
  hold?: boolean;
};

const station = (from: number, to: number, k: Omit<Key, "at" | "hold">): Key[] => [
  { ...k, at: from, hold: true },
  { ...k, at: to, hold: true },
];

const KEYS: Key[] = [
  ...station(0, 0.06, { target: [-1, 0, 2], az: 36, el: 48, dist: 72, shift: 0.1 }),
  ...station(0.15, 0.25, { target: [-14, 3, -15], az: 38, el: 30, dist: 40, shift: 0.2 }),
  { at: 0.31, target: [-8.5, 0, -2.5], az: 70, el: 24, dist: 13, shift: 0.06 },
  ...station(0.37, 0.47, { target: [-10.2, 1.1, 4.6], az: 26, el: 26, dist: 19, shift: 0.2 }),
  { at: 0.525, target: [-1, 0, 9.5], az: 72, el: 17, dist: 10, shift: 0.06 },
  ...station(0.57, 0.67, { target: [4, 0.6, 4.8], az: 32, el: 40, dist: 16, shift: 0.2 }),
  { at: 0.715, target: [9.5, 0, 10.5], az: 76, el: 18, dist: 10, shift: 0.06 },
  ...station(0.75, 0.83, { target: [15.5, 1.4, 8], az: 26, el: 29, dist: 18, shift: 0.2 }),
  { at: 0.875, target: [11, 1, 18.5], az: 38, el: 38, dist: 24, shift: 0.08 },
  { at: 0.905, target: [12.4, 2.6, 22.5], az: 42, el: 14, dist: 22, shift: 0.12 },
  ...station(0.975, 1, { target: [12.4, 5, 22.5], az: 52, el: 9, dist: 31, shift: 0.17 }),
];

const FIELDS = 7;
const pack = (k: Key) => [k.target[0], k.target[1], k.target[2], k.az, k.el, k.dist, k.shift];
const values = KEYS.map(pack);

// Styczne Hermite'a: zero na przystankach, średnia prędkość na kluczach przelotowych.
const tangents = KEYS.map((k, i) => {
  if (k.hold || i === 0 || i === KEYS.length - 1) return new Array(FIELDS).fill(0);
  const prev = KEYS[i - 1];
  const next = KEYS[i + 1];
  return values[i].map((_, f) => (values[i + 1][f] - values[i - 1][f]) / (next.at - prev.at));
});

export type CameraShot = {
  target: [number, number, number];
  az: number;
  el: number;
  dist: number;
  shift: number;
};

export function cameraAt(p: number): CameraShot {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].at) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const h = b.at - a.at;
  const t = Math.min(1, Math.max(0, (p - a.at) / h));
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  const v = values[i].map(
    (va, f) => h00 * va + h10 * h * tangents[i][f] + h01 * values[i + 1][f] + h11 * h * tangents[i + 1][f],
  );
  return { target: [v[0], v[1], v[2]], az: v[3], el: v[4], dist: v[5], shift: v[6] };
}
