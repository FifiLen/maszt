export type ProjectContentBlock = {
  __component: string;
  [key: string]: unknown;
};

export type StaticProjectFallback = {
  projectTitle: string;
  projectSlug: string;
  blocks: ProjectContentBlock[];
};

const PROJECT_SLUG = "w-kolorowych-ramach";
const MAS_ZT_PROJECT_SLUG = "mas-zt";
export const STATIC_PROJECT_SLUGS = [PROJECT_SLUG] as const;

const projectSummary: ProjectContentBlock = {
  __component: "section.text-block",
  heading: "O projekcie",
  content:
    "Razem dla neuroróżnorodności! Razem edukowaliśmy, wspieraliśmy i budowaliśmy społeczność otwartą na różnorodność. To był projekt dla młodzieży, rodziców, nauczycieli, seniorów i wszystkich zainteresowanych tematyką inkluzji.",
};

const projectResults: ProjectContentBlock = {
  __component: "section.features",
  heading: "Zrobiliśmy",
  subheading: "Rezultaty projektu",
  items: [
    {
      title: "Edukacja bez barier",
      description:
        "W naszych social mediach pojawiły się [rolki tłumaczące tematykę ADHD i ASD](https://www.instagram.com/stories/highlights/18152377645416909).\n\nMożna także posłuchać dwóch wywiadów ze specjalistkami: [pierwszego wywiadu](https://youtu.be/1DsvwfqPvus?si=ZCWZLJ6Wv7AeHRts) i [drugiego wywiadu](https://youtu.be/QcrVY1_vVkw?si=HwVSJk_q1qMIql92).\n\nPowstały również dwie animacje pokazujące rzeczywistość osób neuroatypowych: [pierwsza animacja](https://youtu.be/R1Drn_nIB3A?si=YFOARRKP4xBfYvFg) i [druga animacja](https://youtu.be/mONViGtCE24?si=C1GOcHRzV28kk8bk).",
    },
    {
      title: "Warsztaty i konferencja",
      description:
        "Zorganizowaliśmy warsztaty dla seniorów i rodziców, a także współtworzyliśmy rybnicki Dzień Świadomości Autyzmu. Podczas konferencji nauczyciele i rodzice mogli zwiększyć swoją wiedzę i zrozumienie neuroatypowości.",
    },
    {
      title: "Głos osób neuroatypowych",
      description:
        "Powstała publikacja [„Neuroatypowi. Sami o sobie”](/pobrane_pliki/neuroatypowi-sami-o-sobie.pdf). Przeprowadziliśmy wywiady z 15 osobami samorzeczniczymi!",
    },
  ],
};

