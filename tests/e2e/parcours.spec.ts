import { expect, test } from "@playwright/test";
import { photosAffichees, utilisePhotosProvisoires } from "../../src/data/photos";

// Nombre de photos réellement configurées : les tests restent valables
// quand vous ajoutez, retirez ou réordonnez vos images dans src/data/photos.ts.
const NB_PHOTOS = photosAffichees().length;
const PROVISOIRE = utilisePhotosProvisoires();

/**
 * Parcours complet des cinq écrans, tel que Saïda le vivra :
 * invitation → petit mot → galerie → anniversaire → cadeau → retour au début.
 */
test.describe("Parcours complet des cinq écrans", () => {
  test("le livre se déroule du début à la fin, puis revient au commencement", async ({ page }) => {
    const problemes: string[] = [];
    page.on("pageerror", (erreur) => problemes.push(`erreur JavaScript : ${erreur.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") problemes.push(`console : ${message.text()}`);
    });

    await page.goto("/");

    /* ---------- ÉCRAN 1 — L'invitation ---------- */
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Coucou Saïda");
    await expect(page.getByText("Une petite surprise pour toi")).toBeVisible();
    await expect(page.getByTestId("bouton-ouvrir-surprise")).toBeVisible();

    await page.getByTestId("bouton-ouvrir-surprise").click();

    /* ---------- ÉCRAN 2 — Le petit mot ---------- */
    await expect(page.getByRole("heading", { name: /Une attention qui continue/ })).toBeVisible();
    await expect(page.getByText(/une bonne pensée ne perd pas sa valeur/)).toBeVisible();

    // Bouton « revenir à l'écran précédent » : il doit ramener à l'invitation…
    await page.getByTestId("bouton-revenir-mot").click();
    await expect(page.getByTestId("bouton-ouvrir-surprise")).toBeVisible();

    // …puis on repart vers l'avant.
    await page.getByTestId("bouton-ouvrir-surprise").click();
    await page.getByTestId("bouton-continuer-mot").click();

    /* ---------- ÉCRAN 3 — La galerie ---------- */
    await expect(page.getByRole("heading", { name: /Quelques images, quelques sourires/ })).toBeVisible();
    const vignettes = page.getByTestId(/^vignette-photo-/);
    await expect(vignettes).toHaveCount(NB_PHOTOS);
    // Le message d'avertissement n'apparaît que si les visuels provisoires sont utilisés.
    await expect(page.getByTestId("alerte-photos-provisoires")).toHaveCount(PROVISOIRE ? 1 : 0);

    // Ouverture d'une photo en grand.
    await vignettes.first().click();
    const visionneuse = page.getByTestId("visionneuse");
    await expect(visionneuse).toBeVisible();
    await expect(visionneuse).toContainText(`1 / ${NB_PHOTOS}`);

    // Navigation à l'intérieur de la galerie agrandie (flèche du clavier + bouton).
    await page.keyboard.press("ArrowRight");
    await expect(visionneuse).toContainText(`2 / ${NB_PHOTOS}`);
    await page.getByTestId("visionneuse-precedente").click();
    await expect(visionneuse).toContainText(`1 / ${NB_PHOTOS}`);

    // Fermeture avec la touche Échap.
    await page.keyboard.press("Escape");
    await expect(visionneuse).toBeHidden();

    await page.getByTestId("bouton-continuer-galerie").click();

    /* ---------- ÉCRAN 4 — Le message d'anniversaire ---------- */
    await expect(page.getByRole("heading", { name: /Joyeux anniversaire, Saïda/ })).toBeVisible();
    await page.getByTestId("bouton-decouvrir-cadeau").click();

    /* ---------- ÉCRAN 5 — Le cadeau ---------- */
    const boite = page.getByTestId("boite-cadeau");
    await expect(boite).toBeVisible();
    await expect(boite).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("message-final")).toHaveCount(0);

    await boite.click();

    // Le cadeau s'ouvre : la boîte est marquée comme ouverte puis le message apparaît.
    await expect(boite).toHaveAttribute("aria-expanded", "true");
    const messageFinal = page.getByTestId("message-final");
    await expect(messageFinal).toBeVisible();
    await expect(messageFinal).toContainText("Et voilà, Saïda");
    await expect(messageFinal).toContainText("— Quelqu'un qui te souhaite sincèrement le meilleur.");

    /* ---------- Retour au début ---------- */
    await page.getByTestId("bouton-revoir-surprise").click();
    await expect(page.getByTestId("bouton-ouvrir-surprise")).toBeVisible();

    expect(problemes, `Problèmes détectés dans la console :\n${problemes.join("\n")}`).toEqual([]);
  });

  test("l'adresse est mise à jour à chaque écran, et un écran inconnu retombe sur l'invitation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("bouton-ouvrir-surprise").click();
    await expect(page.getByRole("heading", { name: /Une attention qui continue/ })).toBeVisible();
    expect(page.url()).toContain("#ecran-mot");

    await page.goto("/?ecran=nimportequoi");
    await expect(page.getByTestId("bouton-ouvrir-surprise")).toBeVisible();
  });
});
