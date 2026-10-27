import { cn } from "@/lib/utils";
import "./logo.css";

/**
 * Logo Fundacji Maszt złożone z trzech masek (łódka, maszt, napis), żeby każdą część kolorować osobno.
 * Łódka ma wysokość napisu. Klasa „logo-auto” robi logo białe, gdy pod nagłówkiem jest ciemne hero.
 */
export function Logo({ label, className }: { label?: string; className?: string }) {
  return (
    <span className={cn("maszt-logo", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <span className="maszt-logo-part maszt-logo-boat" />
      <span className="maszt-logo-part maszt-logo-mast" />
      <span className="maszt-logo-part maszt-logo-text" />
    </span>
  );
}
