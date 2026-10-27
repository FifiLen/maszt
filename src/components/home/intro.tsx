import type { CSSProperties } from "react";
import "./home.css";

const STORY =
  "Fundację Maszt powołało Centrum Psychoterapii i Psychiatrii CognitivaMed. Pomagając ludziom w kryzysie i chorobie, widzimy, jak bardzo dzieci, młodzież i dorośli cierpią z poczucia, że nie są wystarczający – i jak trudno im znaleźć miejsce, w którym mogliby się sprawdzić.";

const WHY =
  "Samostanowienie, sprawczość i wspólnota pozwalają doświadczać bycia wartościowym człowiekiem. Chcemy, żeby w naszej lokalnej społeczności każdy mógł odkryć je w sobie.";

const words = STORY.split(" ");

/**
 * „Skąd się wzięliśmy”: fioletowa sekcja wjeżdża na hero, a treść stoi przypięta, póki nie przykryje jej makieta.
 * Słowa rozjaśniają się w takt przewijania (home.css) – bez JS, w przeglądarkach bez tej funkcji po prostu są białe.
 */
export function Intro() {
  return (
    <section
      id="o-fundacji"
      data-header="purple"
      className="intro relative z-10 h-[300svh] rounded-t-[2rem] bg-maszt-purple text-white shadow-[0_-30px_60px_-20px_rgb(0_0_0/0.35)] lg:rounded-t-[2.5rem]"
    >
      <div className="grid-site sticky top-0 h-svh grid-rows-[1fr_auto] pb-10 pt-28 lg:pb-14 lg:pt-36">
        <h2 className="col-[2/14] self-center text-[clamp(1.6rem,3.3vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:col-[2/13]">
          {words.map((word, i) => (
            <span key={i} className="intro-word" style={{ "--i": (i / (words.length - 1)) * 100 } as CSSProperties}>
              {word}{" "}
            </span>
          ))}
        </h2>

        <div className="intro-fade col-[2/14] grid gap-4 border-t border-white/25 pt-5 md:grid-cols-12 md:gap-5">
          <p className="text-sm font-medium md:col-span-4">Po co jesteśmy</p>
          <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-white/80 md:col-span-6 md:col-start-7 lg:text-base">{WHY}</p>
        </div>
      </div>
    </section>
  );
}
