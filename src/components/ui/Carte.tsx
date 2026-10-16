import type { ReactNode } from "react";
import { Fleur } from "./Decor";
import { Scintillements } from "./Confettis";
import { cn } from "@/lib/utils";

/* ====================================================================================
   Éléments de mise en page partagés par les écrans.
   ==================================================================================== */

type ProprietesEcran = {
  id: string;
  children: ReactNode;
  className?: string;
  /** « large » : utile pour la galerie, qui respire mieux sur grand écran. */
  largeur?: "standard" | "large";
};

/** Conteneur d'un écran : largeur maîtrisée, marges confortables sur téléphone. */
export function Ecran({ id, children, className, largeur = "standard" }: ProprietesEcran) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 sm:py-12",
        largeur === "large" ? "max-w-5xl" : "max-w-3xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

type ProprietesCarte = {
  titre: string;
  surtitre?: string;
  icone?: ReactNode;
  children: ReactNode;
  className?: string;
  idTitre?: string;
};

/** Carte pastel aux coins arrondis, avec titre centré et petits ornements floraux. */
export function CarteEcran({ titre, surtitre, icone, children, className, idTitre }: ProprietesCarte) {
  return (
    <article className={cn("card-pastel relative overflow-hidden px-5 py-7 sm:px-9 sm:py-10", className)}>
      <Scintillements nombre={8} className="opacity-35" />

      <div className="relative">
        <header className="text-center">
          {icone ? (
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-rose-500 shadow-soft ring-1 ring-rose-100">
              {icone}
            </div>
          ) : null}

          {surtitre ? (
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-lavender-500">
              {surtitre}
            </p>
          ) : null}

          <h2 id={idTitre} className="mt-1 font-title text-[1.6rem] leading-snug text-ink sm:text-[2.1rem]">
            {titre}
          </h2>

          <div
            aria-hidden="true"
            className="mx-auto mt-3 flex items-center justify-center gap-2 text-rose-300"
          >
            <span className="h-px w-8 bg-current sm:w-12" />
            <Fleur className="h-3.5 w-3.5" />
            <span className="h-px w-8 bg-current sm:w-12" />
          </div>
        </header>

        <div className="mt-5 flex flex-col gap-4 text-[0.97rem] leading-[1.85] text-ink-soft sm:mt-6 sm:text-[1.04rem]">
          {children}
        </div>
      </div>
    </article>
  );
}

/** Barre d'actions d'un écran : pleine largeur sur téléphone, alignée sur grand écran. */
export function ActionsEcran({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mt-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
