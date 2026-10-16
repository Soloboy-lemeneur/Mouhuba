"use client";

import { cadeau } from "@/data/messages";
import { cn } from "@/lib/utils";

export type PhaseCadeau = "fermee" | "secousse" | "ouverture" | "ouverte";

type ProprietesBoite = {
  phase: PhaseCadeau;
  onOuvrir: () => void;
};

/**
 * Boîte cadeau dessinée entièrement en SVG (aucune image à charger).
 * - Fermée : la boîte flotte doucement et clignote d'un halo pour inviter au clic.
 * - À l'ouverture : elle tremble légèrement, puis le couvercle s'envole.
 * - Elle est actionnable à la souris, au doigt et au clavier (Entrée / Espace).
 */
export function BoiteCadeau({ phase, onOuvrir }: ProprietesBoite) {
  const ouverte = phase === "ouverte" || phase === "ouverture";
  const consigne = ouverte ? cadeau.consigneOuvert : cadeau.consigne;

  return (
    /* « scène » du cadeau : une hauteur minimale réserve en permanence la place
       nécessaire à l'envol du couvercle. Celui-ci ne peut donc jamais recouvrir
       le titre, quelle que soit la taille de l'écran. La boîte est alignée en bas. */
    <div className="relative mt-4 flex min-h-[15.5rem] w-full flex-col items-center justify-end sm:mt-6 sm:min-h-[19rem]">
      {/* Halo doux derrière la boîte. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-24 h-40 w-40 rounded-full bg-rose-200/55 blur-3xl sm:h-52 sm:w-52",
          !ouverte ? "animate-float-slow" : "opacity-70",
        )}
      />

      <button
        type="button"
        onClick={onOuvrir}
        disabled={ouverte}
        aria-expanded={ouverte}
        aria-label="Ouvrir le cadeau"
        aria-describedby="consigne-cadeau"
        data-testid="boite-cadeau"
        data-phase={phase}
        className={cn(
          "group relative rounded-[1.75rem] p-1.5 transition-transform duration-300",
          "focus-visible:outline-3 focus-visible:outline-offset-6 focus-visible:outline-lavender-500",
          !ouverte ? "cursor-pointer hover:-translate-y-1 active:scale-[0.98]" : "cursor-default",
        )}
      >
        <span
          className={cn(
            "block w-[11rem] sm:w-[13.5rem]",
            phase === "fermee" && "animate-float-mid",
            phase === "secousse" && "animate-box-shake",
          )}
        >
          <svg
            viewBox="0 0 240 205"
            className="h-auto w-full overflow-visible drop-shadow-[0_18px_24px_rgba(168,105,132,0.28)]"
          >
            <defs>
              <linearGradient id="cadeau-corps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffc9dd" />
                <stop offset="55%" stopColor="#f8a3c0" />
                <stop offset="100%" stopColor="#e37da2" />
              </linearGradient>
              <linearGradient id="cadeau-couvercle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffdfc8" />
                <stop offset="100%" stopColor="#f9ab7c" />
              </linearGradient>
              <linearGradient id="cadeau-ruban" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff3e2" />
                <stop offset="100%" stopColor="#ffd6b0" />
              </linearGradient>
            </defs>

            {/* Ombre au sol */}
            <ellipse cx="120" cy="197" rx="84" ry="10" fill="rgba(131,47,80,0.16)" />

            {/* Corps de la boîte */}
            <rect x="34" y="90" width="172" height="102" rx="16" fill="url(#cadeau-corps)" />
            <rect
              x="34"
              y="90"
              width="172"
              height="102"
              rx="16"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
            />
            {/* Ruban vertical */}
            <rect x="106" y="90" width="28" height="102" fill="url(#cadeau-ruban)" opacity="0.95" />
            {/* Reflet */}
            <rect x="46" y="102" width="18" height="76" rx="9" fill="rgba(255,255,255,0.32)" />

            {/* Couvercle animé */}
            <g
              className="svg-transform-centre"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {/* L'animation démarre avec l'ouverture et RESTE appliquée ensuite :
                  grâce à « animation-fill-mode: both », le couvercle garde sa position
                  finale au lieu de retomber une fois le mouvement terminé. */}
              <g className={ouverte ? "animate-lid-open" : undefined}>
                <g
                  className="svg-transform-centre"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {/* Nœud */}
                  <path d="M118 62c-8-26-36-30-41-15-4 13 22 18 41 15Z" fill="#f9ab7c" />
                  <path d="M122 62c8-26 36-30 41-15 4 13-22 18-41 15Z" fill="#ffc9a4" />
                  <circle cx="120" cy="60" r="8.5" fill="#e68d59" />
                  <circle
                    cx="120"
                    cy="60"
                    r="8.5"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.2"
                  />
                  {/* Couvercle */}
                  <rect x="20" y="64" width="200" height="40" rx="13" fill="url(#cadeau-couvercle)" />
                  <rect
                    x="20"
                    y="64"
                    width="200"
                    height="40"
                    rx="13"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.5"
                  />
                  <rect x="104" y="64" width="32" height="40" fill="url(#cadeau-ruban)" opacity="0.95" />
                </g>
              </g>
            </g>

            {/* Petites étincelles décoratives autour de la boîte */}
            <g fill="#fff8ec" opacity="0.95">
              <path d="M18 44c1.2 5.6 2.6 8.2 5.4 9.8-2.8 1.6-4.2 4.2-5.4 9.8-1.2-5.6-2.6-8.2-5.4-9.8 2.8-1.6 4.2-4.2 5.4-9.8Z" />
              <path d="M226 78c1 4.6 2.2 6.8 4.6 8.2-2.4 1.4-3.6 3.6-4.6 8.2-1-4.6-2.2-6.8-4.6-8.2 2.4-1.4 3.4-3.6 4.6-8.2Z" />
            </g>
          </svg>
        </span>
      </button>

      <p
        id="consigne-cadeau"
        data-testid="consigne-cadeau"
        className={cn(
          "mt-4 text-center text-sm font-semibold",
          ouverte ? "text-rose-600" : "animate-pulse text-ink-soft",
        )}
      >
        {consigne}
      </p>
    </div>
  );
}
