import type { SVGProps } from "react";

/* ====================================================================================
   Petits éléments décoratifs dessinés en SVG (aucun fichier image, donc aucun poids
   réseau supplémentaire). Tous sont décoratifs : aria-hidden="true".
   ==================================================================================== */

export function Fleur({ className, ...reste }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...reste}>
      <g fill="currentColor" opacity="0.95">
        <ellipse cx="12" cy="6" rx="3.4" ry="4.6" />
        <ellipse cx="12" cy="18" rx="3.4" ry="4.6" />
        <ellipse cx="6" cy="12" rx="4.6" ry="3.4" />
        <ellipse cx="18" cy="12" rx="4.6" ry="3.4" />
        <ellipse cx="7.8" cy="7.8" rx="3" ry="3.6" transform="rotate(-45 7.8 7.8)" />
        <ellipse cx="16.2" cy="7.8" rx="3" ry="3.6" transform="rotate(45 16.2 7.8)" />
        <ellipse cx="7.8" cy="16.2" rx="3" ry="3.6" transform="rotate(45 7.8 16.2)" />
        <ellipse cx="16.2" cy="16.2" rx="3" ry="3.6" transform="rotate(-45 16.2 16.2)" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="#fff8ec" />
    </svg>
  );
}

export function Tulipe({ className, ...reste }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...reste}>
      <path
        d="M4 8c0 5.2 3.6 9 8 9s8-3.8 8-9c-1.7 1.4-3 .6-4-1.6-1.3 1.6-2.6 1.3-4-.4-1.4 1.7-2.7 2-4 .4-1 2.2-2.3 3-4 1.6Z"
        fill="currentColor"
      />
      <path d="M12 17v5" stroke="#c9a27f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 20.5c-1.6-.4-2.8-1.4-3.4-2.8 1.8-.3 3 .6 3.4 2.8Z" fill="#b7d9b1" />
    </svg>
  );
}

export function Etoile({ className, ...reste }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...reste}>
      <path
        d="M12 1.8c.6 4.6 1.6 6.9 3.3 8.4 1.6 1.4 3.9 1.5 6.9 1.8-3 .3-5.3.4-6.9 1.8-1.7 1.5-2.7 3.8-3.3 8.4-.6-4.6-1.6-6.9-3.3-8.4C7 12.4 4.7 12.3 1.8 12c3-.3 5.3-.4 6.9-1.8C10.4 8.7 11.4 6.4 12 1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Coeur({ className, ...reste }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...reste}>
      <path
        d="M12 20.4s-7.8-4.7-7.8-10.2A4.5 4.5 0 0 1 12 7.3a4.5 4.5 0 0 1 7.8 2.9c0 5.5-7.8 10.2-7.8 10.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

type ProprietesFondDecore = {
  /** Intensité globale du décor (0 → invisible, 1 → bien présent). */
  intensite?: number;
  className?: string;
};

/**
 * Couche décorative fixe : quelques fleurs, étoiles et cœurs très pâles qui flottent
 * doucement. Purement esthétique, non interactif, invisible pour les lecteurs d'écran.
 */
export function FondDecore({ intensite = 1, className }: ProprietesFondDecore) {
  const elements = [
    { Element: Fleur, classe: "left-[6%] top-[12%] h-8 w-8 text-rose-200 animate-float-slow" },
    { Element: Etoile, classe: "left-[20%] top-[6%] h-4 w-4 text-lavender-300 animate-twinkle" },
    { Element: Coeur, classe: "right-[9%] top-[16%] h-5 w-5 text-peach-300 animate-float-mid" },
    { Element: Tulipe, classe: "right-[16%] bottom-[14%] h-9 w-9 text-rose-200 animate-float-slow" },
    { Element: Etoile, classe: "left-[12%] bottom-[18%] h-5 w-5 text-peach-300 animate-twinkle" },
    { Element: Fleur, classe: "right-[4%] bottom-[38%] h-6 w-6 text-lavender-200 animate-float-mid" },
    { Element: Etoile, classe: "left-[46%] top-[3%] h-3.5 w-3.5 text-rose-300 animate-twinkle" },
    { Element: Coeur, classe: "left-[76%] bottom-[8%] h-4 w-4 text-rose-200 animate-float-slow" },
  ] as const;

  return (
    <div
      aria-hidden="true"
      style={{ opacity: 0.75 * intensite }}
      className={className ?? "pointer-events-none fixed inset-0 -z-10 overflow-hidden"}
    >
      {elements.map(({ Element, classe }, index) => (
        <Element key={index} className={`absolute ${classe}`} />
      ))}
    </div>
  );
}
