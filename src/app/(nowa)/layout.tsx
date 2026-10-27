import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalyticsConsent } from "@/components/GoogleAnalyticsConsent";

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-figtree",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Nowa wersja strony (na razie tylko /prototyp) ma własny główny layout: inną czcionkę, style, nagłówek i stopkę.
// Dzięki temu obecna strona (grupa (site)) wygląda dokładnie tak jak dotąd. Prototyp nie jest nigdzie linkowany
// i nie trafia do wyszukiwarek – zobaczy go tylko ktoś z bezpośrednim linkiem.
export const metadata: Metadata = {
  title: "Fundacja Maszt",
  description: "Strona internetowa Fundacji Maszt",
  robots: { index: false, follow: false },
};

export default function NewSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" data-scroll-behavior="smooth">
      <body className={`${figtree.variable} ${geistMono.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <SiteHeader />
        <main className="grow flex flex-col relative z-20 bg-[#e8e4df]">{children}</main>
        <SiteFooter />
        <CookieBanner />
        <GoogleAnalyticsConsent />
        <SmoothScroll />
      </body>
    </html>
  );
}
