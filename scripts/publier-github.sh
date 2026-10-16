#!/usr/bin/env bash
# =====================================================================================
#  Publication du projet sur GitHub — un seul geste.
#
#  Utilisation :
#     bash scripts/publier-github.sh https://github.com/VOTRE-COMPTE/surprise-saida.git
#     # ou, sans argument, le script vous demande l'adresse :
#     bash scripts/publier-github.sh
#
#  ⚠️  AVANT DE LANCER : créez le dépôt sur https://github.com/new
#       • Visibility : Private   ← recommandé : le site contient des photos personnelles
#       • Ne cochez NI « Add a README », NI « .gitignore », NI « license »
#         (le projet les contient déjà ; un dépôt vide évite tout conflit)
#
#  Le script ne stocke aucun mot de passe. Si GitHub demande une authentification,
#  utilisez un « Personal Access Token » comme mot de passe (voir README, section 4.1).
# =====================================================================================

set -euo pipefail

BRAVO=$'\033[1;36m'   # couleur d'information
ALERTE=$'\033[1;33m'
ERREUR=$'\033[1;31m'
FIN=$'\033[0m'

cd "$(dirname "$0")/.."

# ---------- 1. Vérifications préalables ----------
if ! command -v git >/dev/null 2>&1; then
  echo "${ERREUR}Git n'est pas installé sur cet ordinateur.${FIN}"
  echo "Installez-le depuis https://git-scm.com/downloads puis relancez ce script."
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "${ERREUR}Ce dossier n'est pas un dépôt Git.${FIN}"
  exit 1
fi

BRANCHE="$(git rev-parse --abbrev-ref HEAD)"

# Identité Git : indispensable pour signer le commit.
if ! git config user.email >/dev/null 2>&1 || [ -z "$(git config user.email || true)" ]; then
  echo "${ALERTE}Votre nom et votre adresse e-mail Git ne sont pas encore définis.${FIN}"
  echo "Renseignez-les une fois pour toutes (ils apparaîtront sur le dépôt) :"
  echo "  git config --global user.name  \"Votre nom\""
  echo "  git config --global user.email \"votre@email\""
  echo "puis remplacez l'auteur du commit déjà créé :"
  echo "  git commit --amend --reset-author --no-edit"
  exit 1
fi

# ---------- 2. Adresse du dépôt ----------
DEPOT="${1:-}"
if [ -z "$DEPOT" ]; then
  echo "${BRAVO}Adresse du dépôt GitHub (Ctrl+V, puis Entrée) :${FIN}"
  read -r DEPOT
fi

if [ -z "$DEPOT" ]; then
  echo "${ERREUR}Aucune adresse fournie. Rien n'a été fait.${FIN}"
  exit 1
fi

echo
echo "${BRAVO}→ Dépôt cible :${FIN} $DEPOT"
echo "${BRAVO}→ Branche     :${FIN} $BRANCHE"

# ---------- 3. Enregistrement du dépôt distant ----------
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$DEPOT"
  echo "  (l'adresse « origin » existante a été mise à jour)"
else
  git remote add origin "$DEPOT"
  echo "  (adresse « origin » enregistrée)"
fi

# ---------- 4. Envoi ----------
echo
echo "${BRAVO}Envoi des fichiers…${FIN}"
if git push -u origin "$BRANCHE"; then
  echo
  echo "${BRAVO}Fait ! Votre projet est sur GitHub.${FIN}"
  echo "Étapes suivantes :"
  echo "  1. Ouvrez la page du dépôt et vérifiez qu'il est bien en « Private »."
  echo "  2. Publiez le site sur Vercel : https://vercel.com/new (voir README, section 4.2)."
  exit 0
fi

# ---------- 5. Aide en cas d'échec ----------
echo
echo "${ERREUR}L'envoi n'a pas abouti.${FIN}"
echo "Causes les plus fréquentes, et comment s'en sortir :"
echo
echo "1) Le dépôt GitHub n'est pas vide (README ou licence créés à la création)."
echo "   → Solution la plus simple : supprimez le dépôt sur GitHub, recréez-le VIDE,"
echo "     puis relancez ce script."
echo "   → Ou, si vous préférez garder ce dépôt :"
echo "        git pull --rebase origin $BRANCHE"
echo "        git push -u origin $BRANCHE"
echo
echo "2) GitHub demande une authentification refusée :"
echo "   → Créez un Personal Access Token (Settings → Developer settings → Tokens,"
echo "     portée « repo ») et utilisez-le comme mot de passe."
echo
echo "3) Adresse mal saisie (elle doit finir par .git)."
echo "   → Relancez : bash scripts/publier-github.sh https://github.com/VOTRE-COMPTE/depot.git"
exit 1
