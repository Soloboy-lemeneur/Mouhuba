/** Petite utilitaire de composition de classes, sans dépendance externe. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Vrai si la préférence système « réduire les animations » est active. */
export function animationsReduitesPreferees(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Nombre aléatoire entier entre 0 et maxExclu (exclu). */
export function entierAleatoire(maxExclu: number): number {
  return Math.floor(Math.random() * maxExclu);
}

/**
 * Sépare un émoji situé en fin de chaîne du reste du texte.
 * Permet d'ajuster la taille de l'émoji (les polices d'écriture comme Great Vibes
 * ont des lettres visuellement petites : l'émoji paraîtrait trop grand à côté).
 * Le texte affiché reste identique, émoji compris.
 */
export function separerEmoji(texte: string): { texte: string; emoji: string | null } {
  const correspondance = texte.match(
    /^(.*?)(\s*)([\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{FE0F}\u{200D}]+)$/u,
  );
  if (!correspondance) return { texte, emoji: null };
  return { texte: correspondance[1], emoji: correspondance[3] };
}
