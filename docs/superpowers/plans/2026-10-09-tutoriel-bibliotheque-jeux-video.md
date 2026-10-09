# Dépôt de référence du tutoriel « Bibliothèque de jeux vidéo » : plan de réalisation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** Construire, dans l'ordre du tournage, le dépôt de référence du tutoriel : un historique git linéaire où la fin de chaque vidéo est marquée par un commit de transition, avec une branche par vidéo.

**Architecture :** Un seul projet, un seul `package.json` à la racine. `src/` contient le front React, `server/` l'API Express + SQLite (ajouté en vidéo 5), `cypress/` les tests E2E (vidéo 6). La logique de recherche et de filtre vit dans `src/jeux.js` (fonctions pures, testées avec Vitest) ; le CRUD y vit jusqu'à la vidéo 4, puis passe côté serveur en vidéo 5.

**Tech Stack :** JavaScript (ESM), React, Vite, Vitest, Express, better-sqlite3, concurrently, Cypress. Toujours les versions les plus récentes (voir les contraintes globales).

**Spec :** `docs/superpowers/specs/2026-10-09-tutoriel-bibliotheque-jeux-video-design.md`

## Contraintes globales

- JavaScript, **pas** de TypeScript.
- **Un seul `package.json`** à la racine ; pas de monorepo, pas de workspaces, pas de Turborepo.
- Modèle d'un jeu : `id`, `titre`, `plateforme`, `statut` (`à jouer` | `en cours` | `terminé`), `note` (entier de 0 à 5, ou `null`).
- Plateformes : `PC`, `PlayStation`, `Xbox`, `Switch`.
- **Aucune version n'est présumée ni fixée** : chaque outil et chaque dépendance s'installe dans sa version la plus récente (`@latest`, ou sans numéro de version). On ne fixe une version que pour résoudre un vrai conflit de dépendances, et le commit correspondant l'explique.
- Le projet est créé avec **`npm create vite@latest`** dans le dépôt, comme au début du tutoriel, avec le modèle React en JavaScript. Les fichiers générés (ESLint compris) sont conservés, sauf ce que le nettoyage de la vidéo 1 supprime.
- CSS écrit à la main, sobre, **sans bibliothèque de composants**. Une seule feuille : `src/index.css` (celle du modèle, dont on remplace le contenu).
- Interface, messages d'erreur, noms de fonctions et commentaires en **français**.
- Les composants React ne font qu'appeler les fonctions de `src/jeux.js` (et, à partir de la vidéo 5, de `src/api.js`) ; la logique métier n'est jamais dans les composants.
- Historique **linéaire** sur `main`, **un commit par étape** de la vidéo, puis un commit de transition au message exact `Fin de la vidéo N : <sujet>`.
- Branches, une par fin de vidéo : `01-mise-en-place`, `02-crud`, `03-recherche-filtres`, `04-tests-unitaires`, `05-api-sqlite`, `06-cypress` (identique à `main`).
- La recherche et les filtres restent **côté client** en vidéo 5 : le front récupère toute la liste.
- Cypress travaille sur une **base de test séparée**, remise à zéro avant chaque test par une route réservée au mode test.
- Les éléments ciblés par Cypress utilisent des attributs `data-cy` (introduits en vidéo 6).
- Requêtes SQL **paramétrées** uniquement, jamais de concaténation.

## Points de vigilance (Review Focus)

Entrées ou situations que la spec suppose sans que chaque test les couvre ; chacune est épinglée par un test dans la tâche indiquée.

1. **Recherche avec accents, majuscules et espaces** (`Pokémon` / `pokemon` / `  POKÉMON `) → trouve le jeu. Épinglé en tâche 4 (`src/recherche.test.js`).
2. **Titre vide ou fait d'espaces** → refusé, aucun jeu créé, côté formulaire comme côté API. Épinglé en tâche 5 (vérification `curl`) et tâche 6 (`bibliotheque.cy.js`, `api.cy.js`).
3. **Modifier ou supprimer un id inexistant** → `404` avec `{ "erreur": "Jeu introuvable." }`, jamais un `200`. Épinglé en tâche 5 (`curl`) et tâche 6 (`api.cy.js`).
4. **Statut invalide ou note hors de 0–5 envoyés directement à l'API** → `400`. Épinglé en tâche 5 (`curl`) et tâche 6 (`api.cy.js`).
5. **Serveur en erreur ou arrêté** → l'interface affiche un message d'erreur, pas un écran blanc. Épinglé en tâche 5 (vérification manuelle) et tâche 6 (`cy.intercept` qui force une erreur 500).

---

## Tâche 0 : Initialiser le dépôt de référence

Cette tâche n'est pas une vidéo. Elle prépare le dépôt, le `README` et les documents de conception. Ces fichiers sont présents dès le premier commit : le « dossier vide » de la vidéo 1 est celui du lecteur, pas celui du dépôt de référence.

**Fichiers :**
- Créer : `.gitignore`
- Créer : `README.md`
- Déjà présents : `docs/superpowers/specs/2026-10-09-tutoriel-bibliotheque-jeux-video-design.md`, `docs/superpowers/plans/2026-10-09-tutoriel-bibliotheque-jeux-video.md`

**Interfaces :**
- Consomme : rien.
- Produit : un dépôt git sur la branche `main` avec un premier commit. Le `README.md` référence les six branches et les scripts npm définis dans les tâches suivantes.

- [ ] **Étape 1 : Vérifier les outils**

Run: `node --version && npm --version && git --version`
Expected: Node.js, npm et git affichent une version.

Run: `npm view vite engines`
Expected: la version minimale de Node.js demandée par la dernière version de Vite. Si `node --version` est plus ancien, installer la version LTS actuelle de Node.js avant de continuer.

- [ ] **Étape 2 : Initialiser git**

Run: `git init -b main`
Expected: `Initialized empty Git repository in .../video-game-manager-tutorial/.git/`

- [ ] **Étape 3 : Créer `.gitignore`**

```gitignore
node_modules
dist
*.db
*.db-journal
cypress/videos
cypress/screenshots
.DS_Store
```

- [ ] **Étape 4 : Créer `README.md`**

````markdown
# Bibliothèque de jeux vidéo : dépôt de référence

Ce dépôt accompagne la série de 6 vidéos « Créer une application de gestion de bibliothèque de jeux vidéo » (React + Vite, Express, SQLite, Vitest, Cypress).

Il n'est **pas** fait pour être cloné puis lu : tu apprends davantage en construisant **ton propre projet** en suivant les vidéos. Ce dépôt sert à comparer ton travail et à reprendre si tu es bloqué.

## Prérequis

- **Node.js** (de préférence la version LTS actuelle) : vérifie avec `node --version`. `npm create vite@latest` te dit si ta version est trop ancienne
- **git** : vérifie avec `git --version`
- Un éditeur de code (par exemple VS Code)
- Un navigateur récent

## Trois façons d'utiliser ce dépôt

1. **Par défaut : construis dans ton propre projet.** Dans un dossier vide, tu lances `npm create vite@latest` (vidéo 1), puis `git init`, et tu committes comme tu veux. À la fin de chaque vidéo, fais un commit : `Fin de la vidéo N : <sujet>`.
2. **Pour comparer** : consulte la branche de la vidéo sur GitHub (menu déroulant des branches), ou compare en local. Par exemple, pour voir exactement ce que la vidéo 3 ajoute :
   ```bash
   git diff 02-crud 03-recherche-filtres
   ```
3. **En cas de blocage** : clone ce dépôt dans un dossier **séparé** de ton projet, place-toi sur la branche de la vidéo précédente et repars de cet état propre :
   ```bash
   git clone <url-du-depot> jeux-video-reference
   cd jeux-video-reference
   git checkout 02-crud      # l'état de départ de la vidéo 3
   npm install
   npm run dev
   ```
   Tu peux ensuite copier les fichiers dans ton projet, ou continuer directement dans ce clone.

## Les vidéos et les branches

L'historique de `main` est linéaire. Chaque branche pointe vers le commit `Fin de la vidéo N : …` correspondant. `git log --oneline` sert de table des matières.

| Vidéo | Sujet | Branche |
|---|---|---|
| 1 | Mise en place | `01-mise-en-place` |
| 2 | Le CRUD | `02-crud` |
| 3 | Recherche et filtres | `03-recherche-filtres` |
| 4 | Tests unitaires (Vitest) | `04-tests-unitaires` |
| 5 | API et SQLite | `05-api-sqlite` |
| 6 | Tests Cypress | `06-cypress` (identique à `main`) |

## Commandes

| Commande | Disponible à partir de | Rôle |
|---|---|---|
| `npm install` | vidéo 1 | Installe les dépendances |
| `npm run dev` | vidéo 1 | Lance l'application (à partir de la vidéo 5 : le front **et** le serveur) |
| `npm run build` | vidéo 1 | Vérifie que le projet compile |
| `npm test` | vidéo 4 | Lance les tests unitaires une fois |
| `npm run test:watch` | vidéo 4 | Relance les tests à chaque modification |
| `npm run dev:test` | vidéo 6 | Lance l'application avec la base de test (pour Cypress) |
| `npm run cypress:ouvrir` | vidéo 6 | Ouvre Cypress en mode interactif |
| `npm run cypress:lancer` | vidéo 6 | Lance les tests Cypress en ligne de commande |

## Si `npm install` échoue (à partir de la vidéo 5)

`better-sqlite3` est un module natif. Dans la plupart des cas un binaire précompilé est téléchargé. Sinon, installe les outils de compilation de ton système (Xcode Command Line Tools sur macOS, `build-essential` sur Linux, « Desktop development with C++ » sur Windows) puis relance `npm install`.

## Lancer les tests Cypress

Dans un premier terminal (arrête d'abord `npm run dev` s'il tourne) :

```bash
npm run dev:test
```

Dans un second terminal :

```bash
npm run cypress:ouvrir     # mode interactif
npm run cypress:lancer     # ou en ligne de commande
```

`dev:test` utilise une base de données séparée (`server/jeux.test.db`) : tes vrais jeux ne sont jamais touchés.
````

- [ ] **Étape 5 : Premier commit**

```bash
git add .gitignore README.md docs
git commit -m "Initialise le dépôt de référence : README et documents de conception"
```
Expected: un commit créé sur `main` contenant `.gitignore`, `README.md` et le dossier `docs`.

---

## Tâche 1 : Vidéo 1, Mise en place

