# 🌸 Une petite surprise pour Saïda

Un petit **livre numérique interactif en cinq écrans**, offert comme attention d'anniversaire :
une invitation, un mot, une galerie photo, un message d'anniversaire et un cadeau final à ouvrir.

- Site entièrement **statique** : aucune base de données, aucun compte, aucune clé secrète.
- Fonctionne sur **téléphone Android, iPhone, tablette et ordinateur**.
- Ambiance pastel (rose, crème, lavande, pêche), animations légères, respect de la préférence
  système « réduire les animations ».
- **Signature anonyme** à la fin — aucun nom n'apparaît en dehors de « Saïda ».

> ✅ **Vos 4 photos sont déjà installées** : 1 en arrière-plan de l'invitation
> (`public/images/fond.jpg`) et les 4 dans la galerie (`public/images/galerie/photo-01.jpg`
> → `photo-04.jpg`). Elles ont été redimensionnées pour le web et **toutes leurs
> métadonnées (date, appareil, éventuelles coordonnées GPS) ont été supprimées**.

---

## 1. Ce que contient le projet

```
surprise-saida/
├── public/
│   ├── favicon.svg                     icône de l'onglet
│   └── images/
│       ├── fond.jpg                    VOTRE PHOTO (écran 1, arrière-plan)
│       ├── apercu.svg                  aperçu affiché lors du partage du lien
│       └── galerie/
│           ├── photo-01.jpg            VOS PHOTOS (écran 3)
│           ├── photo-02.jpg
│           ├── photo-03.jpg
│           └── photo-04.jpg
├── scripts/
│   ├── importer-photos.py              importe vos photos (redimensionnement + nettoyage des métadonnées)
│   ├── generer-placeholders.py         visuels provisoires neutres (si vous repartez de zéro)
│   ├── captures.mjs                    génère les captures d'écran de `apercus/`
│   └── apercu-invitation.mjs           captures de l'invitation aux 4 largeurs sensibles
├── src/
│   ├── app/
│   │   ├── layout.tsx                  polices, métadonnées, en-tête HTML
│   │   ├── page.tsx                    page unique du site
│   │   └── globals.css                 palette, animations, accessibilité
│   ├── components/
│   │   ├── LivreInteractif.tsx         orchestrateur des cinq écrans
│   │   ├── screens/
│   │   │   ├── Invitation.tsx          écran 1 — l'invitation
│   │   │   ├── Mot.tsx                 écran 2 — le petit mot
│   │   │   ├── Galerie.tsx             écran 3 — la galerie photo
│   │   │   ├── Anniversaire.tsx        écran 4 — le message d'anniversaire
│   │   │   └── Cadeau.tsx              écran 5 — le cadeau final
│   │   ├── gallery/
│   │   │   ├── Polaroid.tsx            vignette façon Polaroid
│   │   │   └── Visionneuse.tsx         photo agrandie (Échap, flèches, balayage)
│   │   ├── gift/BoiteCadeau.tsx        boîte cadeau animée (dessinée en SVG)
│   │   └── ui/                         boutons, cartes, décor, confettis, portail
│   ├── data/
│   │   ├── messages.ts                 tous les textes du site
│   │   ├── photos.ts                   liste des photos de la galerie
│   │   └── site.ts                     titres, image de fond, couleurs
│   └── lib/                            crochets et petites fonctions utilitaires
├── tests/e2e/                          tests Playwright (parcours, responsive, a11y)
├── apercus/                            captures d'écran du rendu (générées)
├── next.config.ts · eslint.config.mjs · postcss.config.mjs · tsconfig.json
└── playwright.config.ts
```

**Tout le texte et toute la configuration modifiable tiennent dans deux fichiers :**
`src/data/messages.ts` (les phrases) et `src/data/photos.ts` (les photos).

---

## 2. Installation et lancement local

