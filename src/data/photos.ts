/**
 * =====================================================================================
 *  CONFIGURATION DE LA GALERIE PHOTO
 * =====================================================================================
 *
 *  ✅ VOS 4 PHOTOS SONT DÉJÀ INSTALLÉES.
 *     Les fichiers se trouvent dans :  public/images/galerie/
 *     - photo-01.jpg   soirée, chemise bleue
 *     - photo-02.jpg   plein jour, foulard violet
 *     - photo-03.jpg   devant le miroir
 *     - photo-04.jpg   robe bleue brodée, soirée
 *
 *  POUR AJOUTER UNE PHOTO
 *     1. Copiez le fichier dans public/images/galerie/ (par exemple photo-05.jpg).
 *     2. Recopiez un bloc ci-dessous et adaptez-le.
 *
 *  POUR RETIRER UNE PHOTO : supprimez son bloc (et le fichier si vous le souhaitez).
 *  POUR RÉORGANISER : changez l'ordre des blocs.
 *
 *  Détail des champs
 *     fichier     nom du fichier dans public/images/galerie/
 *     alt         description courte — indispensable pour les lecteurs d'écran
 *     legende     texte affiché sous la photo ; chaîne vide (« ») = pas de légende
 *     format      "portrait" (4/5) | "paysage" (4/3) | "carre" (1/1)
 *     inclinaison inclinaison du cadre Polaroid, en degrés (-4 à 4 reste élégant ; 0 = droit)
 *
 *  ℹ️  Tout fichier placé dans public/ est servi publiquement une fois le site en ligne.
 *      Vérifiez le réglage « public / privé » de votre dépôt GitHub.
 * =====================================================================================
 */

export type FormatPhoto = "portrait" | "paysage" | "carre";

export type Photo = {
  /** Identifiant unique (sert aussi de clé React). */
  id: string;
  /** Nom du fichier dans public/images/galerie/ (ou chemin commençant par /images/...). */
  fichier: string;
  /** Description pour les lecteurs d'écran — à personnaliser. */
  alt: string;
  /** Légende affichée sous la photo. Chaîne vide = pas de légende. */
  legende: string;
  /** Proportion du cadre. */
  format: FormatPhoto;
  /** Inclinaison du cadre, en degrés (-4 à 4 reste élégant). */
  inclinaison: number;
  /** true = visuel neutre de remplacement (photo pas encore fournie). */
  provisoire?: boolean;
};

/** ✅ VOS PHOTOS (dans l'ordre d'affichage). */
export const PHOTOS: Photo[] = [
  {
    id: "photo-01",
    fichier: "photo-01.jpg",
    alt: "Saïda en soirée, appuyée contre une voiture.",
    legende: "", // ← écrivez ici une légende si vous le souhaitez, par exemple "Belle soirée"
    format: "portrait",
    inclinaison: -2,
  },
  {
    id: "photo-02",
    fichier: "photo-02.jpg",
    alt: "Saïda en foulard violet, main décorée de henné.",
    legende: "",
    format: "portrait",
    inclinaison: 1.8,
  },
  {
    id: "photo-03",
    fichier: "photo-03.jpg",
    alt: "Saïda devant un miroir, cheveux bouclés, main levée.",
    legende: "",
    format: "portrait",
    inclinaison: -1.2,
  },
  {
    id: "photo-04",
    fichier: "photo-04.jpg",
    alt: "Saïda en robe bleue brodée, debout à la tombée de la nuit.",
    legende: "",
    format: "portrait",
    inclinaison: 2.4,
  },
];

/**
 * 🧪 VISUELS PROVISOIRES (neutres).
 * Ils ne s'affichent QUE si `PHOTOS` est vide : utile si vous repartez de zéro.
 * Ils ne représentent personne : ce sont de simples motifs pastel générés localement.
 */
export const PHOTOS_PROVISOIRES: Photo[] = Array.from({ length: 8 }, (_, index) => {
  const numero = String(index + 1).padStart(2, "0");
  const inclinaisons = [-2.4, 1.8, -1.2, 2.6, -2, 1.4, -1.8, 2.2];
  const formats: FormatPhoto[] = ["portrait", "paysage", "carre", "portrait"];
  return {
    id: `provisoire-${numero}`,
    fichier: `photo-${numero}.jpg`,
    alt: `Visuel provisoire n° ${index + 1} : aucun contenu personnel, simple motif pastel de démonstration.`,
    legende: `Emplacement ${numero} — à remplacer par votre photo`,
    format: formats[index % formats.length],
    inclinaison: inclinaisons[index % inclinaisons.length],
    provisoire: true,
  };
});

const DOSSIER = "/images/galerie";

/** Transforme une entrée de configuration en URL utilisable par <Image />. */
export function cheminImage(photo: Photo): string {
  return photo.fichier.startsWith("/") ? photo.fichier : `${DOSSIER}/${photo.fichier}`;
}

/** Vrai si la galerie tourne encore sur les visuels provisoires. */
export function utilisePhotosProvisoires(): boolean {
  return PHOTOS.length === 0;
}

/** Liste réellement affichée : vos photos si elles existent, sinon les visuels provisoires. */
export function photosAffichees(): Photo[] {
  return PHOTOS.length > 0 ? PHOTOS : PHOTOS_PROVISOIRES;
}

/** Image utilisée pour les aperçus de lien (Open Graph / Twitter). */
export const IMAGE_APERCU = "/images/apercu.svg";

/**
 * Formats acceptés pour les photos : .jpg, .jpeg, .png, .webp, .avif.
 * (Les fichiers .svg ne sont pas acceptés par l'optimiseur d'images de Next.js.)
 */