**Fichiers :**
- Générés par `npm create vite@latest` : `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `eslint.config.js`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, ainsi que les fichiers d'exemple du modèle (`src/App.css`, `src/assets/`, `public/`), qui sont supprimés au nettoyage
- Modifier : `index.html`, `src/index.css`, `src/App.jsx`
- Créer : `src/donnees.js`, `src/components/ListeJeux.jsx`, `src/components/CarteJeu.jsx`

**Interfaces :**
- Consomme : rien.
- Produit :
  - `JEUX_INITIAUX` : `Array<{ id: number, titre: string, plateforme: string, statut: string, note: number | null }>` exporté de `src/donnees.js` (5 jeux ; remplacé par 30 jeux en tâche 3 puis copié côté serveur en tâche 5).
  - `ListeJeux({ jeux })` dans `src/components/ListeJeux.jsx` (export par défaut).
  - `CarteJeu({ jeu })` dans `src/components/CarteJeu.jsx` (export par défaut).
  - Le projet généré par `create-vite` avec le modèle React en JavaScript, tel quel (scripts `dev`, `build`, `lint`, `preview`, configuration ESLint). On ne fixe aucune version : ce sont les plus récentes au moment de l'exécution.

**Note :** cette tâche suit exactement ce que fait le lecteur au début de la vidéo 1 : lancer `npm create vite@latest`, puis nettoyer le modèle. Le programme de `create-vite` change d'une version à l'autre (questions, options) : les étapes ci-dessous décrivent **quoi choisir**, pas le texte exact des questions.

- [ ] **Étape 1 : Repérer les options de `create-vite`**

Run: `npm create vite@latest -- --help`
Expected: l'aide de `create-vite` s'affiche. Noter les options utiles : le choix du modèle (`--template`) et, s'il existe, un moyen d'éviter les questions interactives.

- [ ] **Étape 2 : Créer le projet dans le dépôt, comme au début du tutoriel**

Run: `npm create vite@latest .`

Réponses à donner aux questions :
- Dossier non vide : choisir **« Ignore files and continue »** (ignorer les fichiers existants et continuer). **Ne jamais choisir « Remove existing files »** : cela supprimerait `docs/`.
- Framework : **React**.
- Variante : **JavaScript** (pas TypeScript). Si une variante « avec compilateur » ou « SWC » est proposée, prendre la plus simple (JavaScript seul).
- Toute option expérimentale (par exemple un autre bundler) : **non**.
- « Installer avec npm et démarrer maintenant ? » : **installer, sans démarrer** ; sinon répondre non et lancer `npm install` à l'étape 4.

Si la commande ne peut pas être pilotée de façon interactive (exécution par un agent), générer le modèle dans un dossier temporaire avec les options repérées à l'étape 1, puis copier **tout son contenu, fichiers cachés compris**, à la racine du dépôt, **sans** copier `README.md` ni `.gitignore` :
```bash
npm create vite@latest vite-temporaire -- --template react
cp -R vite-temporaire/. . && rm -rf vite-temporaire
```
(adapter `--template` si l'aide de l'étape 1 indique un autre nom pour « React en JavaScript »), puis restaurer les deux fichiers de l'étape 3.

Expected: `package.json`, `index.html`, `vite.config.js`, `eslint.config.js` et un dossier `src/` apparaissent à la racine ; `docs/` est intact.

- [ ] **Étape 3 : Restaurer `README.md` et fusionner `.gitignore`**

Le modèle écrit son propre `README.md` et son propre `.gitignore` par-dessus les nôtres.

```bash
git checkout -- README.md
for ligne in node_modules dist '*.db' '*.db-journal' cypress/videos cypress/screenshots .DS_Store; do
  grep -qxF "$ligne" .gitignore || echo "$ligne" >> .gitignore
done
```
Expected: `git status --short` ne montre plus de modification sur `README.md` ; `.gitignore` contient à la fois les lignes du modèle et les nôtres.

- [ ] **Étape 4 : Installer et vérifier le modèle tel quel**

Run: `npm install`
Expected: se termine sans erreur ; `node_modules/` apparaît.

Run: `npm run build`
Expected: se termine sans erreur (`✓ built in …`).

Run: `npm run lint`
Expected: aucune erreur sur le modèle non modifié.

Vérifier qu'aucun fichier inattendu n'a été ajouté : `git status --short`. Expected : uniquement les fichiers du modèle et `.gitignore`.

- [ ] **Étape 5 : Commit du modèle**

```bash
git add -A
git commit -m "Vidéo 1 : crée le projet avec npm create vite (modèle React)"
```

- [ ] **Étape 6 : Nettoyer le modèle par défaut**

Supprimer les fichiers d'exemple :
```bash
rm -rf src/App.css src/assets public
```

Dans `index.html` : mettre `lang="fr"` sur la balise `<html>`, remplacer le contenu de `<title>` par `Bibliothèque de jeux vidéo`, et supprimer la ligne `<link rel="icon" … />` si elle référence un fichier de `public/`.

Vérifier les imports du point d'entrée :

Run: `grep -n "import" src/main.jsx`
Expected: `src/main.jsx` importe `./index.css` et `./App.jsx` (c'est le cas du modèle). Si les noms diffèrent, les utiliser à la place dans les étapes suivantes.

- [ ] **Étape 7 : Données d'exemple et styles de base**

`src/donnees.js` :
```js
export const JEUX_INITIAUX = [
  { id: 1, titre: 'The Legend of Zelda: Breath of the Wild', plateforme: 'Switch', statut: 'terminé', note: 5 },
  { id: 2, titre: 'Hollow Knight', plateforme: 'PC', statut: 'terminé', note: 5 },
  { id: 3, titre: 'Celeste', plateforme: 'Switch', statut: 'terminé', note: 5 },
  { id: 4, titre: 'Elden Ring', plateforme: 'PlayStation', statut: 'en cours', note: null },
  { id: 5, titre: 'Stardew Valley', plateforme: 'PC', statut: 'en cours', note: null },
]
```

`src/index.css` (remplacer tout le contenu du modèle) :
```css
:root {
  --fond: #f5f6fa;
  --texte: #1f2430;
  --texte-doux: #4a5164;
  --accent: #3b5bdb;
  --bordure: #d5d9e4;
  font-family: system-ui, sans-serif;
  color: var(--texte);
  background: var(--fond);
}

body {
  margin: 0;
}

main {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px;
}

h1 {
  margin-top: 0;
}

.liste-jeux {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}

.carte-jeu {
  background: white;
  border: 1px solid var(--bordure);
  border-radius: 8px;
  padding: 12px 16px;
}

.carte-jeu h2 {
  margin: 0 0 4px;
  font-size: 1.1rem;
}

.carte-jeu p {
  margin: 2px 0;
  color: var(--texte-doux);
}
```

- [ ] **Étape 8 : Composants `CarteJeu` et `ListeJeux`**

`src/components/CarteJeu.jsx` :
```jsx
function CarteJeu({ jeu }) {
  return (
    <li className="carte-jeu">
      <h2>{jeu.titre}</h2>
      <p>
        {jeu.plateforme} · {jeu.statut}
      </p>
      {jeu.note !== null && <p>Note : {jeu.note}/5</p>}
    </li>
  )
}

export default CarteJeu
```

`src/components/ListeJeux.jsx` :
```jsx
import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux }) {
  return (
    <ul className="liste-jeux">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} />
      ))}
    </ul>
  )
}

export default ListeJeux
```

- [ ] **Étape 9 : `App`**

`src/App.jsx` (remplacer tout le contenu du modèle) :
```jsx
import ListeJeux from './components/ListeJeux.jsx'
import { JEUX_INITIAUX } from './donnees.js'

function App() {
  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
      <ListeJeux jeux={JEUX_INITIAUX} />
    </main>
  )
}

export default App
```

- [ ] **Étape 10 : Vérifier que ça compile et que ça s'affiche**

Run: `npm run build`
Expected: se termine sans erreur, avec une ligne du type `✓ built in …`.

Run: `npm run lint`
Expected: aucune erreur. Si une règle du modèle signale ce code, appliquer le correctif le plus petit possible et le mentionner dans le message du commit de l'étape 11.

Run (smoke test du serveur de développement) :
```bash
npm run dev & SERVEUR=$!
sleep 3
curl -s http://localhost:5173 | grep -c 'id="root"'
kill $SERVEUR
```
Expected: affiche `1`.

Vérification visuelle (à faire aussi pendant le tournage) : sur http://localhost:5173, le titre « Ma bibliothèque de jeux vidéo » et **5 cartes** s'affichent ; Elden Ring et Stardew Valley n'ont pas de ligne « Note ».

- [ ] **Étape 11 : Commit du nettoyage et de la liste de jeux**

```bash
git add -A
git commit -m "Vidéo 1 : nettoie le modèle et affiche une liste de jeux avec CarteJeu et ListeJeux"
```

- [ ] **Étape 12 : Commit de transition et branche**

```bash
git commit --allow-empty -m "Fin de la vidéo 1 : mise en place"
git branch 01-mise-en-place
```
Expected: `git log --oneline -1` affiche `Fin de la vidéo 1 : mise en place`.

---

## Tâche 2 : Vidéo 2, Le CRUD

**Fichiers :**
- Créer : `src/jeux.js`, `src/components/FormulaireJeu.jsx`
- Modifier : `src/App.jsx`, `src/components/ListeJeux.jsx`, `src/components/CarteJeu.jsx`, `src/index.css`

**Interfaces :**
- Consomme : `JEUX_INITIAUX`, `ListeJeux`, `CarteJeu` (tâche 1).
- Produit, dans `src/jeux.js` (tous purs : ils ne modifient jamais la liste reçue) :
  - `PLATEFORMES: string[]` et `STATUTS: string[]`
  - `ajouterJeu(jeux, nouveauJeu) -> Jeu[]` : ajoute `nouveauJeu` avec un `id` égal au plus grand `id` existant + 1 (ou 1 si la liste est vide)
  - `modifierJeu(jeux, id, modifications) -> Jeu[]` : fusionne `modifications` dans le jeu d'`id` donné ; l'`id` du jeu ne change jamais ; renvoie une liste équivalente si l'`id` n'existe pas
  - `supprimerJeu(jeux, id) -> Jeu[]` : retire le jeu d'`id` donné ; renvoie une liste équivalente si l'`id` n'existe pas
- Produit : `FormulaireJeu({ jeuInitial?, onSoumettre(donnees), onAnnuler? })` où `donnees` est `{ titre, plateforme, statut, note }` (`note` : nombre ou `null`).
- Produit : `CarteJeu({ jeu, onModifier(jeu), onSupprimer(id) })` et `ListeJeux({ jeux, onModifier, onSupprimer })`.

La vérification de cette vidéo est manuelle : les tests unitaires de ces fonctions sont écrits en vidéo 4, volontairement.

- [ ] **Étape 1 : Les fonctions de CRUD**

`src/jeux.js` :
```js
// Fonctions pures de la bibliothèque : elles ne modifient jamais la liste reçue,
// elles renvoient toujours une nouvelle liste.

export const PLATEFORMES = ['PC', 'PlayStation', 'Xbox', 'Switch']
export const STATUTS = ['à jouer', 'en cours', 'terminé']

export function ajouterJeu(jeux, nouveauJeu) {
  const id = jeux.reduce((max, jeu) => Math.max(max, jeu.id), 0) + 1
  return [...jeux, { ...nouveauJeu, id }]
}

export function modifierJeu(jeux, id, modifications) {
  return jeux.map((jeu) => (jeu.id === id ? { ...jeu, ...modifications, id } : jeu))
}

export function supprimerJeu(jeux, id) {
  return jeux.filter((jeu) => jeu.id !== id)
}
```

- [ ] **Étape 2 : Commit des fonctions**

```bash
git add src/jeux.js
git commit -m "Vidéo 2 : ajoute les fonctions pures ajouterJeu, modifierJeu et supprimerJeu"
```

- [ ] **Étape 3 : Le formulaire**

`src/components/FormulaireJeu.jsx` :
```jsx
import { useState } from 'react'
import { PLATEFORMES, STATUTS } from '../jeux.js'

