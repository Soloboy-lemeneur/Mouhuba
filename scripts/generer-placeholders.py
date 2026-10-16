#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génération des visuels provisoires du site « Une petite surprise pour Saïda ».

Ce script fabrique UNIQUEMENT des images neutres de remplacement : dégradés pastel,
formes douces et fleurs stylisées. Il ne crée aucune photo de personne et n'en
télécharge aucune. Aucun visuel personnel n'est inventé.

Fichiers créés :
  public/images/fond.jpg                (arrière-plan provisoire de l'écran 1)
  public/images/galerie/photo-01.jpg    … photo-08.jpg (emplacements de la galerie)

Utilisation :
    python3 scripts/generer-placeholders.py
    # si Pillow n'est pas installé :
    python3 -m pip install --user Pillow && python3 scripts/generer-placeholders.py

Ces fichiers peuvent être supprimés à tout moment : le site les remplace alors
automatiquement par un fond pastel (écran 1) et par un cadre « Photo à venir » (galerie).
"""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RACINE = Path(__file__).resolve().parent.parent
DOSSIER_IMAGES = RACINE / "public" / "images"
DOSSIER_GALERIE = DOSSIER_IMAGES / "galerie"

# Proportions attendues par la galerie (identiques à `format` dans src/data/photos.ts)
FORMATS = {
    "portrait": (1200, 1500),  # 4/5
    "paysage": (1400, 1050),   # 4/3
    "carre": (1200, 1200),     # 1/1
}
SUITE_FORMATS = ["portrait", "paysage", "carre", "portrait", "portrait", "paysage", "carre", "portrait"]

# Palette pastel du site
ROSE = (248, 156, 186)
ROSE_CLAIR = (255, 214, 228)
LAVANDE = (181, 163, 240)
PECHE = (249, 171, 124)
CREME = (255, 248, 236)

POLICES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/Library/Fonts/Arial.ttf",
    "C:/Windows/Fonts/arial.ttf",
]


def charger_police(taille: int):
    for chemin in POLICES:
        if os.path.exists(chemin):
            try:
                return ImageFont.truetype(chemin, taille)
            except OSError:
                continue
    try:
        return ImageFont.load_default(size=taille)
    except TypeError:
        return ImageFont.load_default()


def melanger(a, b, ratio: float):
    ratio = max(0.0, min(1.0, ratio))
    return tuple(round(x + (y - x) * ratio) for x, y in zip(a, b))


def degrade_vertical(taille, haut, bas) -> Image.Image:
    """Dégradé vertical doux (aucune dépendance externe)."""
    largeur, hauteur = taille
    bande = Image.new("RGB", (1, hauteur))
    pixels = bande.load()
    for y in range(hauteur):
        pixels[0, y] = melanger(haut, bas, y / max(1, hauteur - 1))
    return bande.resize((largeur, hauteur), Image.Resampling.BILINEAR)


def tache_douce(image: Image.Image, centre, rayon: float, couleur, opacite: float) -> Image.Image:
    """
    Tache floue très douce (halo). On dessine un petit disque puis on l'agrandit
    en interpolation bilinéaire : le dégradé obtenu est parfaitement lisse et léger.
    """
    largeur, hauteur = image.size
    petit = max(8, int(rayon / 8))
    masque = Image.new("L", (petit, petit), 0)
    pinceau = ImageDraw.Draw(masque)
    pinceau.ellipse([0, 0, petit - 1, petit - 1], fill=int(255 * opacite))
    masque = masque.resize((int(rayon * 2), int(rayon * 2)), Image.Resampling.BILINEAR)

    calque = Image.new("RGBA", image.size, (*couleur, 0))
    calque.paste((*couleur, 255), (int(centre[0] - rayon), int(centre[1] - rayon)), masque)
    return Image.alpha_composite(image, calque)


def fleur(image: Image.Image, centre, rayon: float, couleur, opacite: float = 0.5) -> Image.Image:
    """Fleur stylisée (8 pétales) posée en transparence."""
    calque = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pinceau = ImageDraw.Draw(calque)
    cx, cy = centre
    alpha = int(255 * opacite)
    for index in range(8):
        angle = index * math.pi / 4
        px = cx + math.cos(angle) * rayon * 0.62
        py = cy + math.sin(angle) * rayon * 0.62
        pinceau.ellipse(
            [px - rayon * 0.44, py - rayon * 0.44, px + rayon * 0.44, py + rayon * 0.44],
            fill=(*couleur, alpha),
        )
    pinceau.ellipse(
        [cx - rayon * 0.32, cy - rayon * 0.32, cx + rayon * 0.32, cy + rayon * 0.32],
        fill=(255, 253, 248, int(255 * min(1.0, opacite + 0.3))),
    )
    return Image.alpha_composite(image, calque)


def etoile(image: Image.Image, centre, taille: float, couleur, opacite: float = 0.6) -> Image.Image:
    """Petite étincelle à quatre branches."""
    calque = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pinceau = ImageDraw.Draw(calque)
    cx, cy = centre
    remplissage = (*couleur, int(255 * opacite))
    pinceau.polygon(
        [
            (cx, cy - taille),
            (cx + taille * 0.22, cy - taille * 0.22),
            (cx + taille, cy),
            (cx + taille * 0.22, cy + taille * 0.22),
            (cx, cy + taille),
            (cx - taille * 0.22, cy + taille * 0.22),
            (cx - taille, cy),
            (cx - taille * 0.22, cy - taille * 0.22),
        ],
        fill=remplissage,
    )
    return Image.alpha_composite(image, calque)


def pilule_texte(image: Image.Image, centre, texte: str, base: float) -> Image.Image:
    """Petite étiquette translucide (marqueur « visuel provisoire »)."""
    calque = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pinceau = ImageDraw.Draw(calque)
    police = charger_police(int(base * 0.026))

    boite = pinceau.textbbox((0, 0), texte, font=police)
    largeur_texte = boite[2] - boite[0]
    hauteur_texte = boite[3] - boite[1]
    marge_x, marge_y = base * 0.035, base * 0.022
    cx, cy = centre
    pinceau.rounded_rectangle(
        [
            cx - largeur_texte / 2 - marge_x,
            cy - hauteur_texte / 2 - marge_y,
            cx + largeur_texte / 2 + marge_x,
            cy + hauteur_texte / 2 + marge_y,
        ],
        radius=(hauteur_texte + 2 * marge_y) / 2,
        fill=(255, 255, 255, 210),
    )
    pinceau.text((cx, cy), texte, font=police, fill=(125, 102, 189, 255), anchor="mm")
    return Image.alpha_composite(image, calque)


# ------------------------------------------------------------------------------------
# Visuel d'arrière-plan de l'écran 1 (invitation)
# ------------------------------------------------------------------------------------
def construire_fond(taille=(1200, 1500)) -> Image.Image:
    largeur, hauteur = taille
    image = degrade_vertical(taille, (255, 226, 236), (238, 231, 255)).convert("RGBA")

    # Grandes taches pastel, très douces, réparties sur la surface.
    image = tache_douce(image, (largeur * 0.12, hauteur * 0.10), largeur * 0.62, (255, 248, 236), 0.85)
    image = tache_douce(image, (largeur * 0.92, hauteur * 0.30), largeur * 0.58, LAVANDE, 0.32)
    image = tache_douce(image, (largeur * 0.20, hauteur * 0.70), largeur * 0.60, ROSE_CLAIR, 0.75)
    image = tache_douce(image, (largeur * 0.85, hauteur * 0.94), largeur * 0.66, PECHE, 0.34)
    image = tache_douce(image, (largeur * 0.50, hauteur * 0.48), largeur * 0.75, CREME, 0.45)

    # Fleurs et étincelles : surtout sur les bords, pour laisser la carte lisible.
    image = fleur(image, (largeur * 0.10, hauteur * 0.06), largeur * 0.075, ROSE, 0.5)
    image = fleur(image, (largeur * 0.93, hauteur * 0.13), largeur * 0.06, LAVANDE, 0.42)
    image = fleur(image, (largeur * 0.07, hauteur * 0.90), largeur * 0.085, ROSE, 0.42)
    image = fleur(image, (largeur * 0.95, hauteur * 0.82), largeur * 0.05, PECHE, 0.45)
    image = fleur(image, (largeur * 0.50, hauteur * 0.965), largeur * 0.07, LAVANDE, 0.35)
    image = etoile(image, (largeur * 0.78, hauteur * 0.06), largeur * 0.02, ROSE, 0.75)
    image = etoile(image, (largeur * 0.28, hauteur * 0.95), largeur * 0.018, LAVANDE, 0.7)
    image = etoile(image, (largeur * 0.04, hauteur * 0.52), largeur * 0.015, ROSE, 0.6)
    image = etoile(image, (largeur * 0.97, hauteur * 0.55), largeur * 0.017, PECHE, 0.6)

    # Fine bordure blanche + étiquette discrète en bas.
    calque = Image.new("RGBA", taille, (0, 0, 0, 0))
    pinceau = ImageDraw.Draw(calque)
    marge = largeur * 0.035
    pinceau.rounded_rectangle(
        [marge, marge, largeur - marge, hauteur - marge],
        radius=largeur * 0.05,
        outline=(255, 255, 255, 130),
        width=max(2, int(largeur * 0.004)),
    )
    image = Image.alpha_composite(image, calque)
    # Aucun texte : sur téléphone, l'image de fond est recadrée sur les côtés et
    # un libellé large serait tronqué. L'illustration reste volontairement abstraite
    # (formes pastel uniquement) pour qu'on ne la confonde jamais avec une photo.
    return image.convert("RGB")


# ------------------------------------------------------------------------------------
# Emplacements de la galerie (formats portrait / paysage / carré)
# ------------------------------------------------------------------------------------
def construire_emplacement(taille, numero: str) -> Image.Image:
    largeur, hauteur = taille
    image = degrade_vertical(taille, (255, 232, 240), (243, 236, 255)).convert("RGBA")

    image = tache_douce(image, (largeur * 0.18, hauteur * 0.12), largeur * 0.55, CREME, 0.8)
    image = tache_douce(image, (largeur * 0.88, hauteur * 0.78), largeur * 0.6, PECHE, 0.28)
    image = tache_douce(image, (largeur * 0.5, hauteur * 0.5), largeur * 0.7, ROSE_CLAIR, 0.42)

    image = fleur(image, (largeur * 0.86, hauteur * 0.14), largeur * 0.06, ROSE, 0.42)
    image = fleur(image, (largeur * 0.13, hauteur * 0.86), largeur * 0.055, LAVANDE, 0.4)
    image = etoile(image, (largeur * 0.2, hauteur * 0.18), largeur * 0.016, PECHE, 0.7)
    image = etoile(image, (largeur * 0.82, hauteur * 0.9), largeur * 0.014, ROSE, 0.65)

    # Pastille centrale avec le numéro de l'emplacement.
    base = min(largeur, hauteur)
    calque = Image.new("RGBA", taille, (0, 0, 0, 0))
    pinceau = ImageDraw.Draw(calque)
    rayon = base * 0.085
    cx, cy = largeur / 2, hauteur / 2
    pinceau.ellipse([cx - rayon, cy - rayon, cx + rayon, cy + rayon], fill=(255, 255, 255, 205))
    pinceau.ellipse(
        [cx - rayon, cy - rayon, cx + rayon, cy + rayon],
        outline=(255, 255, 255, 240),
        width=max(2, int(base * 0.004)),
    )
    police = charger_police(int(base * 0.075))
    pinceau.text((cx, cy), numero, font=police, fill=(169, 67, 106, 255), anchor="mm")
    image = Image.alpha_composite(image, calque)
    return image.convert("RGB")


def main() -> int:
    DOSSIER_GALERIE.mkdir(parents=True, exist_ok=True)

    construire_fond().save(DOSSIER_IMAGES / "fond.jpg", "JPEG", quality=84, optimize=True, progressive=True)
    print("✓ public/images/fond.jpg")

    for index, format_nom in enumerate(SUITE_FORMATS, start=1):
        numero = f"{index:02d}"
        nom_fichier = f"photo-{numero}.jpg"
        construire_emplacement(FORMATS[format_nom], numero).save(
            DOSSIER_GALERIE / nom_fichier, "JPEG", quality=82, optimize=True, progressive=True
        )
        print(f"✓ public/images/galerie/{nom_fichier}")

    print("\nTerminé : visuels neutres générés (aucune photo personnelle, aucun téléchargement).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
