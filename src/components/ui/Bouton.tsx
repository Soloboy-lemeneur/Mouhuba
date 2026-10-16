import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type VarianteBouton = "principal" | "secondaire" | "discret";
export type TailleBouton = "normal" | "petit";

/**
 * Classes communes aux boutons du site.
 * Hauteur minimale de 3 rem (48 px) : confortable au doigt sur téléphone.
 */
export function classesBouton(
  variante: VarianteBouton = "principal",
  taille: TailleBouton = "normal",
): string {
  const base = [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
    "transition-[transform,box-shadow,background-color,color] duration-300 ease-out",
    "select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-55",
    "focus-visible:outline-3 focus-visible:outline-offset-3",
  ].join(" ");

  const tailles: Record<TailleBouton, string> = {
    normal: "min-h-12 px-6 py-3 text-[0.98rem] sm:text-base",
    petit: "min-h-11 px-4 py-2 text-[0.9rem]",
  };

  const variantes: Record<VarianteBouton, string> = {
    principal: [
      "text-white shadow-[0_14px_30px_-14px_rgba(209,97,138,0.85)]",
      "bg-linear-to-r from-rose-400 via-rose-500 to-lavender-400",
      "hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-14px_rgba(209,97,138,0.9)]",
      "active:translate-y-0 active:scale-[0.985]",
      "focus-visible:outline-lavender-600",
    ].join(" "),
    secondaire: [
      "text-ink-soft bg-white/85 ring-1 ring-rose-200",
      "hover:bg-white hover:ring-rose-300 hover:-translate-y-0.5 hover:text-ink",
      "active:translate-y-0 active:scale-[0.985]",
      "focus-visible:outline-lavender-600",
    ].join(" "),
    discret: [
      "text-ink-muted bg-transparent ring-1 ring-transparent",
      "hover:bg-white/70 hover:text-ink-soft",
      "focus-visible:outline-lavender-600",
    ].join(" "),
  };

  return cn(base, tailles[taille], variantes[variante]);
}

type ProprietesBouton = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBouton;
  taille?: TailleBouton;
  iconeGauche?: ReactNode;
  iconeDroite?: ReactNode;
};

export function Bouton({
  variante = "principal",
  taille = "normal",
  iconeGauche,
  iconeDroite,
  className,
  children,
  type = "button",
  ...reste
}: ProprietesBouton) {
  return (
    <button type={type} className={cn(classesBouton(variante, taille), className)} {...reste}>
      {iconeGauche ? (
        <span aria-hidden="true" className="shrink-0">
          {iconeGauche}
        </span>
      ) : null}
      <span>{children}</span>
      {iconeDroite ? (
        <span aria-hidden="true" className="shrink-0">
          {iconeDroite}
        </span>
      ) : null}
    </button>
  );
}

/** Même apparence que <Bouton />, mais sous forme de lien (ex. bouton « Revoir la surprise »). */
export function LienBouton({
  variante = "principal",
  taille = "normal",
  iconeGauche,
  iconeDroite,
  className,
  children,
  ...reste
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: VarianteBouton;
  taille?: TailleBouton;
  iconeGauche?: ReactNode;
  iconeDroite?: ReactNode;
}) {
  return (
    <a className={cn(classesBouton(variante, taille), "no-underline", className)} {...reste}>
      {iconeGauche ? (
        <span aria-hidden="true" className="shrink-0">
          {iconeGauche}
        </span>
      ) : null}
      <span>{children}</span>
      {iconeDroite ? (
        <span aria-hidden="true" className="shrink-0">
          {iconeDroite}
        </span>
      ) : null}
    </a>
  );
}