const VIDE = { titre: '', plateforme: PLATEFORMES[0], statut: STATUTS[0], note: '' }

function FormulaireJeu({ jeuInitial, onSoumettre, onAnnuler }) {
  const [valeurs, setValeurs] = useState(
    jeuInitial ? { ...jeuInitial, note: jeuInitial.note ?? '' } : VIDE,
  )

  function changer(evenement) {
    const { name, value } = evenement.target
    setValeurs({ ...valeurs, [name]: value })
  }

  function soumettre(evenement) {
    evenement.preventDefault()
    const titre = valeurs.titre.trim()
    if (titre === '') return

    onSoumettre({
      titre,
      plateforme: valeurs.plateforme,
      statut: valeurs.statut,
      note: valeurs.note === '' ? null : Number(valeurs.note),
    })
    if (!jeuInitial) setValeurs(VIDE)
  }

  return (
    <form className="formulaire" onSubmit={soumettre}>
      <h2>{jeuInitial ? 'Modifier le jeu' : 'Ajouter un jeu'}</h2>
      <label>
        Titre
        <input name="titre" value={valeurs.titre} onChange={changer} required />
      </label>
      <label>
        Plateforme
        <select name="plateforme" value={valeurs.plateforme} onChange={changer}>
          {PLATEFORMES.map((plateforme) => (
            <option key={plateforme}>{plateforme}</option>
          ))}
        </select>
      </label>
      <label>
        Statut
        <select name="statut" value={valeurs.statut} onChange={changer}>
          {STATUTS.map((statut) => (
            <option key={statut}>{statut}</option>
          ))}
        </select>
      </label>
      <label>
        Note (0 à 5)
        <select name="note" value={valeurs.note} onChange={changer}>
          <option value="">Aucune</option>
          {[0, 1, 2, 3, 4, 5].map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </label>
      <div className="actions">
        <button type="submit">{jeuInitial ? 'Enregistrer' : 'Ajouter'}</button>
        {onAnnuler && (
          <button type="button" className="secondaire" onClick={onAnnuler}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default FormulaireJeu
```

- [ ] **Étape 4 : Boutons sur les cartes et transmission dans la liste**

`src/components/CarteJeu.jsx` (remplacer tout le fichier) :
```jsx
function CarteJeu({ jeu, onModifier, onSupprimer }) {
  return (
    <li className="carte-jeu">
      <h2>{jeu.titre}</h2>
      <p>
        {jeu.plateforme} · {jeu.statut}
      </p>
      {jeu.note !== null && <p>Note : {jeu.note}/5</p>}
      <div className="carte-actions">
        <button type="button" className="secondaire" onClick={() => onModifier(jeu)}>
          Modifier
        </button>
        <button type="button" className="danger" onClick={() => onSupprimer(jeu.id)}>
          Supprimer
        </button>
      </div>
    </li>
  )
}

export default CarteJeu
```

`src/components/ListeJeux.jsx` (remplacer tout le fichier) :
```jsx
import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux, onModifier, onSupprimer }) {
  return (
    <ul className="liste-jeux">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} onModifier={onModifier} onSupprimer={onSupprimer} />
      ))}
    </ul>
  )
}

export default ListeJeux
```

- [ ] **Étape 5 : `App` avec l'état et le CRUD**

`src/App.jsx` (remplacer tout le fichier) :
```jsx
import { useState } from 'react'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import { JEUX_INITIAUX } from './donnees.js'
import { ajouterJeu, modifierJeu, supprimerJeu } from './jeux.js'

function App() {
  const [jeux, setJeux] = useState(JEUX_INITIAUX)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)

  function ajouter(donnees) {
    setJeux(ajouterJeu(jeux, donnees))
  }

  function enregistrerModification(donnees) {
    setJeux(modifierJeu(jeux, jeuEnEdition.id, donnees))
    setJeuEnEdition(null)
  }

  function supprimer(id) {
    setJeux(supprimerJeu(jeux, id))
    if (jeuEnEdition?.id === id) setJeuEnEdition(null)
  }

  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
      {jeuEnEdition ? (
        <FormulaireJeu
          key={jeuEnEdition.id}
          jeuInitial={jeuEnEdition}
          onSoumettre={enregistrerModification}
          onAnnuler={() => setJeuEnEdition(null)}
        />
      ) : (
        <FormulaireJeu key="nouveau" onSoumettre={ajouter} />
      )}
      <ListeJeux jeux={jeux} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
    </main>
  )
}

export default App
```

- [ ] **Étape 6 : Styles du formulaire et des boutons**

Ajouter à la fin de `src/index.css` :
```css
.formulaire {
  background: white;
  border: 1px solid var(--bordure);
  border-radius: 8px;
  padding: 16px;
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
}

.formulaire h2 {
  margin: 0;
  font-size: 1.1rem;
}

.formulaire label {
  display: grid;
  gap: 4px;
  font-size: 0.9rem;
}

input,
select {
  padding: 8px;
  border: 1px solid var(--bordure);
  border-radius: 6px;
  font: inherit;
  background: white;
}

button {
  padding: 8px 14px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  background: var(--accent);
  color: white;
  font: inherit;
  cursor: pointer;
}

button.secondaire {
  background: white;
  color: var(--accent);
}

button.danger {
  background: white;
  color: #c92a2a;
  border-color: #c92a2a;
}

.actions,
.carte-actions {
  display: flex;
  gap: 8px;
}

.carte-actions {
  margin-top: 8px;
}
```

- [ ] **Étape 7 : Vérifier**

Run: `npm run build`
Expected: se termine sans erreur.

Run: `npm run lint`
Expected: aucune erreur. Si une règle du modèle signale ce code, appliquer le correctif le plus petit possible et le mentionner dans le message du commit suivant.

Vérification manuelle sur http://localhost:5173 (`npm run dev`) :
1. Ajouter « Portal 2 », PC, terminé, note 5 → une 6ᵉ carte apparaît et le formulaire se vide.
2. Cliquer « Modifier » sur Celeste → le formulaire passe en mode « Modifier le jeu » avec les valeurs de Celeste ; changer le statut puis « Enregistrer » → la carte change et le formulaire revient en mode « Ajouter un jeu ».
3. Cliquer « Annuler » pendant une modification → retour au mode « Ajouter » sans rien changer.
4. Cliquer « Supprimer » sur Hollow Knight → la carte disparaît.
5. Soumettre un titre vide → rien n'est ajouté (le navigateur bloque le champ requis).
6. Recharger la page → tout revient à l'état initial. **C'est attendu** : la vidéo le dit explicitement, ça motive la vidéo 5.

- [ ] **Étape 8 : Commit de l'interface CRUD**

```bash
git add src
git commit -m "Vidéo 2 : ajoute le formulaire et branche le CRUD dans l'interface"
```

- [ ] **Étape 9 : Commit de transition et branche**

```bash
git commit --allow-empty -m "Fin de la vidéo 2 : le CRUD"
git branch 02-crud
```

---

## Tâche 3 : Vidéo 3, Recherche et filtres

**Fichiers :**
- Modifier : `src/jeux.js`, `src/donnees.js`, `src/App.jsx`, `src/components/ListeJeux.jsx`, `src/index.css`
- Créer : `src/components/BarreFiltres.jsx`

**Interfaces :**
- Consomme : `PLATEFORMES`, `STATUTS`, `ajouterJeu`, `modifierJeu`, `supprimerJeu` (tâche 2).
- Produit, dans `src/jeux.js` :
  - `rechercherJeux(jeux, texte) -> Jeu[]` : garde les jeux dont le titre contient `texte`, sans tenir compte de la casse, des accents ni des espaces autour de `texte` ; un `texte` vide ou fait d'espaces renvoie tous les jeux
  - `filtrerJeux(jeux, { plateforme = '', statut = '' } = {}) -> Jeu[]` : une valeur vide signifie « pas de filtre sur ce critère » ; les deux critères se combinent (ET) ; appelé sans second argument, renvoie tous les jeux
- Produit : `BarreFiltres({ recherche, onRecherche(texte), filtres, onFiltres(filtres) })` où `filtres` est `{ plateforme: string, statut: string }`.
- Produit : `JEUX_INITIAUX` passe à 30 jeux (les ids 1 à 5 restent identiques à ceux de la tâche 1).

- [ ] **Étape 1 : Passer à 30 jeux d'exemple**

`src/donnees.js` (remplacer tout le fichier) :
```js
export const JEUX_INITIAUX = [
  { id: 1, titre: 'The Legend of Zelda: Breath of the Wild', plateforme: 'Switch', statut: 'terminé', note: 5 },
  { id: 2, titre: 'Hollow Knight', plateforme: 'PC', statut: 'terminé', note: 5 },
  { id: 3, titre: 'Celeste', plateforme: 'Switch', statut: 'terminé', note: 5 },
  { id: 4, titre: 'Elden Ring', plateforme: 'PlayStation', statut: 'en cours', note: null },
  { id: 5, titre: 'Stardew Valley', plateforme: 'PC', statut: 'en cours', note: null },
  { id: 6, titre: 'Hades', plateforme: 'Switch', statut: 'terminé', note: 5 },
  { id: 7, titre: 'God of War', plateforme: 'PlayStation', statut: 'terminé', note: 5 },
  { id: 8, titre: 'Halo Infinite', plateforme: 'Xbox', statut: 'à jouer', note: null },
  { id: 9, titre: 'Forza Horizon 5', plateforme: 'Xbox', statut: 'en cours', note: null },
  { id: 10, titre: 'Super Mario Odyssey', plateforme: 'Switch', statut: 'terminé', note: 4 },
  { id: 11, titre: 'Portal 2', plateforme: 'PC', statut: 'terminé', note: 5 },
  { id: 12, titre: 'The Witcher 3', plateforme: 'PC', statut: 'en cours', note: null },
  { id: 13, titre: 'Red Dead Redemption 2', plateforme: 'PlayStation', statut: 'à jouer', note: null },
  { id: 14, titre: 'Disco Elysium', plateforme: 'PC', statut: 'à jouer', note: null },
  { id: 15, titre: 'Animal Crossing: New Horizons', plateforme: 'Switch', statut: 'en cours', note: null },
  { id: 16, titre: 'Sea of Thieves', plateforme: 'Xbox', statut: 'terminé', note: 3 },
  { id: 17, titre: 'Hogwarts Legacy', plateforme: 'PlayStation', statut: 'à jouer', note: null },
  { id: 18, titre: 'Cyberpunk 2077', plateforme: 'PC', statut: 'terminé', note: 4 },
  { id: 19, titre: 'Metroid Dread', plateforme: 'Switch', statut: 'terminé', note: 4 },
  { id: 20, titre: 'Spider-Man 2', plateforme: 'PlayStation', statut: 'terminé', note: 4 },
  { id: 21, titre: 'Gears 5', plateforme: 'Xbox', statut: 'terminé', note: 3 },
  { id: 22, titre: 'Cuphead', plateforme: 'Xbox', statut: 'à jouer', note: null },
  { id: 23, titre: "Baldur's Gate 3", plateforme: 'PC', statut: 'en cours', note: null },
  { id: 24, titre: 'Persona 5 Royal', plateforme: 'PlayStation', statut: 'à jouer', note: null },
  { id: 25, titre: 'Fire Emblem: Three Houses', plateforme: 'Switch', statut: 'à jouer', note: null },
  { id: 26, titre: 'Hi-Fi Rush', plateforme: 'Xbox', statut: 'terminé', note: 4 },
  { id: 27, titre: 'Civilization VI', plateforme: 'PC', statut: 'à jouer', note: null },
  { id: 28, titre: 'Ghost of Tsushima', plateforme: 'PlayStation', statut: 'terminé', note: 5 },
  { id: 29, titre: 'Pokémon Épée', plateforme: 'Switch', statut: 'terminé', note: 3 },
  { id: 30, titre: 'Ori and the Will of the Wisps', plateforme: 'Xbox', statut: 'terminé', note: 5 },
]
```

- [ ] **Étape 2 : Commit des données**

```bash
git add src/donnees.js
git commit -m "Vidéo 3 : passe à 30 jeux d'exemple"
```

- [ ] **Étape 3 : Fonctions de recherche et de filtre**

Ajouter à la fin de `src/jeux.js` :
```js

