"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cheminImage, type FormatPhoto, type Photo } from "@/data/photos";
import { PhotoManquante } from "@/components/gallery/PhotoManquante";
import { galerie as textesGalerie } from "@/data/messages";
import { cn } from "@/lib/utils";

/** Proportions de cadre proposées (proches des tirages classiques). */
const RATIOS: Record<FormatPhoto, string> = {
  portrait: "aspect-[4/5]",
  paysage: "aspect-[4/3]",
  carre: "aspect-square",
};

type ProprietesPolaroid = {
  photo: Photo;
  index: number;
  onOuvrir: () => void;
  /** true pour les deux premières photos : elles se chargent en priorité. */
  prioritaire?: boolean;
};

/**
 * Vignette façon Polaroid : cadre blanc, légère inclinaison, ombre douce.
 * Cliquer (ou appuyer au clavier sur Entrée/Espace) ouvre la photo en grand.
 */
export function Polaroid({ photo, index, onOuvrir, prioritaire = false }: ProprietesPolaroid) {
  const [erreur, setErreur] = useState(false);
  const source = cheminImage(photo);
  const titreAccessible = photo.legende
    ? `${textesGalerie.altOuverture} : ${photo.legende}`
    : textesGalerie.altOuverture;

  return (
    <figure className="group flex flex-col">
      <div
        style={{ "--rot": `${photo.inclinaison}deg` } as CSSProperties}
        className="rotate-[var(--rot)] rounded-[1.15rem] bg-white p-2.5 pb-0 shadow-polaroid ring-1 ring-white/80 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-0 group-focus-within:rotate-0"
      >
        <button
          type="button"
          onClick={onOuvrir}
          aria-label={titreAccessible}
          aria-haspopup="dialog"
          data-testid={`vignette-photo-${index}`}
          className="block w-full cursor-zoom-in rounded-[0.7rem]"
        >
          <span
            className={cn(
              "relative block w-full overflow-hidden rounded-[0.7rem] bg-cream-200",
              RATIOS[photo.format],
            )}
          >
            {erreur ? (
              <span className="absolute inset-0">
                <PhotoManquante fichier={photo.fichier} />
              </span>
            ) : (
              <Image
                src={source}
                alt={photo.alt}
                fill
                sizes="(max-width: 359px) 88vw, (max-width: 767px) 45vw, (max-width: 1279px) 30vw, 22rem"
                priority={prioritaire}
                loading={prioritaire ? undefined : "lazy"}
                onError={() => setErreur(true)}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            )}

            {!erreur ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition duration-300 group-hover:bg-ink/20 group-hover:opacity-100 group-focus-within:bg-ink/20 group-focus-within:opacity-100"
              >
                <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
              </span>
            ) : null}
          </span>
        </button>

        {/* Bas du cadre Polaroid : la légende (facultative). */}
        <figcaption
          className={cn(
            "flex min-h-11 items-center justify-center px-1 py-2 text-center leading-snug text-ink-soft",
            photo.legende ? "text-[0.72rem] sm:text-[0.8rem]" : "text-[0.68rem] italic text-ink-muted",
          )}
        >
          {/* Sans légende, la bande blanche du bas reste vide (comme un vrai Polaroid). */}
          {photo.legende ? <span className="line-clamp-2">{photo.legende}</span> : null}
        </figcaption>
      </div>
    </figure>
  );
}
