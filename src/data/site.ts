/**
 * Réglages généraux du site.
 * Modifiez ces valeurs pour adapter l'expérience sans toucher aux composants.
 */

export const site = {
  /** Titre affiché dans l'onglet du navigateur et lors du partage du lien. */
  titre: "Une petite surprise pour toi 🌸",
  /** Description utilisée par les moteurs de recherche et les aperçus de lien. */
  description:
    "Un petit livre numérique en cinq écrans : quelques mots, quelques images et une attention préparée avec soin.",
  /** Nom utilisé dans les attributs `alt` de l'image de fond. */
  prenom: "Saïda",

  /**
   * Image affichée en arrière-plan du premier écran.
   * Déposez votre fichier dans : public/images/fond.jpg
   */
  fond: {
    chemin: "/images/fond.jpg",
    /** Texte lu par les lecteurs d'écran. Décrivez la photo en une phrase. */
    alt: "Saïda en foulard violet, souriante à l'extérieur.",
    /**
     * Point focal de la photo, en pourcentage : « horizontal vertical ».
     * « 50% 42% » privilégie le visage lorsque l'image est recadrée (bandeau
     * sur téléphone, panneau sur ordinateur). Ajustez si besoin : 0% = haut de
     * la photo, 50% = milieu, 100% = bas.
     */
    positionFocale: "50% 42%",
  },

  /** Palette d'affichage des confettis et des étoiles (hexadécimal uniquement). */
  confettis: {
    couleurs: ["#f89cba", "#ffc9a4", "#b5a3f0", "#fdeed9", "#eb7fa4", "#9a83dd"],
    maximum: 30,
  },
} as const;
