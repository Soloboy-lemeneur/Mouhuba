/**
 * Tous les textes affichés sur le site, regroupés en un seul endroit.
 * Pour corriger une phrase, il suffit de la modifier ici : aucun composant à toucher.
 *
 * ⚠️ La signature finale est volontairement anonyme.
 *     Ne pas y ajouter de nom, de prénom, de surnom ni d'initiale.
 */

export type ScreenId = "invitation" | "mot" | "galerie" | "anniversaire" | "cadeau";

/** Écran 1 — L'invitation (photo de fond + carte au premier plan). */
export const invitation = {
  eyebrow: "Une petite surprise pour toi",
  greeting: "Coucou Saïda ! 🌸",
  paragraph:
    "J'ai préparé quelque chose de spécial pour toi. Quelques mots, quelques images et une petite attention pour te faire sourire.",
  question: "Prête à découvrir ?",
  cta: "Ouvrir ma surprise ✨",
} as const;

/** Écran 2 — Le petit mot. */
export const mot = {
  title: "Une attention qui continue 🌷",
  paragraphs: [
    "Saïda, même si ton anniversaire est déjà passé, je voulais quand même prendre un petit moment pour te souhaiter de belles choses.",
    "Parce qu'une bonne pensée ne perd pas sa valeur simplement parce qu'elle arrive quelques jours plus tard.",
    "Alors, voici cette petite surprise préparée spécialement pour toi. 💗",
  ],
} as const;

/** Écran 3 — La galerie photo. */
export const galerie = {
  title: "Quelques images, quelques sourires 📸",
  paragraphs: [
    "Parce que les images ont parfois leur propre façon de raconter les choses, voici une petite galerie pour toi.",
    "J'espère que ces photos te plairont et qu'elles t'apporteront un peu de douceur dans ta journée. 🌸",
  ],
  /** Affiché à la place d'une photo manquante. */
  imageManquante: {
    titre: "Photo à venir",
    texte:
      "Cette image n'a pas encore été ajoutée. Dépose le fichier correspondant dans public/images/galerie/ en respectant le nom indiqué dans src/data/photos.ts.",
  },
  /** Aides à la lecture pour les lecteurs d'écran. */
  altOuverture: "Agrandir la photo",
  altFermeture: "Fermer la photo agrandie",
  altPrecedente: "Photo précédente",
  altSuivante: "Photo suivante",
} as const;

/** Écran 4 — Le message d'anniversaire. */
export const anniversaire = {
  title: "Joyeux anniversaire, Saïda ! 🎂",
  paragraphs: [
    "Même si ce petit message arrive après le jour J, je te souhaite sincèrement beaucoup de bonheur, une bonne santé, de la réussite dans tes projets et plein de belles surprises.",
    "Que cette nouvelle année de ta vie t'apporte de bonnes nouvelles, des personnes sincères et de nombreuses raisons de sourire.",
    "Profite de chaque belle occasion que la vie t'offre et continue d'avancer à ton rythme.",
    "Prends bien soin de toi et garde le sourire. 💗",
  ],
  cta: "Découvrir le dernier cadeau 🎁",
} as const;

/** Écran 5 — Le cadeau final. */
export const cadeau = {
  titre: "Un dernier petit quelque chose…",
  consigne: "Appuie sur la boîte pour l'ouvrir",
  consigneOuvert: "Le cadeau est ouvert",
  message: [
    "Et voilà, Saïda !",
    "C'était ma petite façon de prolonger les souhaits d'anniversaire et de t'offrir un sourire, même après cette journée spéciale.",
    "J'espère que cette petite surprise t'aura fait plaisir.",
    "Je te souhaite encore plein de belles choses pour la suite. Prends soin de toi !",
  ],
  signature: "— Quelqu'un qui te souhaite sincèrement le meilleur.",
  rejouer: "Revoir la surprise",
} as const;

/** Navigation commune aux cinq écrans. */
export const navigation = {
  suivant: "Continuer",
  suivantCadeau: "Voir le cadeau",
  precedent: "Revenir en arrière",
  rejouer: "Revoir la surprise",
  progression: (etape: number, total: number) => `Écran ${etape} sur ${total}`,
  /** Libellés courts utilisés par la barre de progression cliquable. */
  etapes: ["Invitation", "Petit mot", "Galerie", "Anniversaire", "Cadeau"] as const,
} as const;
