"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Affiche son contenu directement dans <body>, en dehors de la carte de l'écran.
 *
 * Pourquoi ? La carte possède un flou d'arrière-plan et un `overflow: hidden` :
 * ces styles « capturent » les éléments en position fixe, ce qui empêcherait la
 * galerie agrandie de couvrir toute la fenêtre. Le portail contourne ce problème.
 *
 * `useSyncExternalStore` distingue proprement le rendu serveur (`false`) du
 * navigateur (`true`), sans écart d'hydratation.
 */
const souscrire = () => () => {};
const coteClient = () => true;
const coteServeur = () => false;

export function Portail({ children }: { children: ReactNode }) {
  const estMonte = useSyncExternalStore(souscrire, coteClient, coteServeur);

  // Pas de hooks après ce test : le nombre de hooks reste constant.
  if (!estMonte || typeof document === "undefined") return null;

  return createPortal(children, document.body);
}
