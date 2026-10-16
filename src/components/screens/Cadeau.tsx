"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Gift, RotateCcw } from "lucide-react";
import { Ecran } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { Confettis, Scintillements } from "@/components/ui/Confettis";
import { Fleur } from "@/components/ui/Decor";
import { BoiteCadeau, type PhaseCadeau } from "@/components/gift/BoiteCadeau";
import { useAnimationReduite } from "@/lib/hooks";
import { cadeau, navigation } from "@/data/messages";

type ProprietesCadeau = {
  onRecommencer: () => void;
  onPrecedent: () => void;
};

/** ÉCRAN 5 — Le cadeau final : la boîte s'ouvre, puis le message apparaît en douceur. */
export function Cadeau({ onRecommencer, onPrecedent }: ProprietesCadeau) {
  const animationReduite = useAnimationReduite();
  const [phase, setPhase] = useState<PhaseCadeau>("fermee");
  const minuteries = useRef<number[]>([]);
  const dejaLance = useRef(false);
  const refMessage = useRef<HTMLDivElement | null>(null);

  /* Nettoyage des minuteries si l'on quitte la page en pleine animation. */
  useEffect(
    () => () => {
      minuteries.current.forEach((identifiant) => window.clearTimeout(identifiant));
    },
    [],
  );

  const ouvrir = useCallback(() => {
    if (dejaLance.current) return;
    dejaLance.current = true;

    // Animations réduites : le message s'affiche directement, sans mouvement.
    if (animationReduite) {
      setPhase("ouverte");
      return;
    }

    setPhase("secousse");
    minuteries.current.push(window.setTimeout(() => setPhase("ouverture"), 620));
    minuteries.current.push(window.setTimeout(() => setPhase("ouverte"), 1950));
  }, [animationReduite]);

  /* Une fois ouvert, le focus part sur le message : il est lu par les lecteurs d'écran. */
  useEffect(() => {
    if (phase === "ouverte") refMessage.current?.focus();
  }, [phase]);

  const ouverte = phase === "ouverte";

  return (
    <Ecran id="ecran-cadeau" className="animate-fade-up">
      <div className="relative flex flex-col items-center pt-4 sm:pt-6">
        {/* Montée de confettis au moment où le couvercle s'envole. */}
        <Confettis nombre={26} actif={phase === "ouverture"} />

        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-lavender-500">
          Le dernier cadeau
        </p>
        <h2 id="titre-cadeau" className="mt-2 text-center font-title text-2xl leading-snug sm:text-3xl">
          {cadeau.titre}
        </h2>

        <BoiteCadeau phase={phase} onOuvrir={ouvrir} />

        {ouverte ? (
          <div
            ref={refMessage}
            tabIndex={-1}
            data-testid="message-final"
            className="card-pastel animate-fade-up relative mt-10 w-full max-w-2xl overflow-hidden px-5 py-8 text-center outline-none sm:px-10 sm:py-10"
          >
            <Scintillements nombre={10} className="opacity-45" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100/90 text-rose-500 ring-1 ring-rose-200">
                <Gift className="h-6 w-6" aria-hidden="true" />
              </div>

              <p className="mt-4 font-display text-[2.3rem] leading-[1.32] text-rose-700 sm:text-5xl">
                {cadeau.message[0]}
              </p>

              <div
                aria-hidden="true"
                className="mx-auto mt-4 flex items-center justify-center gap-2 text-rose-300"
              >
                <span className="h-px w-10 bg-current" />
                <Fleur className="h-3.5 w-3.5" />
                <span className="h-px w-10 bg-current" />
              </div>

              <div className="mt-5 flex flex-col gap-4 text-[0.97rem] leading-[1.85] text-ink-soft sm:text-[1.04rem]">
                {cadeau.message.slice(1).map((paragraphe, index) => (
                  <p
                    key={index}
                    className="animate-fade-up"
                    style={{ animationDelay: `${180 + index * 220}ms` }}
                  >
                    {paragraphe}
                  </p>
                ))}
              </div>

              <p className="mt-7 border-t border-rose-100 pt-5 font-title text-[1.02rem] italic text-rose-700 sm:text-[1.12rem]">
                {cadeau.signature}
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Bouton
                  variante="secondaire"
                  onClick={onPrecedent}
                  data-testid="bouton-revenir-cadeau"
                  iconeGauche={<ArrowLeft className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  {navigation.precedent}
                </Bouton>
                <Bouton
                  onClick={onRecommencer}
                  data-testid="bouton-revoir-surprise"
                  iconeGauche={<RotateCcw className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  {cadeau.rejouer}
                </Bouton>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Ecran>
  );
}
