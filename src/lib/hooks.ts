"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animationsReduitesPreferees, entierAleatoire } from "./utils";

/* ====================================================================================
   Crochets réutilisables (aucune bibliothèque externe).
   ==================================================================================== */

/**
 * Détecte la préférence « réduire les animations » et se met à jour si l'utilisateur
 * la change pendant la consultation. Utilisé pour désactiver confettis et mouvements.
 */
const REQUETE_MOUVEMENT = "(prefers-reduced-motion: reduce)";

export function useAnimationReduite(): boolean {
  const souscrire = useCallback((rappel: () => void) => {
    if (typeof window.matchMedia !== "function") return () => {};
    const requete = window.matchMedia(REQUETE_MOUVEMENT);
    requete.addEventListener("change", rappel);
    return () => requete.removeEventListener("change", rappel);
  }, []);

  const lire = useCallback(() => animationsReduitesPreferees(), []);

  // Côté serveur (et avant l'hydratation), on suppose « pas de réduction »
  // puis la valeur réelle du navigateur prend le relais sans erreur d'hydratation.
  return useSyncExternalStore(souscrire, lire, () => false);
}

/** Bloque le défilement de la page (utilisé quand la galerie agrandie est ouverte). */
export function useVerrouDefilement(actif: boolean): void {
  useEffect(() => {
    if (!actif) return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, [actif]);
}

/** Génère une liste de particules décoratives (confettis / étoiles), stable entre les rendus. */
export type Particule = {
  id: number;
  gauche: number;
  taille: number;
  couleur: string;
  delai: number;
  duree: number;
  derive: number;
};

export function useParticules(nombre: number, couleurs: readonly string[], actif: boolean) {
  const [particules, setParticules] = useState<Particule[]>([]);
  const dejaGenere = useRef(false);

  useEffect(() => {
    if (!actif || dejaGenere.current) return;
    dejaGenere.current = true;
    const generation: Particule[] = Array.from({ length: nombre }, (_, index) => ({
      id: index,
      gauche: entierAleatoire(100),
      taille: 6 + entierAleatoire(9),
      couleur: couleurs[entierAleatoire(couleurs.length)],
      delai: entierAleatoire(1400),
      duree: 1500 + entierAleatoire(1500),
      derive: -40 + entierAleatoire(80),
    }));
    setParticules(generation);
  }, [actif, nombre, couleurs]);

  return particules;
}

/** Détecte un balayage horizontal du doigt (téléphone / tablette). */
export function useBalayage(options: { actif: boolean; surSuivant: () => void; surPrecedent: () => void }) {
  const { actif, surSuivant, surPrecedent } = options;
  const depart = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (evenement: React.TouchEvent) => {
      if (!actif) return;
      const cible = evenement.target as HTMLElement;
      // On ne gère pas le balayage dans la galerie agrandie ni dans un carrousel horizontal.
      if (cible.closest("[data-zone-balayage='non']")) {
        depart.current = null;
        return;
      }
      const touche = evenement.touches[0];
      depart.current = { x: touche.clientX, y: touche.clientY };
    },
    onTouchEnd: (evenement: React.TouchEvent) => {
      if (!actif || !depart.current) return;
      const touche = evenement.changedTouches[0];
      const dx = touche.clientX - depart.current.x;
      const dy = touche.clientY - depart.current.y;
      depart.current = null;
      // Déplacement suffisamment franc, et nettement plus horizontal que vertical.
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        if (dx < 0) surSuivant();
        else surPrecedent();
      }
    },
  };
}

/** Vrai si la préférence système est déjà connue au moment de l'appel (côté client). */
export const reduireAnimations = animationsReduitesPreferees;
