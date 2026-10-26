import type { Metadata } from "next";
import { Makieta } from "@/components/makieta/journey";

export const metadata: Metadata = {
  title: "Fundacja Maszt – makieta",
  robots: { index: false, follow: false },
};

export default function PrototypePage() {
  return <Makieta />;
}