// Retire les accents et la casse pour comparer "Pokémon" et "pokemon".
function normaliser(texte) {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function rechercherJeux(jeux, texte) {
  const recherche = normaliser(texte.trim())
  if (recherche === '') return jeux
  return jeux.filter((jeu) => normaliser(jeu.titre).includes(recherche))
}

export function filtrerJeux(jeux, { plateforme = '', statut = '' } = {}) {
  return jeux.filter(
    (jeu) =>
      (plateforme === '' || jeu.plateforme === plateforme) &&
      (statut === '' || jeu.statut === statut),
  )
}
```

- [ ] **Étape 4 : Commit des fonctions**

```bash
git add src/jeux.js
git commit -m "Vidéo 3 : ajoute rechercherJeux et filtrerJeux"
```

- [ ] **Étape 5 : La barre de recherche et de filtres**

`src/components/BarreFiltres.jsx` :
```jsx
import { PLATEFORMES, STATUTS } from '../jeux.js'

function BarreFiltres({ recherche, onRecherche, filtres, onFiltres }) {
  return (
    <div className="barre-filtres">
      <input
        type="search"
        placeholder="Rechercher un titre…"
        aria-label="Rechercher un jeu"
        value={recherche}
        onChange={(evenement) => onRecherche(evenement.target.value)}
      />
      <select
        aria-label="Filtrer par plateforme"
        value={filtres.plateforme}
        onChange={(evenement) => onFiltres({ ...filtres, plateforme: evenement.target.value })}
      >
        <option value="">Toutes les plateformes</option>
        {PLATEFORMES.map((plateforme) => (
          <option key={plateforme}>{plateforme}</option>
        ))}
      </select>
      <select
        aria-label="Filtrer par statut"
        value={filtres.statut}
        onChange={(evenement) => onFiltres({ ...filtres, statut: evenement.target.value })}
      >
        <option value="">Tous les statuts</option>
        {STATUTS.map((statut) => (
          <option key={statut}>{statut}</option>
        ))}
      </select>
    </div>
  )
}

export default BarreFiltres
```

- [ ] **Étape 6 : Message « aucun résultat » dans la liste**

`src/components/ListeJeux.jsx` (remplacer tout le fichier) :
```jsx
import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux, onModifier, onSupprimer }) {
  if (jeux.length === 0) {
    return <p>Aucun jeu à afficher.</p>
  }

  return (
    <ul className="liste-jeux">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} onModifier={onModifier} onSupprimer={onSupprimer} />
      ))}
    </ul>
  )
}

export default ListeJeux
```

- [ ] **Étape 7 : Brancher la recherche et les filtres dans `App`**

`src/App.jsx` (remplacer tout le fichier) :
```jsx
import { useState } from 'react'
import BarreFiltres from './components/BarreFiltres.jsx'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import { JEUX_INITIAUX } from './donnees.js'
import { ajouterJeu, filtrerJeux, modifierJeu, rechercherJeux, supprimerJeu } from './jeux.js'

function App() {
  const [jeux, setJeux] = useState(JEUX_INITIAUX)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [filtres, setFiltres] = useState({ plateforme: '', statut: '' })

  // La liste affichée est calculée à partir de la liste complète : on ne la stocke pas.
  const jeuxAffiches = filtrerJeux(rechercherJeux(jeux, recherche), filtres)

  function ajouter(donnees) {
    setJeux(ajouterJeu(jeux, donnees))
  }

  function enregistrerModification(donnees) {
    setJeux(modifierJeu(jeux, jeuEnEdition.id, donnees))
    setJeuEnEdition(null)
  }

  function supprimer(id) {
    setJeux(supprimerJeu(jeux, id))
    if (jeuEnEdition?.id === id) setJeuEnEdition(null)
  }

  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
      {jeuEnEdition ? (
        <FormulaireJeu
          key={jeuEnEdition.id}
          jeuInitial={jeuEnEdition}
          onSoumettre={enregistrerModification}
          onAnnuler={() => setJeuEnEdition(null)}
        />
      ) : (
        <FormulaireJeu key="nouveau" onSoumettre={ajouter} />
      )}
      <BarreFiltres
        recherche={recherche}
        onRecherche={setRecherche}
        filtres={filtres}
        onFiltres={setFiltres}
      />
      <p className="compteur">
        {jeuxAffiches.length} / {jeux.length} jeux
      </p>
      <ListeJeux jeux={jeuxAffiches} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
    </main>
  )
}

export default App
```

- [ ] **Étape 8 : Styles de la barre de filtres**

Ajouter à la fin de `src/index.css` :
```css

.barre-filtres {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 8px;
}

.compteur {
  color: var(--texte-doux);
  font-size: 0.9rem;
}
```

- [ ] **Étape 9 : Vérifier**

Run: `npm run build`
Expected: se termine sans erreur.

Run: `npm run lint`
Expected: aucune erreur. Si une règle du modèle signale ce code, appliquer le correctif le plus petit possible et le mentionner dans le message du commit suivant.

Vérification manuelle sur http://localhost:5173 :
1. Au chargement : « 30 / 30 jeux ».
2. Taper `pokemon` (sans accent) → « 1 / 30 jeux », la carte « Pokémon Épée ».
3. Taper `HALO` → « 1 / 30 jeux » (« Halo Infinite »).
4. Taper `  zelda  ` (avec espaces) → « 1 / 30 jeux ».
5. Taper `zzz` → « 0 / 30 jeux » et le message « Aucun jeu à afficher. ».
6. Vider la recherche, choisir la plateforme `Switch` → « 8 / 30 jeux » ; ajouter le statut `terminé` → « 6 / 30 jeux » ; ajouter la recherche `mario` → « 1 / 30 jeux ».
7. Supprimer un jeu pendant qu'un filtre est actif → le compteur et la liste se mettent à jour.

- [ ] **Étape 10 : Commit de l'interface de recherche**

```bash
git add src
git commit -m "Vidéo 3 : branche la recherche, les filtres et le compteur dans l'interface"
```

- [ ] **Étape 11 : Commit de transition et branche**

```bash
git commit --allow-empty -m "Fin de la vidéo 3 : recherche et filtres"
git branch 03-recherche-filtres
```

---

## Tâche 4 : Vidéo 4, Tests unitaires (Vitest)

**Fichiers :**
- Modifier : `package.json`
- Créer : `src/crud.test.js`, `src/recherche.test.js`
- Fichier éphémère (non commité) : `src/premier.test.js`

**Interfaces :**
- Consomme : `ajouterJeu`, `modifierJeu`, `supprimerJeu`, `rechercherJeux`, `filtrerJeux` de `src/jeux.js` (tâches 2 et 3).
- Produit : scripts npm `test` (`vitest run`) et `test:watch` (`vitest`). Le fichier `src/crud.test.js` est supprimé en tâche 5 quand le CRUD passe côté serveur ; `src/recherche.test.js` reste.

Les tests sont séparés en deux fichiers par responsabilité, pour que la suppression du CRUD de la tâche 5 soit un simple `git rm`.

- [ ] **Étape 1 : Installer Vitest et ajouter les scripts**

Run: `npm install -D vitest`
Expected: `vitest` apparaît dans `devDependencies`.

Dans le bloc `scripts` de `package.json`, **ajouter** ces deux scripts en conservant ceux du modèle :
```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Étape 2 : Un premier test très simple (démonstration, non commité)**

`src/premier.test.js` :
```js
import { describe, it, expect } from 'vitest'

describe('mon premier test', () => {
  it('additionne deux nombres', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npm test`
Expected: `Test Files  1 passed (1)` et `Tests  1 passed (1)`.

Puis supprimer le fichier de démonstration : `rm src/premier.test.js`.

- [ ] **Étape 3 : Commit de l'installation**

```bash
git add package.json package-lock.json
git commit -m "Vidéo 4 : installe Vitest et ajoute les scripts de test"
```

- [ ] **Étape 4 : Tests du CRUD**

`src/crud.test.js` :
```js
import { describe, it, expect } from 'vitest'
import { ajouterJeu, modifierJeu, supprimerJeu } from './jeux.js'

const zelda = { id: 1, titre: 'Zelda', plateforme: 'Switch', statut: 'terminé', note: 5 }
const hades = { id: 2, titre: 'Hades', plateforme: 'PC', statut: 'en cours', note: null }
const nouveau = { titre: 'Celeste', plateforme: 'PC', statut: 'à jouer', note: null }

describe('ajouterJeu', () => {
  it('ajoute le jeu à la fin de la liste avec un nouvel id', () => {
    const resultat = ajouterJeu([zelda, hades], nouveau)

    expect(resultat).toHaveLength(3)
    expect(resultat[2]).toEqual({ ...nouveau, id: 3 })
  })

  it('donne l’id 1 quand la liste est vide', () => {
    expect(ajouterJeu([], nouveau)).toEqual([{ ...nouveau, id: 1 }])
  })

  it('prend le plus grand id existant + 1, même s’il y a des trous', () => {
    const resultat = ajouterJeu([{ ...zelda, id: 1 }, { ...hades, id: 7 }], nouveau)

    expect(resultat[2].id).toBe(8)
  })

  it('ne modifie pas la liste d’origine', () => {
    const jeux = [zelda, hades]

    ajouterJeu(jeux, nouveau)

    expect(jeux).toEqual([zelda, hades])
  })
})

describe('modifierJeu', () => {
  it('modifie uniquement le jeu ciblé', () => {
    const resultat = modifierJeu([zelda, hades], 2, { statut: 'terminé', note: 4 })

    expect(resultat).toEqual([zelda, { ...hades, statut: 'terminé', note: 4 }])
  })

  it('conserve l’id du jeu même si les modifications en contiennent un autre', () => {
    const resultat = modifierJeu([zelda, hades], 1, { id: 99, titre: 'Zelda BOTW' })

    expect(resultat[0]).toEqual({ ...zelda, titre: 'Zelda BOTW' })
  })

  it('renvoie une liste identique si l’id n’existe pas', () => {
    expect(modifierJeu([zelda, hades], 42, { titre: 'X' })).toEqual([zelda, hades])
  })

  it('ne modifie pas la liste d’origine', () => {
    const jeux = [zelda, hades]

    modifierJeu(jeux, 1, { titre: 'Autre' })

    expect(jeux[0].titre).toBe('Zelda')
  })
})

describe('supprimerJeu', () => {
  it('retire le jeu ciblé', () => {
    expect(supprimerJeu([zelda, hades], 1)).toEqual([hades])
  })

  it('renvoie une liste identique si l’id n’existe pas', () => {
    expect(supprimerJeu([zelda, hades], 42)).toEqual([zelda, hades])
  })

  it('renvoie une liste vide quand on supprime le dernier jeu', () => {
    expect(supprimerJeu([zelda], 1)).toEqual([])
  })

  it('ne modifie pas la liste d’origine', () => {
    const jeux = [zelda, hades]

    supprimerJeu(jeux, 1)

    expect(jeux).toHaveLength(2)
  })
})
```