const resourcesLibrary: ProjectContentBlock = {
  __component: "section.resources-library",
  heading: "Materiały o\nneuro­różnorodności",
  intro:
    "Wybraliśmy publikacje, filmy i podcasty, które pomagają lepiej rozumieć ADHD, ASD oraz codzienność osób neuroatypowych.",
  items: [
    {
      title: "Neuroróżnorodni. Przewodnik",
      type: "publication",
      source: "Sosenki",
      url: "https://sosenki.pl/wp-content/uploads/2023/03/Neuroroznorodni.-Przewodnik.-Marzec-2023.pdf",
    },
    {
      title: "Neuroróżnorodni — nr 1/2021",
      type: "publication",
      source: "ZPSW Kielce",
      url: "https://zpsw.kielce.eu/sites/default/files/pliki/2021/04/neuroroznorodni-nr-1-2021.pdf",
    },
    {
      title: "ADHD u dorosłych — jak wygląda i jak sobie z nim radzić?",
      type: "video",
      source: "YouTube",
      url: "https://youtu.be/B19kvETLDPM?si=9mdm8FtRxC5vNbob",
    },
    {
      title: "Neuroróżnorodność a neuroatypowość",
      type: "publication",
      source: "Wspieranie Relacji",
      url: "https://wspieranierelacji.pl/wp-content/uploads/2025/06/13-Neuroroznorodnosc-a-neuro-a-typowosc.pdf",
    },
    {
      title: "Dzieci w świecie neuroróżnorodności — materiały dla nauczycieli",
      type: "publication",
      source: "Instytut Badań Edukacyjnych",
      url: "https://www.ibe.edu.pl/images/badania/Tranzycja-_Kariera_bez_barier/13_06_24_Dzieci_w_%C5%9Bwiecie_neuror%C3%B3%C5%BCnorodno%C5%9Bci_nauczyciele.pdf",
    },
    {
      title: "Film o neuroróżnorodności",
      type: "video",
      source: "YouTube",
      url: "https://youtu.be/ozO-nHkouiI?si=xtEmW_cGGrDR4ToW",
    },
    {
      title: "Autyzm wprowadza zmysły w błąd — zachowania",
      type: "video",
      source: "YouTube",
      url: "https://youtu.be/vzr5VjpHHW4?si=s91iZTFQ4D_JuSpu",
    },
    {
      title: "O neuroróżnorodności — rozmowa z prof. Bąblem",
      type: "publication",
      source: "Uniwersytet Jagielloński / Newsweek",
      url: "https://phils.uj.edu.pl/documents/41606/156574826/Newsweek+extra+20240701+O+neror%C3%B3%C5%BCnorodno%C5%9Bci+-+rozmowa+z+prof.+B%C4%85blem.pdf/f65eb7f7-2864-44d8-a79f-65329b301873",
    },
    {
      title: "Neuroróżnorodność",
      type: "publication",
      source: "Profilaktyka w Małopolsce",
      url: "https://www.profilaktykawmalopolsce.pl/images/pdf/Zdrowie_Psychiczne/Ty_decydujesz_23_24/12_Artykul_nr_2_Neuroroznorodnosc.pdf",
    },
    {
      title: "Problemy i potrzeby uczniów neuroatypowych",
      type: "publication",
      source: "Fundacja JiM",
      url: "https://jim.org/app/uploads/2025/05/Problemy-i-potrzeby-uczniow-neuroatypowych.pdf",
    },
    {
      title: "Integracja — wydanie poświęcone neuroróżnorodności",
      type: "publication",
      source: "Integracja",
      url: "https://integracja.org/wp-content/uploads/2026/02/0126-Integracja-podstawowy-pdf.pdf",
    },
    {
      title: "Student neuroróżnorodny w procesie studiowania",
      type: "publication",
      source: "ASBiR",
      url: "https://asbir.pl/wp-content/uploads/2024/06/Pachowicz-M.-2023-Student-Neuroroznorodny-w-procesie-studiowania.-Podrecznik-dobrych-praktyk.pdf",
    },
    {
      title: "ADHD u dorosłych",
      type: "podcast",
      source: "Spotify",
      url: "https://open.spotify.com/episode/44ESKmdBd0YbTypNZp6Ygh",
    },
    {
      title: "Podcasty o autyzmie",
      type: "podcast",
      source: "Autyzm po ludzku",
      url: "https://www.autyzmpoludzku.pl/2023/09/01/podcasty/",
    },
    {
      title: "Jan Gawroński: Neuroróżnorodność — moje życie, mój świat",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=glzv7I-KCNk",
    },
  ],
};

const projectDownloads: ProjectContentBlock = {
  __component: "section.downloads",
  heading: "Dokumenty z projektu",
  files: [
    {
      fileName: "Publikacja pokonferencyjna",
      fileFormat: "PDF",
      url: "/media/documents/6a0b09fb002cddc69bd5-publikacja-pokonferencyjna.pdf",
    },
    {
      fileName: "Neuroatypowi. Sami o sobie",
      fileFormat: "PDF",
      url: "/pobrane_pliki/neuroatypowi-sami-o-sobie.pdf",
    },
  ],
};

