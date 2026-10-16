"use client";

import { useRef } from "react";
import { useAnimationReduite } from "@/lib/hooks";
import { estEtape, useLivre } from "@/lib/use-livre";
import { FondDecore } from "@/components/ui/Decor";
import { BarreProgression } from "@/components/ui/BarreProgression";
import { Invitation } from "@/components/screens/Invitation";
import { Mot } from "@/components/screens/Mot";
import { Galerie } from "@/components/screens/Galerie";
import { Anniversaire } from "@/components/screens/Anniversaire";
import { Cadeau } from "@/components/screens/Cadeau";

/**
 * Le « livre » : orchestrateur des cinq écrans.
 * Un seul écran est monté à la fois (léger sur téléphone), avec une apparition en
 * fondu doux. La navigation est centralisée ici et partagée avec la barre de progression.
 */
type ProprietesLivre = {
  /**
   * Écran ouvert au chargement, via l'adresse : /?ecran=mot, /?ecran=galerie,
   * /?ecran=anniversaire, /?ecran=cadeau. Par défaut : l'invitation.
   * Pratique pour relire un écran précis ; une valeur inconnue est ignorée.
   */
  ecranInitial?: string;
};

export function LivreInteractif({ ecranInitial }: ProprietesLivre) {
  const animationReduite = useAnimationReduite();
  // La référence du conteneur vit ici (dans le composant) ; le crochet de navigation la reçoit.
  const conteneurRef = useRef<HTMLElement | null>(null);
  const livre = useLivre({
    animationReduite,
    conteneurRef,
    etapeInitiale: ecranInitial && estEtape(ecranInitial) ? ecranInitial : undefined,
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <FondDecore />

      <a
        href="#ecran-actif"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-soft"
      >
        Aller au contenu
      </a>

      <main
        id="ecran-actif"
        ref={conteneurRef}
        {...livre.attributsConteneur}
        className="flex flex-1 flex-col justify-center focus:outline-none"
      >
        {livre.etape === "invitation" ? <Invitation onOuvrir={livre.suivante} /> : null}

        {livre.etape === "mot" ? <Mot onSuivant={livre.suivante} onPrecedent={livre.precedente} /> : null}

        {livre.etape === "galerie" ? (
          <Galerie onSuivant={livre.suivante} onPrecedent={livre.precedente} />
        ) : null}

        {livre.etape === "anniversaire" ? (
          <Anniversaire onSuivant={livre.suivante} onPrecedent={livre.precedente} />
        ) : null}

        {livre.etape === "cadeau" ? (
          <Cadeau onRecommencer={livre.recommencer} onPrecedent={livre.precedente} />
        ) : null}
      </main>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 sm:px-6">
        <BarreProgression etape={livre.etape} index={livre.index} onAllerA={livre.allerA} />
        <p className="mt-3 text-center text-[0.72rem] text-ink-muted">Préparé avec soin, pour toi 🌸</p>
      </footer>
    </div>
  );
}
