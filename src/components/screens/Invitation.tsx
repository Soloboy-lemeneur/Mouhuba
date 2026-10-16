"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Bouton } from "@/components/ui/Bouton";
import { Coeur, Etoile, Fleur } from "@/components/ui/Decor";
import { invitation } from "@/data/messages";
import { site } from "@/data/site";
import { separerEmoji } from "@/lib/utils";

type ProprietesInvitation = {
  onOuvrir: () => void;
};

/**
 * ÉCRAN 1 — L'invitation.
 *
 * La même photo sert d'arrière-plan dans les deux dispositions, sans jamais être
 * recadrée au point de perdre le visage :
 *   • téléphone et tablette → large bandeau en haut de l'écran, carte juste en dessous
 *     (la photo et le texte ne se recouvrent jamais : lisibilité parfaite) ;
 *   • ordinateur (≥ 1024 px) → panneau encadré sur la gauche, carte sur la droite.
 *
 * Le cadrage vertical de la photo est réglable dans src/data/site.ts → `positionFocale`.
 */
export function Invitation({ onOuvrir }: ProprietesInvitation) {
  const [imageIndisponible, setImageIndisponible] = useState(false);
  // « Coucou Saïda ! 🌸 » : l'émoji final est rendu un peu plus petit que le texte script.
  const titre = separerEmoji(invitation.greeting);

  return (
    <section
      id="ecran-invitation"
      aria-labelledby="titre-invitation"
      className="relative isolate flex min-h-[max(100svh,34rem)] w-full flex-col lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-12 xl:gap-14"
    >
      {/* ---------- La photo ---------- */}
      <div
        aria-hidden="true"
        className="relative h-[42svh] min-h-[15rem] w-full shrink-0 overflow-hidden sm:h-[48svh] md:h-[52svh] lg:h-[min(78svh,42rem)] lg:w-[38%] lg:rounded-[2rem] lg:shadow-card lg:ring-1 lg:ring-white/70"
      >
        {!imageIndisponible ? (
          <Image
            src={site.fond.chemin}
            alt=""
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 38vw"
            onError={() => setImageIndisponible(true)}
            style={{ objectPosition: site.fond.positionFocale }}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-rose-200 via-cream-200 to-lavender-200" />
        )}

        {/* Traitement visuel : la photo s'adoucit vers le bas et rencontre le fond pastel
            de la page sans démarcation nette. */}
        {/* Sur ordinateur, la photo est un panneau encadré : aucun fondu n'est nécessaire. */}
        <div className="absolute inset-0 bg-linear-to-b from-rose-100/25 via-transparent to-lavender-100/30 lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#fff7f9] via-[#fff7f9]/70 to-transparent lg:hidden" />
      </div>

      {/* ---------- Halo clair + ornements ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(46rem_26rem_at_50%_78%,rgba(255,252,250,0.95),transparent_74%)] lg:bg-[radial-gradient(40rem_26rem_at_76%_50%,rgba(255,252,250,0.92),transparent_78%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Fleur className="animate-float-slow absolute left-[6%] top-[6%] h-9 w-9 text-rose-300/80 lg:left-[42%] lg:top-[14%]" />
        <Etoile className="animate-twinkle absolute right-[10%] top-[9%] h-5 w-5 text-lavender-300/90" />
        <Coeur className="animate-float-mid absolute bottom-[12%] left-[11%] h-5 w-5 text-peach-300/90" />
        <Etoile className="animate-twinkle absolute bottom-[18%] right-[15%] h-4 w-4 text-rose-300/80" />
      </div>

      {/* ---------- Carte d'invitation ---------- */}
      <div className="flex flex-1 items-center justify-center px-4 py-7 sm:px-6 lg:px-0 lg:py-0">
        <article className="card-pastel animate-scale-in relative w-full max-w-[31rem] px-5 py-6 text-center sm:max-w-xl sm:px-10 sm:py-9 lg:max-w-[32rem]">
          <Fleur
            aria-hidden="true"
            className="absolute -left-2 -top-3 h-10 w-10 rotate-12 text-rose-300 sm:-left-3 sm:-top-4 sm:h-12 sm:w-12"
          />
          <Fleur
            aria-hidden="true"
            className="absolute -bottom-3 -right-2 h-9 w-9 -rotate-12 text-lavender-300 sm:-bottom-4 sm:-right-3 sm:h-11 sm:w-11"
          />

          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-lavender-500 sm:text-[0.72rem]">
            {invitation.eyebrow}
          </p>

          <h1
            id="titre-invitation"
            className="text-shadow-soft mt-2.5 font-display text-[2.5rem] leading-[1.32] text-rose-700 sm:mt-3 sm:text-6xl"
          >
            {titre.texte}
            {titre.emoji ? (
              <>
                {" "}
                <span className="align-middle text-[0.58em] leading-none">{titre.emoji}</span>
              </>
            ) : null}
          </h1>

          <div
            aria-hidden="true"
            className="mx-auto mt-3 flex items-center justify-center gap-2 text-rose-300"
          >
            <span className="h-px w-10 bg-current" />
            <Fleur className="h-3.5 w-3.5" />
            <span className="h-px w-10 bg-current" />
          </div>

          <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-[1.8] text-ink-soft sm:mt-5 sm:text-[1.05rem]">
            {invitation.paragraph}
          </p>

          <p className="mt-4 font-title text-[1.05rem] italic text-rose-600 sm:mt-5 sm:text-xl">
            {invitation.question}
          </p>

          <div className="mt-6 flex justify-center sm:mt-7">
            <Bouton
              onClick={onOuvrir}
              taille="normal"
              data-testid="bouton-ouvrir-surprise"
              iconeDroite={<Sparkles className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              {invitation.cta}
            </Bouton>
          </div>

          {imageIndisponible ? (
            <p
              role="status"
              className="mt-6 rounded-2xl border border-dashed border-lavender-300 bg-white/70 px-4 py-3 text-left text-xs text-ink-muted"
            >
              Photo introuvable. Déposez votre fichier ici :{" "}
              <code className="font-semibold text-ink-soft">public/images/fond.jpg</code> (l’ambiance pastel
              s’affiche en attendant).
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