- [ ] **Étape 5 : Lancer les tests du CRUD**

Run: `npm test`
Expected: `Test Files  1 passed (1)` et `Tests  12 passed (12)`.

- [ ] **Étape 6 : Montrer ce qu'un test attrape (démonstration, non commité)**

Dans `src/jeux.js`, changer temporairement `supprimerJeu` pour qu'il garde le jeu ciblé au lieu de le retirer : remplacer `jeu.id !== id` par `jeu.id === id`.

Run: `npm test`
Expected: **échec** de plusieurs tests de `supprimerJeu` (par exemple « retire le jeu ciblé »), avec un message qui montre la différence entre le résultat attendu et le résultat obtenu.

Puis annuler le changement : `git checkout src/jeux.js`

Run: `npm test`
Expected: `Tests  12 passed (12)`.

- [ ] **Étape 7 : Commit des tests du CRUD**

```bash
git add src/crud.test.js
git commit -m "Vidéo 4 : teste ajouterJeu, modifierJeu et supprimerJeu"
```

- [ ] **Étape 8 : Tests de la recherche et des filtres**

`src/recherche.test.js` :
```js
import { describe, it, expect } from 'vitest'
import { filtrerJeux, rechercherJeux } from './jeux.js'

const jeux = [
  { id: 1, titre: 'Pokémon Épée', plateforme: 'Switch', statut: 'terminé', note: 3 },
  { id: 2, titre: 'Hades', plateforme: 'PC', statut: 'en cours', note: null },
  { id: 3, titre: 'Hollow Knight', plateforme: 'PC', statut: 'terminé', note: 5 },
]

const ids = (liste) => liste.map((jeu) => jeu.id)

describe('rechercherJeux', () => {
  it('renvoie tous les jeux quand le texte est vide', () => {
    expect(rechercherJeux(jeux, '')).toEqual(jeux)
  })

  it('ignore les majuscules et les minuscules', () => {
    expect(ids(rechercherJeux(jeux, 'HADES'))).toEqual([2])
  })

  it('ignore les accents du titre', () => {
    expect(ids(rechercherJeux(jeux, 'pokemon epee'))).toEqual([1])
  })

  it('ignore les accents du texte recherché', () => {
    const sansAccent = [{ ...jeux[0], titre: 'Pokemon Sword' }]

    expect(rechercherJeux(sansAccent, 'POKÉMON')).toHaveLength(1)
  })

  it('ignore les espaces autour du texte', () => {
    expect(ids(rechercherJeux(jeux, '  hollow  '))).toEqual([3])
  })

  it('renvoie une liste vide quand rien ne correspond', () => {
    expect(rechercherJeux(jeux, 'zzz')).toEqual([])
  })
})

describe('filtrerJeux', () => {
  it('renvoie tous les jeux sans filtre', () => {
    expect(filtrerJeux(jeux)).toEqual(jeux)
  })

  it('renvoie tous les jeux quand les filtres sont vides', () => {
    expect(filtrerJeux(jeux, { plateforme: '', statut: '' })).toEqual(jeux)
  })

  it('filtre par plateforme', () => {
    expect(ids(filtrerJeux(jeux, { plateforme: 'PC' }))).toEqual([2, 3])
  })

  it('filtre par statut', () => {
    expect(ids(filtrerJeux(jeux, { statut: 'terminé' }))).toEqual([1, 3])
  })

  it('combine plateforme et statut', () => {
    expect(ids(filtrerJeux(jeux, { plateforme: 'PC', statut: 'terminé' }))).toEqual([3])
  })

  it('renvoie une liste vide quand aucune combinaison ne correspond', () => {
    expect(filtrerJeux(jeux, { plateforme: 'Switch', statut: 'en cours' })).toEqual([])
  })
})
```

- [ ] **Étape 9 : Lancer toute la suite**

Run: `npm test`
Expected: `Test Files  2 passed (2)` et `Tests  24 passed (24)`.

Run: `npm run build`
Expected: se termine sans erreur (les fichiers de test ne sont pas dans le bundle).

- [ ] **Étape 10 : Commit des tests de recherche**

```bash
git add src/recherche.test.js
git commit -m "Vidéo 4 : teste rechercherJeux et filtrerJeux"
```

- [ ] **Étape 11 : Commit de transition et branche**

```bash
git commit --allow-empty -m "Fin de la vidéo 4 : tests unitaires"
git branch 04-tests-unitaires
```

---

## Tâche 5 : Vidéo 5, API et SQLite

