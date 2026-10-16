import { defineConfig, devices } from "@playwright/test";

/**
 * Configuration des tests de bout en bout (Playwright).
 *
 * Les tests s'exécutent sur le site COMPILÉ (production), servi par `next start`.
 * Pensez donc à lancer `npm run build` avant `npm run test:e2e`
 * (ou utilisez `npm run verifier`, qui enchaîne tout).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    locale: "fr-FR",
    timezoneId: "Africa/Abidjan",
  },
  webServer: {
    command: "npx next start -p 3100 -H 127.0.0.1",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "ordinateur",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      name: "android",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "iphone",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
