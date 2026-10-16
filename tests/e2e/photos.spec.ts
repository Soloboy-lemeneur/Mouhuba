import { expect, test } from "@playwright/test";
import { photosAffichees } from "../../src/data/photos";

const NB_PHOTOS = photosAffichees().length;

/**
 * Robustesse de la galerie.
 * On simule ici des photos manquantes (chargement d'image bloqué) pour vérifier que
 * le site reste propre et utilisable : c'est le cas tant que les vraies photos ne sont
 * pas encore déposées dans public/images/galerie/.
 */
test.describe("Gestion des photos absentes", () => {
  test("un visuel de remplacement s'affiche si une photo ne se charge pas", async ({ page }) => {
    // Toutes les requêtes d'images optimisées échouent.
    await page.route("**/_next/image**", (route) => route.abort());

    await page.goto("/?ecran=galerie");
    await expect(page.getByRole("heading", { name: /Quelques images/ })).toBeVisible();

    // Les cadres restent en place et affichent le message de remplacement.
    await expect(page.getByText("Photo à venir").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId(/^vignette-photo-/)).toHaveCount(NB_PHOTOS);

    // Et la fenêtre agrandie reste utilisable elle aussi.
    await page.getByTestId("vignette-photo-0").click();
    const visionneuse = page.getByTestId("visionneuse");
    await expect(visionneuse).toBeVisible();
    await expect(visionneuse.getByText("Photo à venir")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(visionneuse).toBeHidden();
  });

  test("la page reste utilisable si le fond de l'invitation manque", async ({ page }) => {
    await page.route("**/_next/image**", (route) => route.abort());

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Coucou Saïda");
    // Le bouton principal reste cliquable : le parcours n'est jamais bloqué.
    await page.getByTestId("bouton-ouvrir-surprise").click();
    await expect(page.getByRole("heading", { name: /Une attention qui continue/ })).toBeVisible();
  });
});
