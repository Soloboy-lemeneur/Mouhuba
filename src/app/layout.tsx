import type { Metadata, Viewport } from "next";
import { Great_Vibes, Playfair_Display, Quicksand } from "next/font/google";
import { IMAGE_APERCU } from "@/data/photos";
import { site } from "@/data/site";
import "./globals.css";

/* ------------------------------------------------------------------------------------
   Typographies. Next.js télécharge les polices au moment de la compilation et les sert
   depuis le site lui-même : aucune requête vers Google au chargement de la page, et
   l'aperçu fonctionne même sans accès à Internet côté visiteur.
   ------------------------------------------------------------------------------------ */
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-playfair",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-great-vibes",
});

/* ------------------------------------------------------------------------------------
   Métadonnées du site.
   - `robots` est volontairement désactivé : la page n'a pas à être référencée par les
     moteurs de recherche (c'est un cadeau privé). Voir README pour l'ouvrir si besoin.
   ------------------------------------------------------------------------------------ */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: site.titre,
  description: site.description,
  applicationName: "Surprise",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: site.titre,
    description: site.description,
    images: [{ url: IMAGE_APERCU, width: 1200, height: 630, alt: site.titre }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.titre,
    description: site.description,
    images: [IMAGE_APERCU],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Le zoom reste autorisé (accessibilité) — seule la mise en page est verrouillée en largeur.
  maximumScale: 5,
  themeColor: "#fff7f9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${quicksand.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
