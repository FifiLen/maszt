"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Sprawdzamy, czy użytkownik już zaakceptował ciasteczka
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
    
    // Inicjalizujemy zdarzenie dla Google Analytics
    window.dispatchEvent(new Event('cookieConsentAccepted'));
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#e8e4df] text-[#0f172a] p-4 sm:p-6 z-50 border-t border-[#3ead8f]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-sm md:text-base text-center sm:text-left flex-1 opacity-90">
          <strong>Szanujemy Twoją prywatność.</strong> Nasza strona używa niezbędnych plików cookie do prawidłowego działania. 
          Za Twoją zgodą chcielibyśmy używać również analitycznych plików cookie (Google Analytics), które pomagają nam badać ruch i ulepszać nasze działania.
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={declineCookies}
            className="px-5 py-2.5 text-sm font-medium rounded-full border border-[#0f172a]/20 hover:bg-[#0f172a]/5 transition-colors"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={acceptCookies}
            className="px-5 py-2.5 text-sm font-medium rounded-full bg-[#3ead8f] text-[#e8e4df] hover:bg-[#3ead8f]/90 transition-colors"
          >
            Akceptuj wszystkie
          </button>
        </div>
      </div>
    </div>
  );
}
