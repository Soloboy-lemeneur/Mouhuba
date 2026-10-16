import { ImageOff } from "lucide-react";
import { galerie as textesGalerie } from "@/data/messages";
import { cn } from "@/lib/utils";

/**
 * Affichage de remplacement lorsqu'une photo est absente du dossier
 * public/images/galerie/ (ou si le fichier ne se charge pas).
 *
 * Le nom du fichier attendu est indiqué : il suffit de le déposer pour que la
 * photo apparaisse. Utilisé à la fois par les vignettes et par la galerie agrandie.
 */
export function PhotoManquante({
  fichier,
  compact = false,
  className,
}: {
  fichier: string;
  /** Version très courte (sans le nom de fichier) pour les petits cadres. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-1.5 px-3 text-center",
        className ?? "bg-cream-100",
      )}
      data-testid="photo-manquante"
    >
      <ImageOff className="h-6 w-6 text-rose-400" aria-hidden="true" />
      <span className="text-[0.72rem] font-semibold leading-tight text-ink-soft">
        {textesGalerie.imageManquante.titre}
      </span>
      {!compact ? (
        <span className="break-all text-[0.62rem] leading-tight text-ink-muted">{fichier}</span>
      ) : null}
    </span>
  );
}
