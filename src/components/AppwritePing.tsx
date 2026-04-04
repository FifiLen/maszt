"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite";

/**
 * Invisible component that pings the Appwrite backend on app startup
 * to verify the SDK setup. Rendered once in the root layout.
 */
export function AppwritePing() {
  useEffect(() => {
    client.ping().then(() => {
      console.log("[Appwrite] Ping successful — backend is reachable.");
    }).catch((err) => {
      console.error("[Appwrite] Ping failed:", err);
    });
  }, []);

  return null;
}