Prérequis : **Node.js 20.9 ou plus récent** ([nodejs.org](https://nodejs.org)) et npm.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le site en développement (http://localhost:3000)
npm run dev
```

Le site s'ouvre automatiquement à l'adresse <http://localhost:3000>.
Pour l'arrêter : `Ctrl + C` dans le terminal.

### Autres commandes utiles

| Commande                  | Ce qu'elle fait                                               |
| ------------------------- | ------------------------------------------------------------- |
| `npm run dev`             | Serveur de développement (rechargement à chaque modification) |
| `npm run build`           | Compilation de production                                     |
| `npm run start`           | Lance le site compilé (à faire après `npm run build`)         |
| `npm run typecheck`       | Vérification TypeScript (aucune erreur attendue)              |
| `npm run lint`            | Vérification ESLint                                           |
| `npm run format`          | Met en forme le code avec Prettier                            |
| `npm run check`           | TypeScript + ESLint + compilation, d'un seul coup             |
| `npm run test:e2e`        | Tests réels dans un navigateur (Playwright)                   |
| `npm run test:e2e:report` | Ouvre le rapport des tests dans le navigateur                 |
| `npm run placeholders`    | Régénère les visuels provisoires (nécessite Python + Pillow)  |

### Apercevoir un écran précis

Utile pour vérifier une mise en page sans refaire tout le parcours :

| Adresse                                     | Écran affiché          |
| ------------------------------------------- | ---------------------- |
| `http://localhost:3000/`                    | Écran 1 — l'invitation |
| `http://localhost:3000/?ecran=mot`          | Écran 2 — le petit mot |
| `http://localhost:3000/?ecran=galerie`      | Écran 3 — la galerie   |
| `http://localhost:3000/?ecran=anniversaire` | Écran 4 — le message   |
| `http://localhost:3000/?ecran=cadeau`       | Écran 5 — le cadeau    |

---

## 3. Remplacer ou ajouter des photos

### 3.1 Import automatique (le plus simple)

Placez vos nouvelles photos dans un dossier, puis :

```bash
npm run photos                       # lit ~/uploads, la 1ʳᵉ photo devient l'arrière-plan
python3 scripts/importer-photos.py --sources /chemin/vers/photos --fond 2
```

Le script corrige l'orientation, redimensionne pour le web, enregistre la photo
d'arrière-plan et les photos de la galerie, puis **supprime toutes les métadonnées**
(date, modèle d'appareil, coordonnées GPS éventuelles). Il ne reste plus qu'à décrire
les photos dans `src/data/photos.ts`.

### 3.2 Remplacer une photo à la main

1. Déposez le fichier dans `public/images/galerie/` sous le nom voulu (`photo-01.jpg`, …).
2. Ajustez la description correspondante dans `src/data/photos.ts`.
3. Si vous réutilisez **le même nom de fichier**, supprimez le dossier `.next/cache/images`
   puis relancez le site : Next.js garde sinon en mémoire l'ancienne version optimisée.

### 3.3 Réglages utiles

- **Cadrage de la photo d'arrière-plan** : `src/data/site.ts` → `site.fond.positionFocale`
  (`"50% 42%"` place le visage au centre du bandeau ; `0%` = haut de la photo, `100%` = bas).
- **Disposition de l'écran 1** : sur téléphone et tablette, la photo forme un bandeau en
  haut et la carte se place juste en dessous (aucun texte sur la photo). À partir de 1024 px,
  la photo devient un panneau encadré à gauche et la carte passe à droite.
- **Légendes** : laissez `legende: ""` pour une bande blanche vide, comme un vrai Polaroid.

### 3.4 La photo d'arrière-plan (écran 1)

1. Renommez votre photo en **`fond.jpg`**.
2. Placez-la dans **`public/images/`** (elle remplace la photo actuelle).
3. Format conseillé : une image **portrait d'au moins 1000 px de large**. Les photos
   horizontales fonctionnent aussi, mais sont davantage recadrées.
4. Facultatif : décrivez la photo dans `src/data/site.ts` → `site.fond.alt`, et ajustez
   le cadrage avec `site.fond.positionFocale`.

### 3.5 Les photos de la galerie (écran 3)

1. Copiez vos photos dans **`public/images/galerie/`** en les nommant :
   `photo-01.jpg`, `photo-02.jpg`, `photo-03.jpg`, …
   _(formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp` ; adaptez le nom dans le fichier de
   configuration si vous utilisez une autre extension)_
2. Ouvrez **`src/data/photos.ts`** et décrivez chaque photo dans le tableau `PHOTOS`
   (le modèle est déjà rempli pour vos 4 photos) :

   ```ts
   export const PHOTOS: Photo[] = [
     {
       id: "photo-01",
       fichier: "photo-01.jpg",
       alt: "Description courte de la photo (lue par les lecteurs d'écran).",
       legende: "Un souvenir qui fait sourire", // ou "" pour une bande blanche vide
       format: "portrait", // "portrait" | "paysage" | "carre"
       inclinaison: -2, // petite inclinaison du cadre, en degrés
     },
     // … une entrée par photo
   ];
   ```

3. Enregistrez : c'est tout. Les tests s'adaptent automatiquement au nombre de photos
   (`NB_PHOTOS` est lu depuis `src/data/photos.ts`), donc `npm run test:e2e` reste valable
   même après un ajout ou une suppression.

**Pour réorganiser** : changez l'ordre des lignes dans `PHOTOS`.
**Pour retirer une photo** : supprimez sa ligne (et, si vous voulez, le fichier image).

> 🖼️ Conseil de poids : les photos de téléphone font souvent 3 à 5 Mo. Compressez-les à environ
> 1600 px de large (outil en ligne gratuit, ou « Exporter pour le web »). Le site est déjà rapide,
> mais des photos légères s'afficheront instantanément, même en 4G.

> 🔒 **Confidentialité** : tout fichier placé dans `public/` est servi **publiquement** sur le site
> une fois en ligne (et se retrouve dans l'historique de votre dépôt Git). Avant de publier,
> vérifiez que le dépôt GitHub est bien **privé** si vous ne souhaitez pas que les photos soient
> accessibles à tout le monde — voir la section 4.

---

## 4. Publier le site (GitHub + Vercel)

### 4.0 Le dépôt Git est déjà prêt

Le projet est **déjà un dépôt Git** avec son premier commit : les 72 fichiers utiles sont
enregistrés, et les dossiers lourds (`node_modules`, `.next`, rapports de tests) sont ignorés.
Il ne reste donc que trois gestes : créer le dépôt sur GitHub, y envoyer le projet, publier sur Vercel.

#### 🔒 Confidentialité — à lire une fois

- Le projet **contient des photos personnelles**. Créez le dépôt GitHub en **Private**.
- Le site publié sur Vercel sera, lui, **accessible à toute personne possédant le lien**
  (c'est le principe du cadeau). Si vous ne voulez pas de lien public du tout, ne publiez pas :
  le site fonctionne parfaitement en local (`npm run build && npm run start`).
- Le site **n'est pas référencé** par les moteurs de recherche (`robots: noindex` dans
  `src/app/layout.tsx`) et n'ajoute aucun traceur ni cookie.

#### 👤 Mettre le projet à votre nom

Le commit existant a été créé avec un auteur neutre. Pour qu'il apparaisse sous votre nom
(à faire une seule fois) :

```bash
git config --global user.name "Votre nom"
git config --global user.email "votre@email"
git commit --amend --reset-author --no-edit
```

### 4.1 Envoyer le projet sur GitHub

1. Créez un compte sur [github.com](https://github.com) si nécessaire.
2. Allez sur **[github.com/new](https://github.com/new)** et créez un dépôt :
   - **Repository name** : `surprise-saida` (ou le nom de votre choix) ;
   - **Visibility : Private** ← recommandé ;
   - **ne cochez NI « Add a README » NI « .gitignore » NI « license »** :
     le projet les contient déjà, et un dépôt vide évite tout conflit.
3. Dans un terminal, à la racine du projet, lancez le script fourni :

```bash
bash scripts/publier-github.sh https://github.com/VOTRE-COMPTE/surprise-saida.git
```

Le script enregistre l'adresse, envoie le projet et vous rappelle les étapes suivantes.
En cas de souci, il affiche la cause probable et la correction à appliquer.

**Méthode manuelle** (équivalent, si vous préférez taper les commandes) :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/surprise-saida.git
git push -u origin main
```

> GitHub vous demandera votre mot de passe. Depuis 2021, il faut utiliser un
> **Personal Access Token** à la place : _Settings → Developer settings →
> Personal access tokens → Tokens (classic) → Generate new token_, cochez la portée
> `repo`, puis collez le jeton comme mot de passe. Les logiciels
> [GitHub Desktop](https://desktop.github.com) et [GitHub CLI](https://cli.github.com)
> (`gh auth login`) gèrent cette étape automatiquement.

**Mises à jour ultérieures** (nouvelle photo, texte modifié) :

```bash
git add .
git commit -m "Mise à jour des photos"
git push
```

### 4.2 Publier sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com) — « Continue with GitHub » est le plus simple.
2. Cliquez sur **Add New… → Project**, puis **Import** à côté du dépôt `surprise-saida`.
3. Vercel détecte Next.js tout seul : **ne changez aucun réglage**.
   - Framework Preset : `Next.js`
   - Build Command : `npm run build`
   - Output Directory : _(vide, laisser tel quel)_
   - Install Command : `npm install`
4. Cliquez sur **Deploy**. La compilation prend environ une minute.
5. Vous obtenez une adresse du type `https://surprise-saida.vercel.app` : **c'est le lien à envoyer.**

Pour mettre à jour le site plus tard (nouvelle photo, texte modifié) :

```bash
git add .
git commit -m "Mise à jour des photos"
git push
```

Vercel republie automatiquement dès que vous poussez sur GitHub.

### 4.3 Points à vérifier avant d'envoyer le lien

- [ ] Le site s'ouvre correctement **sur votre téléphone** (testez en 4G, pas seulement en Wi-Fi).
- [ ] Les cinq écrans s'enchaînent : invitation → mot → galerie → anniversaire → cadeau.
- [ ] La galerie affiche vos photos, et un clic les agrandit.
- [ ] Le cadeau s'ouvre et laisse apparaître le message final, avec la signature anonyme.
- [ ] Les noms de fichiers des photos sont **en minuscules, sans espaces ni accents**.
- [ ] Le dépôt GitHub est **privé** si les photos doivent rester confidentielles.
- [ ] Les moteurs de recherche ne référencent pas la page : c'est déjà le cas
      (`robots: { index: false, follow: false }` dans `src/app/layout.tsx`). Le site reste
      accessible à toute personne qui possède le lien — c'est le principe du cadeau.
- [ ] Si vous avez remplacé une photo en gardant le même nom de fichier : le dossier
      `.next/cache/images` a été supprimé (sinon l'ancienne version peut rester affichée).
- [ ] (Facultatif) Définissez la variable `NEXT_PUBLIC_SITE_URL` sur Vercel avec l'adresse
      finale (`https://…vercel.app`) pour soigner les aperçus de lien partagés.

---

## 5. Personnaliser les textes

Toutes les phrases sont dans **`src/data/messages.ts`**, regroupées par écran :

```ts
export const invitation = { eyebrow, greeting, paragraph, question, cta };
export const mot = { title, paragraphs };
export const galerie = { title, paragraphs, … };
export const anniversaire = { title, paragraphs, cta };
export const cadeau = { titre, consigne, message, signature, rejouer };
```

Modifiez le texte entre guillemets, enregistrez, et la page se met à jour.
Les émojis sont conservés tels quels (le site n'ajoute aucune musique et n'envoie aucune
notification).

Autres réglages dans `src/data/site.ts` :

- `site.titre` et `site.description` : affichés dans l'onglet et lors du partage du lien ;
- `site.confettis.couleurs` : couleurs des confettis de l'écran 4 (codes hexadécimaux) ;
- `site.confettis.maximum` : nombre maximum de confettis simultanés.

---

## 6. Tests effectués

Les tests sont réels : ils pilotent un vrai navigateur (Chromium **et** WebKit/Safari) via Playwright.

```bash
npm run build        # indispensable avant les tests
npm run test:e2e     # lance les 60 vérifications sur 3 profils
npm run test:e2e:report
```

Les profils testés sont : **ordinateur** (1280 × 900), **Android** (Google Pixel 7) et
**iPhone 13** (moteur WebKit de Safari).

Ce qui est vérifié automatiquement :

1. Enchaînement des **cinq écrans** dans l'ordre, puis retour au début.
2. Boutons « Continuer » / « Revenir en arrière » (aller **et** retour).
3. Galerie : 8 vignettes, ouverture en grand, navigation ◀ ▶, fermeture par **Échap**.
4. Ouverture du cadeau et apparition du message final (signature anonyme vérifiée).
5. Responsive : largeurs **320, 360, 390, 430, 768, 1024, 1280 et 1440 px** + absence de
   défilement horizontal + boutons ≥ 44 px de haut + nombre de colonnes de la galerie.
6. Accessibilité : langue française, lien « Aller au contenu », navigation au clavier
   (flèches ← →), focus enfermé dans la galerie agrandie, textes alternatifs des images.
7. Mode « animations réduites » : contenu complet, confettis désactivés, cadeau qui s'ouvre
   immédiatement.
8. Photos manquantes : le site reste propre et utilisable (message « Photo à venir »).
9. Console du navigateur : aucune erreur JavaScript.

Pour régénérer les captures d'écran de `apercus/` :

```bash
npm run build
npm run start          # dans un deuxième terminal
node scripts/captures.mjs
```

---

## 7. Notes techniques

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5.9** · **Tailwind CSS 4** · **Lucide React**.
- Les polices (Playfair Display, Quicksand, Great Vibes) sont téléchargées **à la compilation**
  par `next/font` puis servies par le site : aucune requête vers Google au chargement, et le
  site fonctionne sans dépendre d'un service extérieur.
- Les images passent par l'optimiseur de Next.js : conversion automatique en WebP/AVIF,
  chargement progressif, dimensions réservées (aucun décalage de mise en page).
- Un seul écran est monté à la fois : la page reste légère sur les téléphones modestes.
- La navigation clavier fonctionne partout : `Tab`, `Entrée`/`Espace`, flèches `←` `→`,
  `Échap` dans la galerie agrandie.
- ⚠️ Next.js met en cache les images optimisées dans `.next/cache/images`. **Si vous remplacez
  une photo en réutilisant le même nom de fichier et que l'ancienne version persiste**, supprimez
  ce dossier puis relancez le site. Sur Vercel, la nouvelle version s'applique au déploiement
  suivant.
- Le site n'inclut volontairement : ni musique automatique, ni formulaire, ni statistiques de
  visite, ni cookies.

---

## 8. Résultats des vérifications (16 octobre 2026)

Toutes les vérifications ci-dessous ont été **réellement exécutées** sur ce projet, pas seulement
prévues. Environnement : Node.js 20.20.2, npm 10.8.2.

| #   | Vérification                        | Commande                 | Résultat                                  |
| --- | ----------------------------------- | ------------------------ | ----------------------------------------- |
| 1   | Installation des dépendances        | `npm install`            | ✅ 376 paquets, 0 vulnérabilité bloquante |
| 2   | Vérification TypeScript             | `npm run typecheck`      | ✅ 0 erreur                               |
| 3   | Vérification ESLint                 | `npm run lint`           | ✅ 0 erreur, 0 avertissement              |
| 4   | Mise en forme du code               | `npx prettier --check .` | ✅ conforme                               |
| 5   | Compilation de production           | `npm run build`          | ✅ compilée en ~5 s                       |
| 6   | Parcours complet des 5 écrans       | `npm run test:e2e`       | ✅ validé                                 |
| 7   | Boutons précédent / suivant         | `npm run test:e2e`       | ✅ validé                                 |
| 8   | Galerie + agrandissement + Échap    | `npm run test:e2e`       | ✅ validé                                 |
| 9   | Ouverture du cadeau                 | `npm run test:e2e`       | ✅ validé                                 |
| 10  | Responsive 320 → 1440 px            | `npm run test:e2e`       | ✅ aucun débordement                      |
| 11  | Accessibilité (clavier, focus, alt) | `npm run test:e2e`       | ✅ validé                                 |
| 12  | Animations réduites                 | `npm run test:e2e`       | ✅ validé                                 |
| 13  | Photos manquantes                   | `npm run test:e2e`       | ✅ page propre et utilisable              |
| 14  | Console du navigateur               | `npm run test:e2e`       | ✅ aucune erreur JavaScript               |

**Total, avec vos 4 photos en place : 40 tests réussis, 0 échec, 20 ignorés volontairement**
(les 20 tests de largeurs sont exécutés une seule fois sur le profil « ordinateur » : ils
imposent eux-mêmes les largeurs 320 → 1440 px sur les cinq écrans).

Les tests s'exécutent sur trois profils réels : **ordinateur** (Chromium 1280 × 900),
**Android** (Google Pixel 7, Chromium) et **iPhone 13** (WebKit — le moteur de Safari).

### Points restant à vérifier par vous (hors de portée de cet environnement)

- **Choix artistiques** : le cadrage de la photo d'arrière-plan et les légendes de la galerie
  sont faciles à ajuster (sections 3.3 et 3.5). Jetez un œil aux captures de `apercus/` et
  modifiez ce qui vous plaît.
- **Un vrai téléphone** : le site a été testé dans un navigateur de téléphone émulé (mêmes moteurs
  que les vrais appareils), mais pas sur un appareil physique.
- **Appareils anciens** : les tests couvrent Chromium et WebKit récents. Les navigateurs Android
  antérieurs à 2023 et Internet Explorer ne sont pas pris en charge.
- **Publication en ligne** : la mise en ligne sur Vercel doit être faite depuis votre compte
  (section 4). Aucune adresse de site publié n'est fournie ici, car aucune n'a été créée.