const masZtPodcast: ProjectContentBlock = {
  __component: "section.text-block",
  heading: "Podcast młodzieży",
  content:
    "W ramach projektu młodzież założyła i prowadziła własny podcast. [Posłuchaj podcastu na Spotify](https://open.spotify.com/show/0PHZEVW4ejkxOYqBmlRhWa?si=3e19f3c204c04a5a).",
};

const masZtDownloads: ProjectContentBlock = {
  __component: "section.downloads",
  heading: "Materiały z projektu",
  files: [
    {
      fileName: "Samorządność – materiały dla młodzieży",
      fileFormat: "XLSX",
      url: "/media/documents/samorzadnosc-materialy-dla-mlodziezy-2026-07.xlsx",
    },
    {
      fileName: "Koalicja NGO dla Edukacji Obywatelskiej",
      fileFormat: "XLSX",
      url: "/media/documents/koalicja-ngo-dla-edukacji-obywatelskiej-2026-07.xlsx",
    },
  ],
};

const staticFallback: StaticProjectFallback = {
  projectTitle: "W kolorowych ramach",
  projectSlug: PROJECT_SLUG,
  blocks: [
    {
      __component: "section.funding-banner",
      content:
        "Projekt jest realizowany w ramach Projektu Solidarności Europejskiego Korpusu Solidarności.",
      images: [
        {
          alt: "Finansowane przez Unię Europejską",
          url: "/media/images/69c2f8b1002ad11255a3-finansowane-ue-fundacja.jpg",
        },
      ],
    },
    {
      __component: "section.full-image",
      image: {
        alt: "W Kolorowych Ramach",
        url: "/media/images/69c2a44a0017a6777604-fundacja-bg.jpg",
      },
    },
    projectSummary,
    projectResults,
    resourcesLibrary,
    projectDownloads,
  ],
};

export function getStaticProjectFallback(
  slug: string,
): StaticProjectFallback | null {
  return slug === PROJECT_SLUG ? staticFallback : null;
}

export function applyProjectContentOverrides(
  slug: string,
  blocks: ProjectContentBlock[],
): ProjectContentBlock[] {
  if (slug === MAS_ZT_PROJECT_SLUG) {
    const updatedBlocks: ProjectContentBlock[] = [];
    let podcastAdded = false;

    for (const block of blocks) {
      if (
        block.__component === "section.recruitment-hub" ||
        block.__component === "section.downloads"
      ) {
        continue;
      }

      if (block.__component === "section.contact-footer" && !podcastAdded) {
        updatedBlocks.push(masZtDownloads);
        updatedBlocks.push(masZtPodcast);
        podcastAdded = true;
      }

      updatedBlocks.push(block);
    }

    if (!podcastAdded) {
      updatedBlocks.push(masZtDownloads);
      updatedBlocks.push(masZtPodcast);
    }

    return updatedBlocks;
  }

  if (slug !== PROJECT_SLUG) return blocks;

  const removableComponents = new Set([
    "section.benefits",
    "section.call-to-action-list",
    "section.recruitment-hub",
    "section.resources-library",
  ]);

  let summaryAdded = false;
  let resultsAdded = false;
  let resourcesAdded = false;
  const updatedBlocks: ProjectContentBlock[] = [];

  for (const block of blocks) {
    if (removableComponents.has(block.__component)) continue;

    if (block.__component === "section.text-block" && !summaryAdded) {
      updatedBlocks.push(projectSummary);
      summaryAdded = true;
      continue;
    }

    if (block.__component === "section.features" && !resultsAdded) {
      updatedBlocks.push(projectResults);
      resultsAdded = true;
      continue;
    }

    if (block.__component === "section.downloads" && !resourcesAdded) {
      updatedBlocks.push(resourcesLibrary);
      resourcesAdded = true;
    }

    updatedBlocks.push(block);
  }

  if (!summaryAdded) updatedBlocks.push(projectSummary);
  if (!resultsAdded) updatedBlocks.push(projectResults);
  if (!resourcesAdded) updatedBlocks.push(resourcesLibrary);

  return updatedBlocks;
}
