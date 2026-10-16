#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import des photos personnelles vers les dossiers du site.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UTILISATION
    python3 scripts/importer-photos.py [--fond NUMERO] [--sources DOSSIER]

    --fond NUMERO   numéro de la photo à utiliser en arrière-plan de l'invitation
                    (1 = la première de la liste alphabétique). Par défaut : 1.
    --sources       dossier contenant vos photos (par défaut : ~/uploads)

CE QUE FAIT LE SCRIPT
    1. Il lit les photos source et corrige leur orientation (données EXIF).
    2. Il les redimensionne pour le web (aucune perte visible, poids divisé par 3 à 6).
    3. Il enregistre :
         public/images/fond.jpg                  ← la photo choisie en arrière-plan
         public/images/galerie/photo-01.jpg …    ← toutes les photos, dans l'ordre
    4. Il SUPPRIME les métadonnées (date, appareil, éventuelles coordonnées GPS) :
       aucune information privée ne part sur le site.

Après l'import, pensez à décrire chaque photo dans src/data/photos.ts
(texte alternatif, légende, format, inclinaison).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("Pillow n'est pas installé. Lancez : python3 -m pip install --user Pillow")

RACINE = Path(__file__).resolve().parent.parent
IMAGES = RACINE / "public" / "images"
GALERIE = IMAGES / "galerie"

EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif")

# Côté long maximum après redimensionnement (large L : 1800 px suffit pour un écran 4K,
# les téléphones affichent au maximum ~1200 px de large).
COTE_LONG_GALERIE = 1400
COTE_LONG_FOND = 1800
QUALITE = 82


def lister_sources(dossier: Path) -> list[Path]:
    fichiers = [f for f in sorted(dossier.iterdir()) if f.suffix.lower() in EXTENSIONS]
    return fichiers


def redimensionner(image: Image.Image, cote_long: int) -> Image.Image:
    """Réduit l'image si nécessaire, en conservant ses proportions."""
    largeur, hauteur = image.size
    if max(largeur, hauteur) <= cote_long:
        return image
    ratio = cote_long / max(largeur, hauteur)
    return image.resize((round(largeur * ratio), round(hauteur * ratio)), Image.Resampling.LANCZOS)


def enregistrer(image: Image.Image, chemin: Path) -> None:
    """Enregistre en JPEG progressif, SANS métadonnées (donc sans GPS ni date)."""
    chemin.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(
        chemin,
        "JPEG",
        quality=QUALITE,
        optimize=True,
        progressive=True,
        # exif volontairement omis : les métadonnées privées sont ainsi supprimées
    )


def main() -> int:
    analyseur = argparse.ArgumentParser(description="Importe les photos personnelles vers le site.")
    analyseur.add_argument("--fond", type=int, default=1, help="numéro de la photo d'arrière-plan (défaut : 1)")
    analyseur.add_argument("--sources", type=str, default="~/uploads", help="dossier des photos source")
    options = analyseur.parse_args()

    dossier = Path(os.path.expanduser(options.sources))
    if not dossier.is_dir():
        sys.exit(f"Dossier introuvable : {dossier}\nIndiquez le bon dossier avec --sources /chemin/vers/photos")

    sources = lister_sources(dossier)
    if not sources:
        sys.exit(f"Aucune image trouvée dans {dossier}")

    if not 1 <= options.fond <= len(sources):
        sys.exit(f"--fond doit être un nombre entre 1 et {len(sources)}")

    print(f"{len(sources)} photo(s) trouvée(s) dans {dossier}\n")

    for index, source in enumerate(sources, start=1):
        image = ImageOps.exif_transpose(Image.open(source))
        enregistrer(redimensionner(image, COTE_LONG_GALERIE), GALERIE / f"photo-{index:02d}.jpg")
        print(f"  ✓ {source.name}  →  public/images/galerie/photo-{index:02d}.jpg  ({image.size[0]}×{image.size[1]})")

    # Arrière-plan de l'invitation
    source_fond = sources[options.fond - 1]
    image_fond = ImageOps.exif_transpose(Image.open(source_fond))
    enregistrer(redimensionner(image_fond, COTE_LONG_FOND), IMAGES / "fond.jpg")
    print(f"\n  ★ {source_fond.name}  →  public/images/fond.jpg  (arrière-plan de l'invitation)")

    print(
        "\nTerminé. Toutes les métadonnées (GPS, date, appareil) ont été supprimées.\n"
        "Prochaine étape : décrivez vos photos dans src/data/photos.ts"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
