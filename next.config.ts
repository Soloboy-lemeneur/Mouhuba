import type { NextConfig } from "next";

/**
 * Configuration Next.js du projet « Une petite surprise pour Saïda ».
 * Projet volontairement minimal : aucune base de données, aucun back-end, aucune clé secrète.
 */
const nextConfig: NextConfig = {
  // Empêche l'en-tête « X-Powered-By » d'être envoyé (petite amélioration de confidentialité).
  poweredByHeader: false,

  images: {
    // Formats modernes générés automatiquement pour les téléphones (gain de poids important).
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 360, 390, 430, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [64, 96, 128, 160, 220, 300, 420],
  },

  // Autorise les origines utilisées par les environnements d'aperçu (bac à sable / prévisualisation).
  // Utile uniquement pour `npm run dev` ; la version de production n'en a pas besoin.
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai", "localhost", "127.0.0.1"],

  // Petites redirections de confort : /photos -> /#ecran-galerie
  async redirects() {
    return [
      { source: "/photos", destination: "/#ecran-galerie", permanent: false },
      { source: "/galerie", destination: "/#ecran-galerie", permanent: false },
      { source: "/cadeau", destination: "/#ecran-cadeau", permanent: false },
    ];
  },
};

export default nextConfig;
