"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, type RefObject } from "react";
import type { ScreenId } from "@/data/messages";
import { useBalayage } from "./hooks";

/* ====================================================================================
   Navigation du « livre » en cinq écrans.
   - Les écrans ne sont pas des pages : tout se joue dans une seule page.
   - Un seul écran est affiché à la fois pour rester léger sur les téléphones.
   - L'adresse reste propre : seul `#ecran-xxx` est mis à jour (aucun rechargement).
   ==================================================================================== */

export const ETAPES = ["invitation", "mot", "galerie", "anniversaire", "cadeau"] as const;
export type Etape = ScreenId;
export type Direction = 1 | -1;

export function estEtape(valeur: string): valeur is Etape {
  return (ETAPES as readonly string[]).includes(valeur);
}

type Etat = { etape: Etape; direction: Direction };

type Action =
  { type: "aller"; cible: Etape } | { type: "suivante" } | { type: "precedente" } | { type: "recommencer" };

function reducteur(etat: Etat, action: Action): Etat {
  const indexCourant = ETAPES.indexOf(etat.etape);

  switch (action.type) {
    case "aller": {
      const cible = ETAPES.indexOf(action.cible);
      if (cible < 0 || cible === indexCourant) return etat;
      return { etape: action.cible, direction: cible > indexCourant ? 1 : -1 };
    }
    case "suivante": {
      if (indexCourant >= ETAPES.length - 1) return etat;
      return { etape: ETAPES[indexCourant + 1], direction: 1 };
    }
    case "precedente": {
      if (indexCourant <= 0) return etat;
      return { etape: ETAPES[indexCourant - 1], direction: -1 };
    }
    case "recommencer":
      return { etape: "invitation", direction: -1 };
    default:
      return etat;
  }
}

type OptionsLivre = {
  animationReduite: boolean;
  /** Écran affiché au chargement (permet aux tests et aux aperçus d'ouvrir un écran précis). */
  etapeInitiale?: Etape;
  /**
   * Référence du conteneur principal, fournie par le composant appelant.
   * Elle sert au défilement vers le haut et à l'écoute du clavier.
   */
  conteneurRef: RefObject<HTMLElement | null>;
};

export function useLivre({ animationReduite, etapeInitiale = "invitation", conteneurRef }: OptionsLivre) {
  const [etat, dispatch] = useReducer(reducteur, { etape: etapeInitiale, direction: 1 });
  const premierRendu = useRef(true);

  const { etape, direction } = etat;
  const index = ETAPES.indexOf(etape);

  /* --- Actions ---------------------------------------------------------------- */
  const suivante = useCallback(() => dispatch({ type: "suivante" }), []);
  const precedente = useCallback(() => dispatch({ type: "precedente" }), []);
  const recommencer = useCallback(() => dispatch({ type: "recommencer" }), []);
  const allerA = useCallback((cible: Etape) => dispatch({ type: "aller", cible }), []);

  /* --- Adresse : #ecran-mot, #ecran-galerie, … (sans rechargement) ------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cible = `#ecran-${etape}`;
    if (window.location.hash !== cible) {
      window.history.replaceState(null, "", cible);
    }
  }, [etape]);

  /* --- À chaque changement d'écran : remonter en haut et replacer le focus ----
     Le fait de redonner le focus au conteneur garantit que les flèches du clavier
     continuent de fonctionner, même quand le bouton cliqué vient d'être démonté. */
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: animationReduite ? "auto" : "smooth" });
    conteneurRef.current?.focus({ preventScroll: true });
  }, [etape, animationReduite, conteneurRef]);

  /* --- Navigation au clavier (flèches) à l'intérieur du livre ----------------- */
  useEffect(() => {
    const noeud = conteneurRef.current;
    if (!noeud) return;

    const surTouche = (evenement: KeyboardEvent) => {
      const cible = evenement.target as HTMLElement | null;
      // On n'intercepte pas la saisie dans un champ, ni les commandes d'une fenêtre modale.
      if (cible && cible.closest("input, textarea, select, [data-zone-balayage='non']")) return;
      // Ni les commandes de la galerie agrandie (Échap et flèches y servent aux photos).
      if (typeof document !== "undefined" && document.querySelector("[data-lightbox='ouvert']")) return;
      if (evenement.altKey || evenement.ctrlKey || evenement.metaKey) return;

      if (evenement.key === "ArrowRight" || evenement.key === "PageDown") {
        evenement.preventDefault();
        dispatch({ type: "suivante" });
      } else if (evenement.key === "ArrowLeft" || evenement.key === "PageUp") {
        evenement.preventDefault();
        dispatch({ type: "precedente" });
      }
    };

    noeud.addEventListener("keydown", surTouche as EventListener);
    return () => noeud.removeEventListener("keydown", surTouche as EventListener);
  }, [conteneurRef]);

  /* --- Balayage du doigt ------------------------------------------------------ */
  const gestesBalayage = useBalayage({ actif: true, surSuivant: suivante, surPrecedent: precedente });

  const attributsConteneur = useMemo(
    () => ({
      ...gestesBalayage,
      tabIndex: -1,
    }),
    [gestesBalayage],
  );

  return {
    etape,
    direction,
    index,
    total: ETAPES.length,
    suivante,
    precedente,
    recommencer,
    allerA,
    attributsConteneur,
  };
}
