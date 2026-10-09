# Bibliothèque de jeux vidéo : dépôt de référence

Ce dépôt accompagne la série de 8 vidéos « Créer une application de gestion de bibliothèque de jeux vidéo » (React + Vite, Express, SQLite, Vitest, Cypress).

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
| 6 | Tests Cypress | `06-cypress` |
| 7 | Consoles et relations 1-N | `07-consoles` |
| 8 | Habillage avec Tailwind | `08-tailwind` (identique à `main`) |

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

## Avertissements « allow-scripts » (npm récent)

Selon ta version de npm, `npm install` peut afficher `npm warn allow-scripts` à propos de paquets qui ont un script d'installation (`better-sqlite3`, `cypress`, `fsevents`). Si l'application et les tests fonctionnent, tu peux ignorer ces avertissements. Si une commande échoue ensuite :

- Cypress dit que son binaire est introuvable : lance `npx cypress install`.
- `better-sqlite3` ne se charge pas : lance `npm approve-scripts better-sqlite3` puis `npm rebuild better-sqlite3`.

## Passer d'une branche à une autre (à partir de la vidéo 5)

La base de données est un fichier (`server/jeux.db`) qui n'est pas dans git. Quand le schéma change (par exemple entre `06-cypress` et `07-consoles`), **supprime ce fichier** avant de relancer l'application : SQLite ne modifie pas une table qui existe déjà, et l'ancien fichier ferait échouer le démarrage.

```bash
rm -f server/jeux.db
npm run dev
```

Après un changement de branche, relance aussi `npm install` : certaines branches ajoutent des dépendances (par exemple `react-router` en vidéo 7, Tailwind en vidéo 8).

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
