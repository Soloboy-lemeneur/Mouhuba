import { expect, test } from "@playwright/test";

/** Vérifications d'accessibilité et de confort d'utilisation. */
test.describe("Accessibilité", () => {
  test("la page est en français, titrée, et le lien d'évitement est accessible au clavier", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    expect(await page.title()).not.toHaveLength(0);

    // Premier élément atteint au clavier : « Aller au contenu ».
    await page.keyboard.press("Tab");
    const lienEvitement = page.getByRole("link", { name: "Aller au contenu" });
    await expect(lienEvitement).toBeFocused();
    await expect(lienEvitement).toBeVisible();
  });

  test("les flèches du clavier font avancer et reculer dans le livre", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("bouton-ouvrir-surprise").focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { name: /Une attention qui continue/ })).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("bouton-ouvrir-surprise")).toBeVisible();
  });

  test("la fenêtre agrandie garde le focus et se ferme avec Échap", async ({ page }) => {
    await page.goto("/?ecran=galerie");
    await page.getByTestId("vignette-photo-0").click();

    const visionneuse = page.getByTestId("visionneuse");
    await expect(visionneuse).toBeVisible();

    // Le focus est placé sur le bouton de fermeture à l'ouverture.
    await expect(page.getByTestId("fermer-visionneuse")).toBeFocused();

    // Plusieurs Tab successifs ne doivent pas faire sortir du dialogue.
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      const dedans = await page.evaluate(() => {
        const dialogue = document.querySelector("[data-testid='visionneuse']");
        return Boolean(dialogue && document.activeElement && dialogue.contains(document.activeElement));
      });
      expect(dedans, `le focus est sorti du dialogue au Tab n° ${index + 1}`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(visionneuse).toBeHidden();
  });

  test("toutes les images de la galerie ont un texte alternatif", async ({ page }) => {
    await page.goto("/?ecran=galerie");
    const attributsAlt = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-testid='grille-photos'] img")).map((image) =>
        image.getAttribute("alt"),
      ),
    );
    expect(attributsAlt.length).toBeGreaterThan(0);
    for (const alt of attributsAlt) {
      expect((alt ?? "").trim().length).toBeGreaterThan(10);
    }
  });

  test("le fil de progression permet de revenir à un écran déjà vu", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("bouton-ouvrir-surprise").click();
    await page.getByTestId("bouton-continuer-mot").click();
    await expect(page.getByRole("heading", { name: /Quelques images/ })).toBeVisible();

    await page.getByTestId("progression-invitation").click();
    await expect(page.getByTestId("bouton-ouvrir-surprise")).toBeVisible();
  });

  test("avec « animations réduites », le contenu reste complet et sans mouvement", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Les confettis ne sont pas générés.
    await page.goto("/?ecran=anniversaire");
    await expect(page.getByRole("heading", { name: /Joyeux anniversaire/ })).toBeVisible();
    await expect(page.getByTestId("confettis")).toHaveCount(0);

    // Le cadeau s'ouvre immédiatement, sans attendre l'animation.
    await page.goto("/?ecran=cadeau");
    await page.getByTestId("boite-cadeau").click();
    await expect(page.getByTestId("message-final")).toBeVisible({ timeout: 2_000 });
    await expect(page.getByTestId("confettis")).toHaveCount(0);
  });
});
