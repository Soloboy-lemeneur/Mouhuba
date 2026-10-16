import { expect, test, type Page } from "@playwright/test";

/**
 * Vérification du responsive : les huit largeurs demandées, sur les cinq écrans.
 * On contrôle notamment l'absence de défilement horizontal involontaire et la
 * taille des boutons (confort au doigt : au moins 44 px de haut).
 */
const LARGEURS = [320, 360, 390, 430, 768, 1024, 1280, 1440];
const ECRANS = ["invitation", "mot", "galerie", "anniversaire", "cadeau"] as const;

/** Débordement horizontal en pixels (0 = aucun défilement latéral). */
async function debordementHorizontal(page: Page): Promise<number> {
  return page.evaluate(() => {
    const racine = document.documentElement;
    return Math.max(racine.scrollWidth, document.body.scrollWidth) - window.innerWidth;
  });
}

test.describe("Responsive et ergonomie tactile", () => {
  // Un seul profil suffit : les largeurs sont fixées explicitement dans le test.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "ordinateur", "vérifié une seule fois (largeurs imposées)");
  });

  for (const largeur of LARGEURS) {
    test(`largeur ${largeur} px : aucun débordement sur les cinq écrans`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });

      for (const ecran of ECRANS) {
        await page.goto(`/?ecran=${ecran}`);
        await expect(page.locator("main")).toBeVisible();
        await expect(page.locator("footer nav")).toBeVisible();

        const debordement = await debordementHorizontal(page);
        expect(debordement, `écran « ${ecran} » à ${largeur} px de large`).toBeLessThanOrEqual(1);
      }
    });
  }

  test("les boutons principaux mesurent au moins 44 px de haut sur téléphone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const bouton = page.getByTestId("bouton-ouvrir-surprise");
    const boite = await bouton.boundingBox();
    expect(boite?.height ?? 0).toBeGreaterThanOrEqual(44);

    // La boîte cadeau est également confortable à toucher.
    await page.goto("/?ecran=cadeau");
    const boiteCadeau = await page.getByTestId("boite-cadeau").boundingBox();
    expect(boiteCadeau?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(boiteCadeau?.width ?? 0).toBeGreaterThanOrEqual(44);
  });

  test("la galerie passe de 2 à 3 colonnes selon la place disponible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?ecran=galerie");

    const colonnes = async () =>
      page.evaluate(() => {
        const grille = document.querySelector("[data-testid='grille-photos']");
        if (!grille) return 0;
        return getComputedStyle(grille).gridTemplateColumns.split(" ").filter(Boolean).length;
      });

    expect(await colonnes()).toBe(2);

    await page.setViewportSize({ width: 1024, height: 900 });
    expect(await colonnes()).toBe(3);

    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await colonnes()).toBe(4);

    // À 320 px, une seule colonne : les photos restent lisibles.
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await colonnes()).toBe(1);
  });
});
