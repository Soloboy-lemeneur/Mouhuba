"use client";

import { ETAPES, type Etape } from "@/lib/use-livre";
import { navigation } from "@/data/messages";
import { cn } from "@/lib/utils";

type ProprietesBarre = {
  etape: Etape;
  index: number;
  onAllerA: (etape: Etape) => void;
};

/**
 * Fil des cinq écrans, toujours visible en bas de page.
 * - Les écrans déjà consultés sont cliquables (retour immédiat).
 * - Les écrans pas encore découverts restent non cliquables : la surprise est préservée.
 */
export function BarreProgression({ etape, index, onAllerA }: ProprietesBarre) {
  return (
    <nav aria-label="Progression dans la surprise" className="w-full">
      <ol className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
        {ETAPES.map((valeur, position) => {
          const nom = navigation.etapes[position];
          const consulte = position < index;
          const courant = position === index;

          return (
            <li key={valeur} className="flex items-center gap-1.5 sm:gap-2.5">
              {consulte ? (
                <button
                  type="button"
                  onClick={() => onAllerA(valeur)}
                  title={`Revenir à l'écran ${position + 1} : ${nom}`}
                  aria-label={`Revenir à l'écran ${position + 1} sur ${ETAPES.length} : ${nom}`}
                  data-testid={`progression-${valeur}`}
                  className={cn(
                    "group flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full px-2.5",
                    "text-ink-muted transition-colors hover:bg-white/70 hover:text-ink-soft",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-rose-300 transition-transform group-hover:scale-125"
                  />
                  <span className="hidden text-xs font-semibold sm:inline">{nom}</span>
                </button>
              ) : (
                <span
                  role={courant ? "img" : undefined}
                  aria-label={
                    courant
                      ? `Écran ${position + 1} sur ${ETAPES.length} : ${nom} (écran affiché)`
                      : undefined
                  }
                  aria-hidden={courant ? undefined : "true"}
                  data-testid={courant ? `progression-actuelle-${valeur}` : undefined}
                  className={cn(
                    "flex h-11 items-center justify-center gap-2 px-2",
                    courant ? "text-rose-600" : "text-ink-muted/40",
                  )}
                >
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      courant ? "bg-rose-500 ring-4 ring-rose-200" : "bg-rose-200/70",
                    )}
                  />
                  <span className={cn("text-xs font-semibold", courant ? "inline" : "hidden sm:inline")}>
                    {nom}
                  </span>
                </span>
              )}
              {position < ETAPES.length - 1 ? (
                <span aria-hidden="true" className="h-px w-3 bg-rose-200 sm:w-6" />
              ) : null}
            </li>
          );
        })}
      </ol>
      {/* Message lu par les lecteurs d'écran à chaque changement d'écran. */}
      <p aria-live="polite" className="sr-only">
        {navigation.progression(index + 1, ETAPES.length)} : {navigation.etapes[index]}
        {etape === "cadeau" ? " — dernière étape" : ""}
      </p>
    </nav>
  );
}
