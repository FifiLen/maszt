import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AppwritePing } from "@/components/AppwritePing";

const generalSans = localFont({
  src: "../../public/GeneralSans_Complete/Fonts/WEB/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  display: "swap",
});

const clashGrotesk = localFont({
  src: "../../public/ClashGrotesk_Complete/Fonts/WEB/fonts/ClashGrotesk-Variable.woff2",
  variable: "--font-clash-grotesk",
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
        className={`${generalSans.variable} ${clashGrotesk.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <AppwritePing />
        <Header />
        <main className="grow flex flex-col relative z-20 bg-[#e8e4df]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
