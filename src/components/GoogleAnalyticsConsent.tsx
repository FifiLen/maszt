"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalyticsConsent() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Sprawdzamy na start, czy użytkownik już ma zaakceptowane ciasteczka
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "true") {
      setHasConsent(true);
    }

    // Nasłuchujemy na moment kliknięcia "Akceptuj" bez odświeżania strony
    const handleConsentChange = () => {
      if (localStorage.getItem("cookieConsent") === "true") {
        setHasConsent(true);
      }
    };
    
    window.addEventListener("cookieConsentAccepted", handleConsentChange);
    return () => window.removeEventListener("cookieConsentAccepted", handleConsentChange);
  }, []);

  if (!hasConsent) return null;

  return <GoogleAnalytics gaId="G-0R58Y6GKGZ" />;
}
