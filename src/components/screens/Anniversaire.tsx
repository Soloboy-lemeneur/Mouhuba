"use client";

import { ArrowLeft, Cake, Gift } from "lucide-react";
import { ActionsEcran, CarteEcran, Ecran } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { Confettis } from "@/components/ui/Confettis";
import { anniversaire, navigation } from "@/data/messages";

type ProprietesAnniversaire = {
  onSuivant: () => void;
  onPrecedent: () => void;
};

/** ÉCRAN 4 — Le message d'anniversaire, accompagné de confettis très légers. */
export function Anniversaire({ onSuivant, onPrecedent }: ProprietesAnniversaire) {
  return (
    <Ecran id="ecran-anniversaire" className="animate-fade-up">
      <div className="relative">
        {/* Confettis discrets : ils tombent une seule fois à l'affichage de l'écran. */}
        <Confettis nombre={22} className="-z-0" />

        <CarteEcran
          titre={anniversaire.title}
          surtitre="Le jour J, prolongé"
          idTitre="titre-anniversaire"
          icone={<Cake className="h-6 w-6" aria-hidden="true" />}
          className="relative z-10"
        >
          {anniversaire.paragraphs.map((paragraphe, index) => (
            <p
              key={index}
              className={
                index === anniversaire.paragraphs.length - 1 ? "font-semibold text-rose-700" : undefined
              }
            >
              {paragraphe}
            </p>
          ))}

          <ActionsEcran>
            <Bouton
              variante="secondaire"
              onClick={onPrecedent}
              data-testid="bouton-revenir-anniversaire"
              iconeGauche={<ArrowLeft className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              {navigation.precedent}
            </Bouton>
            <Bouton
              onClick={onSuivant}
              data-testid="bouton-decouvrir-cadeau"
              iconeDroite={<Gift className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              {anniversaire.cta}
            </Bouton>
          </ActionsEcran>
        </CarteEcran>
      </div>
    </Ecran>
  );
}
