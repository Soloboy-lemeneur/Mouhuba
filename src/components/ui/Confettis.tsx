"use client";

import type { CSSProperties } from "react";
import { useAnimationReduite, useParticules } from "@/lib/hooks";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type ProprietesConfettis = {
  /** Nombre de particules souhaitées (borné par le réglage du site). */
  nombre?: number;
  className?: string;
  /** Si false, aucun confetti n'est affiché (utilisé pour l'écran du cadeau). */
  actif?: boolean;
  /** Couleurs personnalisées ; par défaut, la palette pastel du site. */
  couleurs?: readonly string[];
  /** Forme des particules. */
  forme?: "confetti" | "etoile" | "coeur";
};

/**
 * Pluie de confettis très légère : uniquement des éléments <span> colorés animés par CSS
 * (transform + opacité). Désactivée automatiquement si l'utilisateur préfère les
 * animations réduites, et limitée en nombre pour ne pas ralentir les téléphones.
 */
export function Confettis({
  nombre = 24,
  className,
  actif = true,
  couleurs = site.confettis.couleurs,
  forme = "confetti",
}: ProprietesConfettis) {
  const animationReduite = useAnimationReduite();
  const visible = actif && !animationReduite;
  const limite = Math.min(nombre, site.confettis.maximum);
  const particules = useParticules(limite, couleurs, visible);

  if (!visible || particules.length === 0) return null;

  const rayures: Record<string, string> = {
    confetti: "rounded-[2px]",
    etoile: "rounded-[1px]",
    coeur: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      data-testid="confettis"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {particules.map((particule) => (
        <span
          key={particule.id}
          className={cn("absolute top-full block animate-rise", rayures[forme])}
          style={
            {
              left: `${particule.gauche}%`,
              width: `${particule.taille}px`,
              height: forme === "confetti" ? `${particule.taille * 1.6}px` : `${particule.taille}px`,
              backgroundColor: forme === "etoile" ? "transparent" : particule.couleur,
              boxShadow: forme === "etoile" ? "none" : `0 0 10px -2px ${particule.couleur}`,
              animationDelay: `${particule.delai}ms`,
              animationDuration: `${particule.duree}ms`,
              "--drift": `${particule.derive}px`,
              clipPath:
                forme === "etoile"
                  ? "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)"
                  : undefined,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Étoiles scintillantes en fond d'une carte (plus discrètes que les confettis). */
export function Scintillements({ nombre = 10, className }: { nombre?: number; className?: string }) {
  const animationReduite = useAnimationReduite();
  const particules = useParticules(nombre, site.confettis.couleurs, !animationReduite);

  if (animationReduite || particules.length === 0) return null;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particules.map((particule) => (
        <span
          key={particule.id}
          className="absolute block animate-twinkle rounded-full bg-white"
          style={{
            left: `${particule.gauche}%`,
            top: `${(particule.id * 37) % 92}%`,
            width: `${4 + (particule.taille % 5)}px`,
            height: `${4 + (particule.taille % 5)}px`,
            boxShadow: `0 0 12px 2px ${particule.couleur}`,
            animationDelay: `${particule.delai}ms`,
          }}
        />
      ))}
    </div>
  );
}
