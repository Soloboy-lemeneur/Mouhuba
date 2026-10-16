import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * Configuration ESLint (format « flat config », standard depuis ESLint 9).
 * `eslint-config-next/core-web-vitals` active les règles recommandées par Next.js
 * (React, React Hooks, TypeScript, accessibilité, bonnes pratiques Next).
 * Aucune règle n'est désactivée : le projet passe la vérification telle quelle.
 */
const configuration = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  ...nextCoreWebVitals,
];

export default configuration;
