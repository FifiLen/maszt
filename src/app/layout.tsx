import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AppwritePing } from "@/components/AppwritePing";
import { CookieBanner } from "@/components/CookieBanner";
import { GoogleAnalyticsConsent } from "@/components/GoogleAnalyticsConsent";

const firaSans = Fira_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fundacja Maszt",
  description: "Strona internetowa Fundacji Maszt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${firaSans.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <AppwritePing />
        <Header />
        <main className="grow flex flex-col relative z-20 bg-[#e8e4df]">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <GoogleAnalyticsConsent />
      </body>
    </html>
  );
}
