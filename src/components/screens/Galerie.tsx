"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Info } from "lucide-react";
import { ActionsEcran, CarteEcran, Ecran } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { Polaroid } from "@/components/gallery/Polaroid";
import { Visionneuse } from "@/components/gallery/Visionneuse";
import { photosAffichees, utilisePhotosProvisoires } from "@/data/photos";
import { galerie, navigation } from "@/data/messages";

type ProprietesGalerie = {
  onSuivant: () => void;
  onPrecedent: () => void;
};

/** ÉCRAN 3 — La galerie photo. */
export function Galerie({ onSuivant, onPrecedent }: ProprietesGalerie) {
  const photos = photosAffichees();
  const provisoire = utilisePhotosProvisoires();
  const [indexOuvert, setIndexOuvert] = useState<number | null>(null);

  return (
    <Ecran id="ecran-galerie" largeur="large" className="animate-fade-up">
      <CarteEcran
        titre={galerie.title}
        surtitre="La galerie"
        idTitre="titre-galerie"
        icone={<Camera className="h-6 w-6" aria-hidden="true" />}
      >
        <p>{galerie.paragraphs[0]}</p>
        <p>{galerie.paragraphs[1]}</p>

        {provisoire ? (
          <div
            data-testid="alerte-photos-provisoires"
            className="flex items-start gap-3 rounded-2xl border border-dashed border-lavender-300 bg-lavender-50/85 px-4 py-3 text-left text-[0.82rem] leading-relaxed text-ink-soft"
          >
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-lavender-500" aria-hidden="true" />
            <p>
              Les cadres ci-dessous sont des <strong>emplacements provisoires</strong> : ils ne contiennent
              aucune photo personnelle. Pour mettre vos vraies images, déposez les fichiers{" "}
              <code className="rounded bg-white/80 px-1 font-semibold text-ink">
                public/images/galerie/photo-01.jpg
              </code>{" "}
              (puis <code className="rounded bg-white/80 px-1">photo-02.jpg</code>, etc.) et complétez la
              liste dans <code className="rounded bg-white/80 px-1">src/data/photos.ts</code>. ⚠️ Tout fichier
              placé dans le dossier <code className="rounded bg-white/80 px-1">public/</code> sera accessible
              publiquement une fois le site en ligne.
            </p>
          </div>
        ) : null}

        {/* --- Grille de photos --- */}
        <ul
          data-testid="grille-photos"
          className="mt-2 grid grid-cols-1 gap-5 min-[360px]:grid-cols-2 sm:gap-6 md:grid-cols-3 xl:grid-cols-4"
        >
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <Polaroid
                photo={photo}
                index={index}
                prioritaire={index < 2}
                onOuvrir={() => setIndexOuvert(index)}
              />
            </li>
          ))}
        </ul>

        <p className="text-center text-[0.8rem] text-ink-muted">
          Astuce : touchez une photo pour l’agrandir, puis{" "}
          <kbd className="rounded bg-white/80 px-1">Échap</kbd> pour fermer.
        </p>

        <ActionsEcran>
          <Bouton
            variante="secondaire"
            onClick={onPrecedent}
            data-testid="bouton-revenir-galerie"
            iconeGauche={<ArrowLeft className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            {navigation.precedent}
          </Bouton>
          <Bouton
            onClick={onSuivant}
            data-testid="bouton-continuer-galerie"
            iconeDroite={<ArrowRight className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            {navigation.suivant}
          </Bouton>
        </ActionsEcran>
      </CarteEcran>

      <Visionneuse
        photos={photos}
        index={indexOuvert}
        onFermer={() => setIndexOuvert(null)}
        onChangerIndex={setIndexOuvert}
      />
    </Ecran>
  );
}
