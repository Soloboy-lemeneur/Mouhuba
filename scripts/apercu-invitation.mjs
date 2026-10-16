/**
 * Captures de l'écran d'invitation aux largeurs sensibles (320, 390, 768, 1440).
 * Utile pour vérifier le cadrage de la photo d'arrière-plan après un changement.
 *
 * Utilisation : npm run build && npm run start, puis
 *              node scripts/apercu-invitation.mjs
 */
import { chromium, devices } from "@playwright/test";
const b = await chromium.launch();
const cas = [
  [
    "mobile-390",
    { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  ],
  [
    "mobile-320",
    { viewport: { width: 320, height: 700 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  ],
  ["tablette-768", { viewport: { width: 768, height: 1024 } }],
  ["ordinateur-1440", { viewport: { width: 1440, height: 900 } }],
];
for (const [nom, contexte] of cas) {
  const ctx = await b.newContext(contexte);
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `apercus/invitation-${nom}.jpg`, fullPage: true, type: "jpeg", quality: 80 });
  const debordement = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(nom, "→ débordement horizontal :", debordement, "px");
  await ctx.close();
}
await b.close();
