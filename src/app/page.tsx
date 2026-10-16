import { LivreInteractif } from "@/components/LivreInteractif";

/**
 * Page unique du site.
 * Les cinq écrans sont gérés côté client (le livre interactif), ce qui évite
 * tout rechargement et garde la surprise fluide sur téléphone.
 *
 * Raccourcis d'aperçu (pratiques pour vérifier la mise en page) :
 *   /?ecran=mot | /?ecran=galerie | /?ecran=anniversaire | /?ecran=cadeau
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parametres = await searchParams;
  const brut = parametres?.ecran;
  const ecran = Array.isArray(brut) ? brut[0] : brut;

  return <LivreInteractif ecranInitial={ecran} />;
}
