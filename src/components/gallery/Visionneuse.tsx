"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cheminImage, type FormatPhoto, type Photo } from "@/data/photos";
import { galerie as textesGalerie } from "@/data/messages";
import { useVerrouDefilement } from "@/lib/hooks";
import { Portail } from "@/components/ui/Portail";
import { PhotoManquante } from "@/components/gallery/PhotoManquante";

/** Cadre de la photo agrandie, ajusté à sa proportion (portrait / paysage / carré). */
const CADRES: Record<FormatPhoto, string> = {
  portrait: "h-[min(66svh,38rem)] w-[min(92vw,30rem)]",
  paysage: "h-[min(66svh,38rem)] w-[min(92vw,52rem)]",
  carre: "h-[min(66svh,34rem)] w-[min(92vw,34rem)]",
};

/**
 * Image affichée en grand. Composant dédié : chaque changement de photo
 * remonte un état neuf (grâce à la clé `key`), sans effet de réinitialisation.
 */
function ImageAgrandie({ photo }: { photo: Photo }) {
  const [erreur, setErreur] = useState(false);

  if (erreur) {
    return <PhotoManquante fichier={photo.fichier} className="bg-white/10 text-white" />;
  }

  return (
    <Image
      src={cheminImage(photo)}
      alt={photo.alt}
      fill
      sizes="(max-width: 767px) 92vw, 44rem"
      onError={() => setErreur(true)}
      className="object-contain"
    />
  );
}

type ProprietesVisionneuse = {
  photos: Photo[];
  /** Index de la photo affichée en grand, ou null si la fenêtre est fermée. */
  index: number | null;
  onFermer: () => void;
  onChangerIndex: (index: number) => void;
};

/**
 * Galerie agrandie (fenêtre modale).
 * - Fermeture : bouton ✕, clic sur le fond, ou touche Échap.
 * - Navigation : flèches ◀ ▶, touches ← →, ou balayage du doigt sur l'image.
 * - Le focus clavier reste enfermé dans la fenêtre tant qu'elle est ouverte.
 */
export function Visionneuse({ photos, index, onFermer, onChangerIndex }: ProprietesVisionneuse) {
  const ouvert = index !== null && index >= 0 && index < photos.length;
  const refFenetre = useRef<HTMLDivElement | null>(null);
  const refFermer = useRef<HTMLButtonElement | null>(null);
  const departTactile = useRef<{ x: number; y: number } | null>(null);

  useVerrouDefilement(ouvert);

  /* À l'ouverture, le focus va sur le bouton de fermeture. */
  useEffect(() => {
    if (ouvert) refFermer.current?.focus();
  }, [ouvert]);

  /* Clavier : Échap, flèches, et maintien du focus dans la fenêtre. */
  useEffect(() => {
    if (!ouvert || index === null) return;

    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") {
        evenement.preventDefault();
        onFermer();
        return;
      }

      if (evenement.key === "ArrowRight") {
        evenement.preventDefault();
        onChangerIndex((index + 1) % photos.length);
        return;
      }

      if (evenement.key === "ArrowLeft") {
        evenement.preventDefault();
        onChangerIndex((index - 1 + photos.length) % photos.length);
        return;
      }

      if (evenement.key === "Tab") {
        const noeud = refFenetre.current;
        if (!noeud) return;
        const focusables = Array.from(
          noeud.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.offsetParent !== null);
        if (focusables.length === 0) return;

        const premier = focusables[0];
        const dernier = focusables[focusables.length - 1];
        const actif = document.activeElement;

        if (evenement.shiftKey && (actif === premier || !noeud.contains(actif))) {
          evenement.preventDefault();
          dernier.focus();
        } else if (!evenement.shiftKey && actif === dernier) {
          evenement.preventDefault();
          premier.focus();
        }
      }
    };

    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert, index, photos.length, onFermer, onChangerIndex]);

  if (!ouvert || index === null) return null;

  const photo = photos[index];
  const plusieursPhotos = photos.length > 1;

  return (
    <Portail>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} sur ${photos.length}${photo.legende ? ` : ${photo.legende}` : ""}`}
        data-testid="visionneuse"
        data-lightbox="ouvert"
        data-zone-balayage="non"
        className="animate-fade-in fixed inset-0 z-50 flex flex-col"
      >
        {/* Fond sombre cliquable pour fermer. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onFermer}
          className="absolute inset-0 h-full w-full cursor-zoom-out bg-ink/75 backdrop-blur-md"
        />

        <div ref={refFenetre} className="relative z-10 flex h-full flex-col">
          {/* Barre supérieure : compteur + fermeture */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <p className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
              {index + 1} / {photos.length}
            </p>
            <button
              ref={refFermer}
              type="button"
              onClick={onFermer}
              aria-label={textesGalerie.altFermeture}
              data-testid="fermer-visionneuse"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Photo */}
          <div className="flex min-h-0 flex-1 items-center justify-center gap-1 px-2 sm:gap-4 sm:px-6">
            {plusieursPhotos ? (
              <button
                type="button"
                onClick={() => onChangerIndex((index - 1 + photos.length) % photos.length)}
                aria-label={textesGalerie.altPrecedente}
                data-testid="visionneuse-precedente"
                className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
            ) : null}

            <div
              onTouchStart={(evenement) => {
                const touche = evenement.touches[0];
                departTactile.current = { x: touche.clientX, y: touche.clientY };
              }}
              onTouchEnd={(evenement) => {
                if (!departTactile.current || !plusieursPhotos) return;
                const touche = evenement.changedTouches[0];
                const dx = touche.clientX - departTactile.current.x;
                const dy = touche.clientY - departTactile.current.y;
                departTactile.current = null;
                if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
                  onChangerIndex(
                    dx < 0 ? (index + 1) % photos.length : (index - 1 + photos.length) % photos.length,
                  );
                }
              }}
              className={`animate-scale-in relative max-w-full ${CADRES[photo.format]}`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/25">
                <ImageAgrandie key={photo.id} photo={photo} />
              </div>
            </div>

            {plusieursPhotos ? (
              <button
                type="button"
                onClick={() => onChangerIndex((index + 1) % photos.length)}
                aria-label={textesGalerie.altSuivante}
                data-testid="visionneuse-suivante"
                className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {/* Légende */}
          <div className="px-4 pb-6 pt-3 text-center sm:px-6 sm:pb-8">
            {photo.legende ? (
              <p className="mx-auto max-w-2xl font-title text-base italic text-white/95 sm:text-lg">
                {photo.legende}
              </p>
            ) : null}
            {plusieursPhotos ? (
              <p className="mt-2 text-xs text-white/60">
                Utilisez ◀ ▶, les touches ← →, ou balayez la photo.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Portail>
  );
}
