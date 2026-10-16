"use client";

import { ArrowLeft, ArrowRight, Flower2 } from "lucide-react";
import { ActionsEcran, CarteEcran, Ecran } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { mot, navigation } from "@/data/messages";

type ProprietesMot = {
  onSuivant: () => void;
  onPrecedent: () => void;
};

/** ÉCRAN 2 — Le petit mot. */
export function Mot({ onSuivant, onPrecedent }: ProprietesMot) {
  const [premier, deuxieme, troisieme] = mot.paragraphs;

  return (
    <Ecran id="ecran-mot" className="animate-fade-up">
      <CarteEcran
        titre={mot.title}
        surtitre="Un petit mot"
        idTitre="titre-mot"
        icone={<Flower2 className="h-6 w-6" aria-hidden="true" />}
      >
        <p>{premier}</p>
        <p>{deuxieme}</p>

        <p className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-4 text-center font-title text-[1.05rem] italic leading-[1.8] text-rose-700 sm:text-[1.15rem]">
          {troisieme}
        </p>

        <ActionsEcran>
          <Bouton
            variante="secondaire"
            onClick={onPrecedent}
            data-testid="bouton-revenir-mot"
            iconeGauche={<ArrowLeft className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            {navigation.precedent}
          </Bouton>
          <Bouton
            onClick={onSuivant}
            data-testid="bouton-continuer-mot"
            iconeDroite={<ArrowRight className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            {navigation.suivant}
          </Bouton>
        </ActionsEcran>
      </CarteEcran>
    </Ecran>
  );
}