**Fichiers :**
- Créer : `server/index.js`, `server/db.js`, `src/api.js`
- Déplacer (copie puis suppression de l'original) : `src/donnees.js` → `server/donnees.js`
- Supprimer : `src/crud.test.js`, `src/donnees.js`
- Modifier : `package.json`, `vite.config.js`, `eslint.config.js`, `src/jeux.js`, `src/App.jsx`, `src/index.css`

**Interfaces :**
- Consomme : `PLATEFORMES`, `STATUTS`, `rechercherJeux`, `filtrerJeux` (tâches 2 et 3) ; `JEUX_INITIAUX` (tâche 3).
- Produit, côté serveur (port `3001`, ou la variable d'environnement `PORT`) :
  - `GET /api/jeux` → `200` + tableau de jeux triés par `id`
  - `POST /api/jeux` (corps `{ titre, plateforme, statut, note? }`) → `201` + le jeu créé (avec son `id`) ; `400` + `{ erreur }` si le corps est invalide
  - `PUT /api/jeux/:id` (même corps) → `200` + le jeu mis à jour ; `400` si invalide ; `404` + `{ erreur: 'Jeu introuvable.' }` si l'`id` n'existe pas
  - `DELETE /api/jeux/:id` → `204` ; `404` + `{ erreur: 'Jeu introuvable.' }` si l'`id` n'existe pas
  - Règles de validation : `titre` et `plateforme` sont des chaînes non vides (espaces seuls refusés), `statut` est l'une des trois valeurs, `note` est `null`/absente ou un entier de 0 à 5.
- Produit, dans `server/db.js` : `db` (instance `better-sqlite3`, fichier `DB_FICHIER` ou `server/jeux.db`) et `semerSiVide(jeux)` (insère `jeux` si la table est vide).
- Produit, dans `src/api.js` : `chargerJeux()`, `creerJeu(donnees)`, `mettreAJourJeu(id, donnees)`, `retirerJeu(id)`, tous asynchrones ; ils lèvent une `Error` dont le message vient de `{ erreur }` ou vaut `Erreur <code>`.
- Retire de `src/jeux.js` : `ajouterJeu`, `modifierJeu`, `supprimerJeu` (le serveur s'en charge).

- [ ] **Étape 1 : Installer les dépendances**

Run:
```bash
npm install express better-sqlite3
npm install -D concurrently
```
Expected: `express`, `better-sqlite3` dans `dependencies`, `concurrently` dans `devDependencies`. Si l'installation de `better-sqlite3` échoue, installer les outils de compilation du système (voir le `README`) et recommencer.

- [ ] **Étape 2 : Copier les données d'exemple vers le serveur**

Le front importe encore `src/donnees.js` jusqu'à l'étape 11 : on copie maintenant, on supprime l'original à l'étape 13, pour que chaque commit intermédiaire compile.

Run: `mkdir -p server && cp src/donnees.js server/donnees.js`

- [ ] **Étape 3 : La base de données**

`server/db.js` :
```js
import Database from 'better-sqlite3'

const fichier = process.env.DB_FICHIER ?? 'server/jeux.db'

export const db = new Database(fichier)

db.exec(`
  CREATE TABLE IF NOT EXISTS jeux (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    plateforme TEXT NOT NULL,
    statut TEXT NOT NULL,
    note INTEGER
  )
`)

// Remplit la table avec des jeux d'exemple, seulement si elle est vide.
export function semerSiVide(jeux) {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM jeux').get()
  if (total > 0) return

  const inserer = db.prepare(
    'INSERT INTO jeux (titre, plateforme, statut, note) VALUES (@titre, @plateforme, @statut, @note)',
  )
  const insererTous = db.transaction((liste) => {
    for (const { titre, plateforme, statut, note } of liste) {
      inserer.run({ titre, plateforme, statut, note: note ?? null })
    }
  })
  insererTous(jeux)
}
```

- [ ] **Étape 4 : Commit de la base**

```bash
git add package.json package-lock.json server/db.js server/donnees.js
git commit -m "Vidéo 5 : installe Express et SQLite, crée la table des jeux"
```

- [ ] **Étape 5 : Le serveur Express**

`server/index.js` :
```js
import express from 'express'
import { db, semerSiVide } from './db.js'
import { JEUX_INITIAUX } from './donnees.js'

// Le serveur a sa propre liste de statuts : il ne dépend pas du code du front.
const STATUTS = ['à jouer', 'en cours', 'terminé']
const PORT = process.env.PORT ?? 3001

const app = express()
app.use(express.json())

// Renvoie un message d'erreur si le corps est invalide, sinon null.
function valider(corps) {
  if (typeof corps.titre !== 'string' || corps.titre.trim() === '') {
    return 'Le titre est obligatoire.'
  }
  if (typeof corps.plateforme !== 'string' || corps.plateforme.trim() === '') {
    return 'La plateforme est obligatoire.'
  }
  if (!STATUTS.includes(corps.statut)) {
    return 'Le statut est invalide.'
  }
  const note = corps.note ?? null
  if (note !== null && !(Number.isInteger(note) && note >= 0 && note <= 5)) {
    return 'La note doit être un entier entre 0 et 5.'
  }
  return null
}

function lireId(req) {
  const id = Number(req.params.id)
  return Number.isInteger(id) ? id : null
}

function introuvable(res) {
  return res.status(404).json({ erreur: 'Jeu introuvable.' })
}

app.get('/api/jeux', (req, res) => {
  res.json(db.prepare('SELECT * FROM jeux ORDER BY id').all())
})

app.post('/api/jeux', (req, res) => {
  const erreur = valider(req.body ?? {})
  if (erreur) return res.status(400).json({ erreur })

  const { titre, plateforme, statut, note = null } = req.body
  const resultat = db
    .prepare('INSERT INTO jeux (titre, plateforme, statut, note) VALUES (?, ?, ?, ?)')
    .run(titre.trim(), plateforme, statut, note)
  const jeu = db.prepare('SELECT * FROM jeux WHERE id = ?').get(resultat.lastInsertRowid)
  res.status(201).json(jeu)
})

app.put('/api/jeux/:id', (req, res) => {
  const id = lireId(req)
  if (id === null) return introuvable(res)

  const erreur = valider(req.body ?? {})
  if (erreur) return res.status(400).json({ erreur })

  const { titre, plateforme, statut, note = null } = req.body
  const resultat = db
    .prepare('UPDATE jeux SET titre = ?, plateforme = ?, statut = ?, note = ? WHERE id = ?')
    .run(titre.trim(), plateforme, statut, note, id)
  if (resultat.changes === 0) return introuvable(res)

  res.json(db.prepare('SELECT * FROM jeux WHERE id = ?').get(id))
})

app.delete('/api/jeux/:id', (req, res) => {
  const id = lireId(req)
  if (id === null) return introuvable(res)

  const resultat = db.prepare('DELETE FROM jeux WHERE id = ?').run(id)
  if (resultat.changes === 0) return introuvable(res)

  res.status(204).end()
})

semerSiVide(JEUX_INITIAUX)

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
```

- [ ] **Étape 6 : Vérifier l'API avec `curl` (base jetable)**

Ce bloc utilise une base temporaire `server/essai.db`, ignorée par git, supprimée à la fin. Il épingle les points de vigilance 2, 3 et 4.

```bash
DB_FICHIER=server/essai.db PORT=3011 node server/index.js & SERVEUR=$!
sleep 1

echo "--- GET : 30 jeux semés"
curl -s localhost:3011/api/jeux | grep -o '"id"' | wc -l

echo "--- POST titre vide : 400"
curl -s -w ' [%{http_code}]\n' -X POST localhost:3011/api/jeux -H 'Content-Type: application/json' \
  -d '{"titre":"   ","plateforme":"PC","statut":"terminé"}'

echo "--- POST statut invalide : 400"
curl -s -w ' [%{http_code}]\n' -X POST localhost:3011/api/jeux -H 'Content-Type: application/json' \
  -d '{"titre":"X","plateforme":"PC","statut":"nimporte"}'

echo "--- POST note hors plage : 400"
curl -s -w ' [%{http_code}]\n' -X POST localhost:3011/api/jeux -H 'Content-Type: application/json' \
  -d '{"titre":"X","plateforme":"PC","statut":"terminé","note":7}'

echo "--- POST valide avec apostrophe : 201"
curl -s -w ' [%{http_code}]\n' -X POST localhost:3011/api/jeux -H 'Content-Type: application/json' \
  -d '{"titre":"Assassin'"'"'s Creed","plateforme":"PC","statut":"à jouer"}'

echo "--- PUT id inexistant : 404"
curl -s -w ' [%{http_code}]\n' -X PUT localhost:3011/api/jeux/9999 -H 'Content-Type: application/json' \
  -d '{"titre":"X","plateforme":"PC","statut":"terminé"}'

echo "--- DELETE id inexistant : 404"
curl -s -w ' [%{http_code}]\n' -X DELETE localhost:3011/api/jeux/9999

echo "--- DELETE id 1 : 204"
curl -s -o /dev/null -w '[%{http_code}]\n' -X DELETE localhost:3011/api/jeux/1

kill $SERVEUR
rm -f server/essai.db
```

Expected, dans l'ordre :
- `30`
- `{"erreur":"Le titre est obligatoire."} [400]`
- `{"erreur":"Le statut est invalide."} [400]`
- `{"erreur":"La note doit être un entier entre 0 et 5."} [400]`
- `{"id":31,"titre":"Assassin's Creed","plateforme":"PC","statut":"à jouer","note":null} [201]`
- `{"erreur":"Jeu introuvable."} [404]`
- `{"erreur":"Jeu introuvable."} [404]`
- `[204]`

- [ ] **Étape 7 : Commit du serveur**

```bash
git add server/index.js
git commit -m "Vidéo 5 : ajoute le serveur Express et les routes CRUD"
```

- [ ] **Étape 8 : Proxy Vite et scripts npm**

`vite.config.js` : dans l'objet passé à `defineConfig` (celui du modèle), **ajouter** la clé `server` à la suite de `plugins` :
```js
  server: {
    port: 5173,
    strictPort: true,
    // Les appels à /api sont transmis au serveur Express : pas de problème de CORS.
    proxy: { '/api': 'http://localhost:3001' },
  },
```

`package.json` : dans le bloc `scripts`, **remplacer** la valeur du script `dev` et **ajouter** `client` et `serveur`, en conservant les autres scripts :
```json
    "dev": "concurrently -n client,serveur \"vite\" \"node --watch server/index.js\"",
    "client": "vite",
    "serveur": "node --watch server/index.js",
```

`eslint.config.js` : le modèle ne connaît que le code du navigateur. Ajouter, dans le tableau de configuration, à la suite de l'entrée qui cible `**/*.{js,jsx}`, une entrée pour le code Node.js (serveur et fichiers de configuration) :
```js
  {
    files: ['server/**/*.js', '*.config.js'],
    languageOptions: { globals: globals.node },
  },
```
`globals` est normalement déjà importé par le modèle (`import globals from 'globals'`) ; sinon, ajouter cet import (le paquet fait partie des dépendances du modèle).

- [ ] **Étape 9 : Commit de la configuration**

```bash
git add vite.config.js package.json eslint.config.js
git commit -m "Vidéo 5 : configure le proxy Vite, ESLint pour le serveur, et lance client et serveur ensemble"
```

- [ ] **Étape 10 : Le client d'API**

`src/api.js` :
```js
const URL_JEUX = '/api/jeux'

async function demander(url, options) {
  const reponse = await fetch(url, options)

  if (!reponse.ok) {
    const corps = await reponse.json().catch(() => ({}))
    throw new Error(corps.erreur ?? `Erreur ${reponse.status}`)
  }

  return reponse.status === 204 ? null : reponse.json()
}

function envoyer(methode, url, donnees) {
  return demander(url, {
    method: methode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees),
  })
}

export function chargerJeux() {
  return demander(URL_JEUX)
}

export function creerJeu(donnees) {
  return envoyer('POST', URL_JEUX, donnees)
}

export function mettreAJourJeu(id, donnees) {
  return envoyer('PUT', `${URL_JEUX}/${id}`, donnees)
}

export function retirerJeu(id) {
  return demander(`${URL_JEUX}/${id}`, { method: 'DELETE' })
}
```

- [ ] **Étape 11 : `App` branchée sur l'API**

`src/App.jsx` (remplacer tout le fichier) :
```jsx
import { useEffect, useState } from 'react'
import BarreFiltres from './components/BarreFiltres.jsx'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import { chargerJeux, creerJeu, mettreAJourJeu, retirerJeu } from './api.js'
import { filtrerJeux, rechercherJeux } from './jeux.js'

function App() {
  const [jeux, setJeux] = useState([])
  const [erreur, setErreur] = useState(null)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [filtres, setFiltres] = useState({ plateforme: '', statut: '' })

  // La recherche et les filtres restent côté client : on filtre la liste complète reçue du serveur.
  const jeuxAffiches = filtrerJeux(rechercherJeux(jeux, recherche), filtres)

  async function recharger() {
    try {
      setJeux(await chargerJeux())
      setErreur(null)
    } catch (e) {
      setErreur(e.message)
    }
  }

  useEffect(() => {
    recharger()
  }, [])

  // Exécute une action sur le serveur, puis recharge la liste.
  async function executer(action) {
    try {
      await action()
      await recharger()
    } catch (e) {
      setErreur(e.message)
    }
  }

  function ajouter(donnees) {
    return executer(() => creerJeu(donnees))
  }

  function enregistrerModification(donnees) {
    const id = jeuEnEdition.id
    setJeuEnEdition(null)
    return executer(() => mettreAJourJeu(id, donnees))
  }

  function supprimer(id) {
    if (jeuEnEdition?.id === id) setJeuEnEdition(null)
    return executer(() => retirerJeu(id))
  }

  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
      {erreur && (
        <p className="erreur" role="alert">
          Une erreur est survenue : {erreur}
        </p>
      )}
      {jeuEnEdition ? (
        <FormulaireJeu
          key={jeuEnEdition.id}
          jeuInitial={jeuEnEdition}
          onSoumettre={enregistrerModification}
          onAnnuler={() => setJeuEnEdition(null)}
        />
      ) : (
        <FormulaireJeu key="nouveau" onSoumettre={ajouter} />
      )}
      <BarreFiltres
        recherche={recherche}
        onRecherche={setRecherche}
        filtres={filtres}
        onFiltres={setFiltres}
      />
      <p className="compteur">
        {jeuxAffiches.length} / {jeux.length} jeux
      </p>
      <ListeJeux jeux={jeuxAffiches} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
    </main>
  )
}

export default App
```

Si `npm run lint` signale le `useEffect` de `App` (dépendances manquantes ou `setState` dans un effet), appliquer le correctif le plus petit : par exemple ajouter `// eslint-disable-next-line react-hooks/exhaustive-deps` au-dessus du tableau de dépendances, et l'expliquer dans la vidéo.

- [ ] **Étape 12 : Style du message d'erreur**

Ajouter à la fin de `src/index.css` :
```css

.erreur {
  background: #fff5f5;
  border: 1px solid #c92a2a;
  border-radius: 6px;
  color: #c92a2a;
  padding: 8px 12px;
}
```

- [ ] **Étape 13 : Retirer le CRUD côté front**

Supprimer le fichier de tests du CRUD et les données d'exemple du front (le serveur a sa propre copie) :
```bash
git rm src/crud.test.js src/donnees.js
```

Dans `src/jeux.js`, supprimer exactement ce bloc (les trois fonctions de CRUD et la ligne vide qui les suit) :
```js
export function ajouterJeu(jeux, nouveauJeu) {
  const id = jeux.reduce((max, jeu) => Math.max(max, jeu.id), 0) + 1
  return [...jeux, { ...nouveauJeu, id }]
}

export function modifierJeu(jeux, id, modifications) {
  return jeux.map((jeu) => (jeu.id === id ? { ...jeu, ...modifications, id } : jeu))
}

export function supprimerJeu(jeux, id) {
  return jeux.filter((jeu) => jeu.id !== id)
}

```

Run: `npm test`
Expected: `Test Files  1 passed (1)` et `Tests  12 passed (12)` (il ne reste que `recherche.test.js`).

Run: `npm run build`
Expected: se termine sans erreur.

Run: `npm run lint`
Expected: aucune erreur. Si une règle du modèle signale ce code, appliquer le correctif le plus petit possible et le mentionner dans le message du commit suivant.

- [ ] **Étape 14 : Vérifier l'application complète**

Run: `npm run dev` (le terminal affiche les deux processus préfixés `[client]` et `[serveur]`).

Vérification manuelle sur http://localhost:5173 :
1. 30 jeux s'affichent (« 30 / 30 jeux »), venant de la base SQLite (le fichier `server/jeux.db` a été créé).
2. Ajouter « Assassin's Creed » (avec l'apostrophe), PC, à jouer → la carte apparaît ; **recharger la page** → elle est toujours là.
3. Modifier le statut de ce jeu, puis supprimer un autre jeu → les changements survivent au rechargement.
4. Arrêter puis relancer `npm run dev` → les jeux sont toujours là.
5. Recherche et filtres : comme en vidéo 3 (`pokemon` → 1 jeu).
6. **Point de vigilance 5** : arrêter le serveur seul (garder Vite actif, par exemple avec `npm run client` dans un terminal et rien d'autre), recharger la page → le bandeau rouge « Une erreur est survenue : Erreur 500 » (ou « Failed to fetch ») s'affiche ; la page ne reste pas blanche.

Nettoyer : arrêter les processus, puis `rm -f server/jeux.db`.

- [ ] **Étape 15 : Commit du branchement du front**

```bash
git add -A src package.json
git commit -m "Vidéo 5 : branche l'interface sur l'API et retire le CRUD côté front"
```

- [ ] **Étape 16 : Commit de transition et branche**

```bash
git commit --allow-empty -m "Fin de la vidéo 5 : API et SQLite"
git branch 05-api-sqlite
```

---

## Tâche 6 : Vidéo 6, Tests Cypress

**Fichiers :**
- Créer : `cypress.config.js`, `.env.test`, `cypress/e2e/bibliotheque.cy.js`, `cypress/e2e/api.cy.js`
- Modifier : `package.json`, `eslint.config.js`, `server/index.js`, `src/App.jsx`, `src/components/CarteJeu.jsx`, `src/components/ListeJeux.jsx`, `src/components/FormulaireJeu.jsx`, `src/components/BarreFiltres.jsx`

**Interfaces :**
- Consomme : l'API de la tâche 5 ; l'application complète.
- Produit :
  - Mode test du serveur : avec `APP_ENV=test`, le serveur n'insère **pas** les jeux d'exemple et expose `POST /api/test/reinitialiser` (→ `204`, vide la table `jeux` et remet les `id` à 1). Cette route n'existe pas hors du mode test.
  - Fichier `.env.test` : `APP_ENV=test`, `DB_FICHIER=server/jeux.test.db`.
  - Scripts npm : `dev:test`, `cypress:ouvrir`, `cypress:lancer`.
  - Attributs `data-cy` : `carte-jeu`, `modifier`, `supprimer`, `aucun-jeu`, `formulaire`, `champ-titre`, `champ-plateforme`, `champ-statut`, `champ-note`, `bouton-soumettre`, `bouton-annuler`, `recherche`, `filtre-plateforme`, `filtre-statut`, `compteur`, `erreur`.

- [ ] **Étape 1 : Installer Cypress et sa configuration**

Run: `npm install -D cypress`
Expected: `cypress` apparaît dans `devDependencies` (le téléchargement du binaire peut prendre quelques minutes).

`cypress.config.js` :
```js
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
  },
})
```

- [ ] **Étape 2 : Mode test du serveur**

`.env.test` :
```
APP_ENV=test
DB_FICHIER=server/jeux.test.db
```

Dans `server/index.js`, remplacer ces lignes :
```js
semerSiVide(JEUX_INITIAUX)

app.listen(PORT, () => {
```
par :
```js
if (process.env.APP_ENV === 'test') {
  // Route réservée aux tests : repart d'une base vide avant chaque scénario.
  app.post('/api/test/reinitialiser', (req, res) => {
    db.exec("DELETE FROM jeux; DELETE FROM sqlite_sequence WHERE name = 'jeux'")
    res.status(204).end()
  })
} else {
  semerSiVide(JEUX_INITIAUX)
}

app.listen(PORT, () => {
```

Dans le bloc `scripts` de `package.json`, **ajouter** ces trois scripts en conservant les autres :
```json
    "dev:test": "concurrently -n client,serveur \"vite\" \"node --env-file=.env.test server/index.js\"",
    "cypress:ouvrir": "cypress open",
    "cypress:lancer": "cypress run"
```

`eslint.config.js` : ajouter une entrée pour les fichiers de Cypress, à la suite de celles déjà présentes :
```js
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        expect: 'readonly',
      },
    },
  },
```

- [ ] **Étape 3 : Vérifier le mode test avec `curl`**

```bash
node --env-file=.env.test server/index.js & SERVEUR=$!
sleep 1

echo "--- base de test vide (hors jeux d'exemple)"
curl -s localhost:3001/api/jeux

echo
echo "--- réinitialisation : 204"
curl -s -o /dev/null -w '[%{http_code}]\n' -X POST localhost:3001/api/test/reinitialiser

kill $SERVEUR
rm -f server/jeux.test.db

echo "--- hors mode test, la route n'existe pas : 404"
DB_FICHIER=server/essai.db PORT=3011 node server/index.js & SERVEUR=$!
sleep 1
curl -s -o /dev/null -w '[%{http_code}]\n' -X POST localhost:3011/api/test/reinitialiser
kill $SERVEUR
rm -f server/essai.db
```
Expected : `[]`, puis `[204]`, puis `[404]`.

- [ ] **Étape 4 : Commit de l'installation et du mode test**

```bash
git add package.json package-lock.json cypress.config.js .env.test server/index.js eslint.config.js
git commit -m "Vidéo 6 : installe Cypress et ajoute le mode test du serveur"
```

- [ ] **Étape 5 : Ajouter les attributs `data-cy`**

`src/components/CarteJeu.jsx` (remplacer tout le fichier) :
```jsx
function CarteJeu({ jeu, onModifier, onSupprimer }) {
  return (
    <li className="carte-jeu" data-cy="carte-jeu">
      <h2>{jeu.titre}</h2>
      <p>
        {jeu.plateforme} · {jeu.statut}
      </p>
      {jeu.note !== null && <p>Note : {jeu.note}/5</p>}
      <div className="carte-actions">
        <button
          type="button"
          className="secondaire"
          data-cy="modifier"
          onClick={() => onModifier(jeu)}
        >
          Modifier
        </button>
        <button
          type="button"
          className="danger"
          data-cy="supprimer"
          onClick={() => onSupprimer(jeu.id)}
        >
          Supprimer
        </button>
      </div>
    </li>
  )
}

export default CarteJeu
```

`src/components/ListeJeux.jsx` (remplacer tout le fichier) :
```jsx
import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux, onModifier, onSupprimer }) {
  if (jeux.length === 0) {
    return <p data-cy="aucun-jeu">Aucun jeu à afficher.</p>
  }

  return (
    <ul className="liste-jeux">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} onModifier={onModifier} onSupprimer={onSupprimer} />
      ))}
    </ul>
  )
}

export default ListeJeux
```

`src/components/FormulaireJeu.jsx` (remplacer tout le fichier) :
```jsx
import { useState } from 'react'
import { PLATEFORMES, STATUTS } from '../jeux.js'

const VIDE = { titre: '', plateforme: PLATEFORMES[0], statut: STATUTS[0], note: '' }

function FormulaireJeu({ jeuInitial, onSoumettre, onAnnuler }) {
  const [valeurs, setValeurs] = useState(
    jeuInitial ? { ...jeuInitial, note: jeuInitial.note ?? '' } : VIDE,
  )

  function changer(evenement) {
    const { name, value } = evenement.target
    setValeurs({ ...valeurs, [name]: value })
  }

  function soumettre(evenement) {
    evenement.preventDefault()
    const titre = valeurs.titre.trim()
    if (titre === '') return

    onSoumettre({
      titre,
      plateforme: valeurs.plateforme,
      statut: valeurs.statut,
      note: valeurs.note === '' ? null : Number(valeurs.note),
    })
    if (!jeuInitial) setValeurs(VIDE)
  }

  return (
    <form className="formulaire" data-cy="formulaire" onSubmit={soumettre}>
      <h2>{jeuInitial ? 'Modifier le jeu' : 'Ajouter un jeu'}</h2>
      <label>
        Titre
        <input
          name="titre"
          data-cy="champ-titre"
          value={valeurs.titre}
          onChange={changer}
          required
        />
      </label>
      <label>
        Plateforme
        <select
          name="plateforme"
          data-cy="champ-plateforme"
          value={valeurs.plateforme}
          onChange={changer}
        >
          {PLATEFORMES.map((plateforme) => (
            <option key={plateforme}>{plateforme}</option>
          ))}
        </select>
      </label>
      <label>
        Statut
        <select name="statut" data-cy="champ-statut" value={valeurs.statut} onChange={changer}>
          {STATUTS.map((statut) => (
            <option key={statut}>{statut}</option>
          ))}
        </select>
      </label>
      <label>
        Note (0 à 5)
        <select name="note" data-cy="champ-note" value={valeurs.note} onChange={changer}>
          <option value="">Aucune</option>
          {[0, 1, 2, 3, 4, 5].map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </label>
      <div className="actions">
        <button type="submit" data-cy="bouton-soumettre">
          {jeuInitial ? 'Enregistrer' : 'Ajouter'}
        </button>
        {onAnnuler && (
          <button type="button" className="secondaire" data-cy="bouton-annuler" onClick={onAnnuler}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default FormulaireJeu
```

`src/components/BarreFiltres.jsx` (remplacer tout le fichier) :
```jsx
import { PLATEFORMES, STATUTS } from '../jeux.js'

function BarreFiltres({ recherche, onRecherche, filtres, onFiltres }) {
  return (
    <div className="barre-filtres">
      <input
        type="search"
        data-cy="recherche"
        placeholder="Rechercher un titre…"
        aria-label="Rechercher un jeu"
        value={recherche}
        onChange={(evenement) => onRecherche(evenement.target.value)}
      />
      <select
        data-cy="filtre-plateforme"
        aria-label="Filtrer par plateforme"
        value={filtres.plateforme}
        onChange={(evenement) => onFiltres({ ...filtres, plateforme: evenement.target.value })}
      >
        <option value="">Toutes les plateformes</option>
        {PLATEFORMES.map((plateforme) => (
          <option key={plateforme}>{plateforme}</option>
        ))}
      </select>
      <select
        data-cy="filtre-statut"
        aria-label="Filtrer par statut"
        value={filtres.statut}
        onChange={(evenement) => onFiltres({ ...filtres, statut: evenement.target.value })}
      >
        <option value="">Tous les statuts</option>
        {STATUTS.map((statut) => (
          <option key={statut}>{statut}</option>
        ))}
      </select>
    </div>
  )
}

export default BarreFiltres
```

Dans `src/App.jsx`, remplacer :
```jsx
        <p className="erreur" role="alert">
```
par :
```jsx
        <p className="erreur" role="alert" data-cy="erreur">
```
et remplacer :
```jsx
      <p className="compteur">
```
par :
```jsx
      <p className="compteur" data-cy="compteur">
```

Run: `npm run build`
Expected: se termine sans erreur.

Run: `npm run lint`
Expected: aucune erreur. Si une règle du modèle signale ce code, appliquer le correctif le plus petit possible et le mentionner dans le message du commit suivant.

- [ ] **Étape 6 : Commit des attributs `data-cy`**

```bash
git add src
git commit -m "Vidéo 6 : ajoute les attributs data-cy pour cibler les éléments"
```

- [ ] **Étape 7 : Écrire le premier scénario (la page s'affiche)**

`cypress/e2e/bibliotheque.cy.js` :
```js
describe('Bibliothèque de jeux vidéo', () => {
  beforeEach(() => {
    // Chaque test repart d'une base de test vide.
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('affiche la page avec une bibliothèque vide', () => {
    cy.visit('/')

    cy.contains('h1', 'Ma bibliothèque de jeux vidéo')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')
    cy.get('[data-cy="compteur"]').should('have.text', '0 / 0 jeux')
  })
})
```

- [ ] **Étape 8 : Lancer ce premier scénario**

Terminal 1 (arrêter `npm run dev` s'il tourne, sinon les ports 5173 et 3001 sont pris) :
```bash
npm run dev:test
```

Terminal 2 :
```bash
npm run cypress:lancer
```
Expected: `bibliotheque.cy.js` affiche 1 test réussi (`✔  1 passing`) et le récapitulatif se termine par `All specs passed!`.

- [ ] **Étape 9 : Commit du premier scénario**

```bash
git add cypress/e2e/bibliotheque.cy.js
git commit -m "Vidéo 6 : écrit le premier scénario Cypress"
```

- [ ] **Étape 10 : Les scénarios de bout en bout**

`cypress/e2e/bibliotheque.cy.js` (remplacer tout le fichier) :
```js
const ZELDA = { titre: 'Zelda', plateforme: 'Switch', statut: 'terminé', note: 5 }
const HADES = { titre: 'Hades', plateforme: 'PC', statut: 'en cours', note: null }
const POKEMON = { titre: 'Pokémon Épée', plateforme: 'Switch', statut: 'terminé', note: 3 }

// Crée les jeux directement via l'API (plus rapide que de passer par le formulaire), puis ouvre la page.
function visiterAvec(jeux) {
  jeux.forEach((jeu) => cy.request('POST', '/api/jeux', jeu))
  cy.visit('/')
}

describe('Bibliothèque de jeux vidéo', () => {
  beforeEach(() => {
    // Chaque test repart d'une base de test vide.
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('affiche la page avec une bibliothèque vide', () => {
    cy.visit('/')

    cy.contains('h1', 'Ma bibliothèque de jeux vidéo')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')
    cy.get('[data-cy="compteur"]').should('have.text', '0 / 0 jeux')
  })

  it('ajoute un jeu et le retrouve après rechargement', () => {
    cy.visit('/')

    cy.get('[data-cy="champ-titre"]').type("Assassin's Creed")
    cy.get('[data-cy="champ-plateforme"]').select('PC')
    cy.get('[data-cy="champ-statut"]').select('en cours')
    cy.get('[data-cy="champ-note"]').select('4')
    cy.get('[data-cy="bouton-soumettre"]').click()

    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', "Assassin's Creed")
    cy.get('[data-cy="champ-titre"]').should('have.value', '')

    cy.reload()
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', "Assassin's Creed")
  })

  it('modifie un jeu', () => {
    visiterAvec([ZELDA])

    cy.get('[data-cy="modifier"]').click()
    cy.get('[data-cy="champ-titre"]').should('have.value', 'Zelda')
    cy.get('[data-cy="champ-titre"]').clear().type('Zelda BOTW')
    cy.get('[data-cy="champ-statut"]').select('en cours')
    cy.get('[data-cy="bouton-soumettre"]').click()

    cy.get('[data-cy="carte-jeu"]').should('have.length', 1)
    cy.get('[data-cy="carte-jeu"]').should('contain', 'Zelda BOTW').and('contain', 'en cours')
    cy.get('[data-cy="bouton-soumettre"]').should('contain', 'Ajouter')
  })

  it('supprime un jeu', () => {
    visiterAvec([ZELDA, HADES])

    cy.contains('[data-cy="carte-jeu"]', 'Zelda').find('[data-cy="supprimer"]').click()

    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Hades')
    cy.contains('Zelda').should('not.exist')
  })

  it('recherche un jeu sans tenir compte des accents ni de la casse', () => {
    visiterAvec([ZELDA, HADES, POKEMON])
    cy.get('[data-cy="carte-jeu"]').should('have.length', 3)

    cy.get('[data-cy="recherche"]').type('pokemon')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Pokémon Épée')

    cy.get('[data-cy="recherche"]').clear()
    cy.get('[data-cy="carte-jeu"]').should('have.length', 3)

    cy.get('[data-cy="recherche"]').type('zzz')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')
  })

  it('filtre par plateforme et par statut', () => {
    visiterAvec([ZELDA, HADES, POKEMON])

    cy.get('[data-cy="filtre-plateforme"]').select('Switch')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 2)
    cy.get('[data-cy="compteur"]').should('have.text', '2 / 3 jeux')

    cy.get('[data-cy="filtre-statut"]').select('en cours')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')

    cy.get('[data-cy="filtre-plateforme"]').select('Toutes les plateformes')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Hades')
  })

  it('refuse un titre vide ou fait d’espaces', () => {
    cy.visit('/')

    cy.get('[data-cy="bouton-soumettre"]').click()
    cy.get('[data-cy="carte-jeu"]').should('not.exist')

    cy.get('[data-cy="champ-titre"]').type('   ')
    cy.get('[data-cy="bouton-soumettre"]').click()
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
  })

  it('affiche un message quand le serveur répond par une erreur', () => {
    cy.intercept('GET', '/api/jeux', { statusCode: 500, body: { erreur: 'Boom' } })

    cy.visit('/')

    cy.get('[data-cy="erreur"]').should('contain', 'Boom')
  })
})
```

`cypress/e2e/api.cy.js` :
```js
const VALIDE = { titre: 'Hades', plateforme: 'PC', statut: 'terminé', note: 5 }

function requete(methode, url, corps) {
  return cy.request({ method: methode, url, body: corps, failOnStatusCode: false })
}

describe('API des jeux', () => {
  beforeEach(() => {
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('refuse un titre vide', () => {
    requete('POST', '/api/jeux', { ...VALIDE, titre: '   ' }).then((reponse) => {
      expect(reponse.status).to.eq(400)
      expect(reponse.body.erreur).to.eq('Le titre est obligatoire.')
    })
  })

  it('refuse un statut invalide', () => {
    requete('POST', '/api/jeux', { ...VALIDE, statut: 'nimporte' }).its('status').should('eq', 400)
  })

  it('refuse une note hors de 0 à 5', () => {
    requete('POST', '/api/jeux', { ...VALIDE, note: 7 }).its('status').should('eq', 400)
  })

  it('répond 404 quand on modifie un jeu inexistant', () => {
    requete('PUT', '/api/jeux/9999', VALIDE).then((reponse) => {
      expect(reponse.status).to.eq(404)
      expect(reponse.body.erreur).to.eq('Jeu introuvable.')
    })
  })

  it('répond 404 quand on supprime un jeu inexistant', () => {
    requete('DELETE', '/api/jeux/9999').its('status').should('eq', 404)
  })

  it('crée un jeu puis le renvoie dans la liste', () => {
    requete('POST', '/api/jeux', VALIDE).then((reponse) => {
      expect(reponse.status).to.eq(201)
      expect(reponse.body).to.deep.include({ id: 1, titre: 'Hades' })
    })

    requete('GET', '/api/jeux').then((reponse) => {
      expect(reponse.body).to.have.length(1)
      expect(reponse.body[0].titre).to.eq('Hades')
    })
  })
})
```

- [ ] **Étape 11 : Lancer toute la suite Cypress**

Avec `npm run dev:test` toujours actif dans le terminal 1 :

Run: `npm run cypress:lancer`
Expected: deux fichiers, `api.cy.js` (6 tests) et `bibliotheque.cy.js` (8 tests), tous réussis ; le récapitulatif se termine par `All specs passed!` (14 tests au total).

Vérifier aussi le mode interactif : `npm run cypress:ouvrir`, choisir « E2E Testing », puis un navigateur, puis `bibliotheque.cy.js` ; le scénario se déroule à l'écran.

Puis arrêter `npm run dev:test` et nettoyer : `rm -f server/jeux.test.db`.

- [ ] **Étape 12 : Vérifier que la vraie bibliothèque n'a pas été touchée**

Run: `ls server/`
Expected: la base de test est un fichier séparé (`jeux.test.db`, supprimé à l'étape précédente) ; si `server/jeux.db` existe, sa taille et sa date de modification n'ont pas changé pendant les tests.

- [ ] **Étape 13 : Commit des scénarios**

```bash
git add cypress
git commit -m "Vidéo 6 : écrit les scénarios Cypress de bout en bout et de l'API"
```

- [ ] **Étape 14 : Commit de transition et branche**

```bash
git commit --allow-empty -m "Fin de la vidéo 6 : tests Cypress"
git branch 06-cypress
```

---

## Tâche 7 : Vérification finale du dépôt

Pas une vidéo : on s'assure que le dépôt livré se comporte comme le `README` le promet.

- [ ] **Étape 1 : Vérifier l'historique et les branches**

Run: `git log --oneline --grep='^Fin de la vidéo'`
Expected, six lignes, de la plus récente à la plus ancienne :
```
… Fin de la vidéo 6 : tests Cypress
… Fin de la vidéo 5 : API et SQLite
… Fin de la vidéo 4 : tests unitaires
… Fin de la vidéo 3 : recherche et filtres
… Fin de la vidéo 2 : le CRUD
… Fin de la vidéo 1 : mise en place
```

Run: `git branch --list` et `git rev-parse main 06-cypress`
Expected: les six branches `01-…` à `06-…` plus `main` existent ; `main` et `06-cypress` affichent le même identifiant de commit.

Run: `git log --oneline --merges | wc -l`
Expected: `0` (historique linéaire).

- [ ] **Étape 2 : Vérifier un clone neuf de la branche finale**

```bash
rm -rf /tmp/verif-jeux-video
git clone . /tmp/verif-jeux-video
cd /tmp/verif-jeux-video
npm install
npm test
npm run build
cd -
rm -rf /tmp/verif-jeux-video
```
Expected: l'installation réussit, `Tests  12 passed (12)`, le build se termine sans erreur.

- [ ] **Étape 3 : Vérifier le point de reprise d'une branche intermédiaire**

```bash
rm -rf /tmp/verif-jeux-video
git clone . /tmp/verif-jeux-video
cd /tmp/verif-jeux-video
git checkout 04-tests-unitaires
npm install
npm test
cd -
rm -rf /tmp/verif-jeux-video
```
Expected: `Tests  24 passed (24)` (c'est la branche qui contient encore les tests du CRUD).

- [ ] **Étape 4 : Vérifier qu'aucun fichier parasite n'est suivi**

Run: `git ls-files | grep -E '\.db$|node_modules|cypress/(videos|screenshots)' | wc -l`
Expected: `0`.

Run: `git status --short`
Expected: aucune sortie (arbre propre).
