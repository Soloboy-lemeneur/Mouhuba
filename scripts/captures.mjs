/**
 * Captures d'écran du site — utile pour vérifier le rendu et pour montrer un aperçu.
 *
 * Utilisation :
 *   1. npm run build
 *   2. npm run start            (dans un autre terminal, ou laissez Playwright le faire)
 *   3. node scripts/captures.mjs
 *
 * Variables d'environnement possibles :
 *   URL_BASE   adresse du site (par défaut http://127.0.0.1:3100)
 *   DOSSIER    dossier de sortie (par défaut ./apercus)
 */

import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const URL_BASE = process.env.URL_BASE ?? "http://127.0.0.1:3100";
const DOSSIER = process.env.DOSSIER ?? "apercus";

const ECRANS = [
  { cle: "invitation", nom: "1-invitation" },
  { cle: "mot", nom: "2-petit-mot" },
  { cle: "galerie", nom: "3-galerie" },
  { cle: "anniversaire", nom: "4-anniversaire" },
  { cle: "cadeau", nom: "5-cadeau-ferme" },
];

async function capturer(contexte, suffixe) {
  const page = await contexte.newPage();
  await page.goto(`${URL_BASE}/`, { waitUntil: "networkidle" });

  for (const ecran of ECRANS) {
    await page.goto(`${URL_BASE}/?ecran=${ecran.cle}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900); // laisse les animations d'apparition se terminer
    await page.screenshot({
      path: path.join(DOSSIER, `${ecran.nom}-${suffixe}.jpg`),
      fullPage: true,
      type: "jpeg",
      quality: 82,
    });
  }

  // Galerie agrandie
  await page.goto(`${URL_BASE}/?ecran=galerie`, { waitUntil: "networkidle" });
  await page.getByTestId("vignette-photo-0").click();
  // On remonte la page : la fenêtre agrandie reste fixe à l'écran, et la capture
  // ne présente donc aucun décalage lié au défilement.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(DOSSIER, `3b-galerie-agrandie-${suffixe}.jpg`),
    type: "jpeg",
    quality: 82,
  });

  // Cadeau ouvert
  await page.goto(`${URL_BASE}/?ecran=cadeau`, { waitUntil: "networkidle" });
  await page.getByTestId("boite-cadeau").click();
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: path.join(DOSSIER, `5b-cadeau-ouvert-${suffixe}.jpg`),
    fullPage: true,
    type: "jpeg",
    quality: 82,
  });

  await page.close();
}

async function main() {
  await mkdir(DOSSIER, { recursive: true });

  const navigateur = await chromium.launch();

  // Téléphone (équivalent Android récent)
  await capturer(await navigateur.newContext({ ...devices["Pixel 7"], deviceScaleFactor: 2 }), "mobile");

  // Ordinateur
  await capturer(
    await navigateur.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }),
    "ordinateur",
  );

  await navigateur.close();
  console.log(`Captures enregistrées dans ./${DOSSIER}`);
}

await main();
