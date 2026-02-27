import Link from 'next/link';
import data from '@/lib/data.json';
// Upewnij się, że te ścieżki zgadzają się z Twoimi folderami!
import { Header } from '@/components/layout/Header'; 
import { Hero } from '@/components/sections/hero';
import { Fillars } from '@/components/sections/fillars';
import { Team } from '@/components/sections/team';
import { Offer } from '@/components/sections/offert';
import { Projects } from '@/components/sections/projects';
import { JoinUs } from '@/components/sections/cta';
import { VisualBreak } from '@/components/sections/visual-break';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  // Bezpieczne pobranie danych
  const homeData = data.find(p => p.url === 'https://maszt.org' || p.url === 'https://maszt.org/');
  


  // Zescrapowane obszary z głównej strony
  const obszary = [
    { 
      tytul: "Zdrowie psychiczne", 
      tresc: "Zajmujemy się promocją dbania o zdrowie psychiczne, zdrowe warunki wychowawcze i zawodowe, przeciwdziałamy wypaleniu rodzicielskiemu, nadużywaniu substancji. Robimy to poprzez kampanie i zajęcia psychoedukacyjne. Organizujemy grupy wsparcia dla rodziców, osób zagrożonych wykluczeniem społecznym, osób chorych, mierzących się z kryzysem." 
    },
    { 
      tytul: "Aktywność obywatelska", 
      tresc: "Stawiamy na młodych ludzi i ich chęć do testowania własnych pomysłów. Mówiąc, że budujemy infrastrukturę, chcemy stać się organizacją parasolową dla grup nieformalnych, by pod naszymi żaglami mogli sięgać po granty, realizować swoje projekty i korzystać z naszego wsparcia administracyjnego, sprawozdawczego i księgowego." 
    },
    { 
      tytul: "Partycypacja młodych", 
      tresc: "Upominamy się o głos dzieci i młodzieży w debacie publicznej, edukacji oraz w domu. Podejmujemy się działań, które mają nauczyć dorosłych tworzenia warunków umożliwiających młodym ludziom wypowiedzenie się na każdy temat. Chcemy pokazać młodzieży, że ich głos jest ważny! Potrafimy ich nauczyć, jak w słowach i działaniach przekazać swoją energię, sprzeciw, marzenia tak, by mogli tym napędzać cały świat." 
    }
  ];

  // Sekcja Zespół / Testimoniale
  const team = [
    { autor: "Michał Naczyński (Fundacja MASZT)", cytat: "“MASZT to miejsce, dzięki któremu każdy może poczuć swoją wartość, zobaczyć, jak wielki i wielka wydaje się w oczach innych.”" },
    { autor: "Magdalena Kufka (Fundacja MASZT)", cytat: "“Łódź jest tak silna, jak bardzo zaangażowana w pracę jest jej cała załoga. MASZT dba o to, aby społeczeństwo wspólnie miało siłę płynąć tam, gdzie fale są najwyższe, a ekscytacja największa.”" },
    { autor: "Alicja Sobik-Lipus (Fundacja MASZT)", cytat: "“Gdy inni mają potrzebę działać, MASZT będzie stał za ich plecami i dawał oparcie, by pod wspólnym niebem robić to, co kochamy.”" },
    { autor: "Twój Wolontariusz / Aktywista", cytat: "“Od dawna szukał_m miejsca, które dało by mi przestrzeń i narzędzia do odkrywania siebie wśród innych ludzi. MASZT pozwolił mi doświadczyć, że się w tym spełniam!”" }
  ];

  // Oferta komercyjna
  const offerDesc = "Zamawiając usługę u nas wiesz, co dzieje się z Twoimi pieniędzmi. Masz możliwość podjąć decyzję, czy chcesz wesprzeć warsztaty dla rodziców dzieci w spektrum autyzmu, czy też projekt realizowany przez szkolne koło wolontariatu działające w dzielnicy, w której mieści się Twoja firma. Wybierając Fundację Maszt wybierasz ludzi, którzy otrzymają wiatr we własne żagle. Dla nas nie jesteś kolejną firmą, szkołą, czy urzędem, którego zlecenie realizujemy. Dla nas jesteś częścią społeczności, która wspólne buduje nasze społeczeństwo.";
  const offerBlocks = [
    { tytul: "Korporacje i firmy", desc: "Chcecie popracować nad komunikacją w zespole? Zająć się niską motywacją zespołu lub współpracą? Zobacz, dlaczego warto zrobić to z nami!" },
    { tytul: "Edukacja", desc: "Prelekcja dla rodziców? Szkolenie Rady? A może aktywizacja samorządu uczniowskiego? Jeśli chcecie rozpocząć proces partycypacji uczniów w Waszej szkole, u nas także znajdziecie na to przestrzeń!" },
    { tytul: "Instytucje publiczne i urzędy", desc: "Szkolenie dla pracowników? Problem wśród zespołu, który utrudnia pracę? A może szukacie sposobów na to, jak lepiej prowadzić dialog z mieszkańcami? Skontaktujcie się z nami!" }
  ];

  // Zescrapowane główne projekty
  const projects = [
    { title: "W kolorowych ramach", description: "Razem dla neuroróżnorodności Dołącz do projektu, który zmienia rzeczywistość osób z ADHD i w spektrum autyzmu! Razem edukujemy, wspieramy i budujemy społeczność otwartą na różnorodność.", image: "https://maszt.org/wp-content/uploads/2025/09/pl-v-finansowane-przez-unie-europejska-pos.jpg" },
    { title: "Załoga na pokład", description: "Fundacja Maszt realizuje projekt „Załoga na pokład”, finansowany przez Narodowy Instytut Wolności. Celem jest rozwój organizacji poprzez zwiększenie zaangażowania rybnickiej młodzieży w wolontariat, organizację warsztatów, promocję w lokalnej społeczności oraz stworzenie profesjonalnej identyfikacji wizualnej." },
    { title: "MAS-ZT", description: "Fundacja Maszt w partnerstwie z Urzędem Miasta Rybnika realizuje projekt „Młodzi, Aktywni, Samorządni – Zmieniamy Teraźniejszość” finansowany przez Narodowy Instytut Wolności w ramach programu NOWEFIO. Wysokość dotacji – 92 650,00 zł. MAS-ZT ma na celu rozwijanie kompetencji społecznych i obywatelskich młodzieży..." }
  ];

  return (
    // Dodałem relative, żeby Header absolute mógł na nim prawidłowo usiąść
    <main className="flex flex-col w-full text-black bg-white relative">
      
      {/* 1. Header idzie pierwszy, będzie unosił się nad Hero (wymaga przezroczystości lub białego tekstu) */}
      <Header theme="dark" />

      {/* 2. Nowe, czyste Hero (wywalamy prop scraperTitle) */}
      <Hero />

      {/* 3. Nowa sekcja: Trzy Filary */}
      <Fillars obszary={obszary} />

      {/* Team / Testimoniale "Jesteśmy dla Ciebie" */}
      <Team team={team} />

      {/* Visual Break - przerywnik oddechowy z luźnymi fotkami */}
      <VisualBreak />

      {/* Oferta Komercyjna */}
      <Offer offerDesc={offerDesc} offerBlocks={offerBlocks} />

      {/* Wybrane Projekty na stornie Głównej */}
      <Projects projects={projects} />



      {/* Ekstremalne Dolne CTA - Załoga (JoinUs) */}
      <JoinUs />

      <Contact />
    </main>
  );
}