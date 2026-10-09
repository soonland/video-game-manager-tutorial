# Tutoriel : gérer une bibliothèque de jeux vidéo (React + Express + SQLite)

## Objectif

Une série de 7 vidéos d'apprentissage qui guide des **débutants** dans la création d'une application de gestion de bibliothèque de jeux vidéo. Les concepts au centre du tutoriel :

- les opérations CRUD
- la recherche et les filtres
- les tests unitaires
- les tests de bout en bout avec Cypress

La stack finale (React + Vite, Express, SQLite) est atteinte progressivement. Chaque vidéo se termine sur une application qui fonctionne.

## Décisions retenues

| Sujet | Décision | Raison |
|---|---|---|
| Public | Débutants | Limiter la charge de configuration et de concepts |
| Langage | JavaScript (pas TypeScript) | Éviter une couche de concepts. TypeScript = suite possible |
| Front | React + Vite | Stack visée à terme |
| Back | Express + `better-sqlite3` | Express est le plus répandu et le plus simple pour des routes CRUD |
| Base de données | SQLite | Un seul fichier, aucune installation de serveur |
| Tests unitaires | Vitest | S'intègre à Vite sans configuration |
| Tests E2E | Cypress | Demandé explicitement |
| Style | CSS écrit à la main, sobre | L'apprentissage porte sur le code, pas sur le design |
| Navigation (vidéo 7) | `react-router`, deux routes | Introduit le routage côté client pour la seconde page « Consoles » |
| Organisation | Un seul `package.json` à la racine, pas de monorepo | Pas d'outillage de monorepo (workspaces, Turborepo) à expliquer |
| Progression | Une branche git par fin de vidéo | Permet de « voyager » dans le tutoriel sans tout refaire |

## Modèle de données

Un jeu :

- `id`
- `titre`
- `plateforme`
- `statut` : `à jouer` | `en cours` | `terminé`
- `note` : de 0 à 5, facultative

À partir de la **vidéo 7**, `plateforme` (texte) est remplacée par `console_id` : une console (`id`, `nom` unique) a plusieurs jeux, un jeu appartient à une seule console (relation 1 à N). Les vidéos 1 à 6 gardent la plateforme en texte.

## Organisation du projet

```
jeux-video/
├── package.json        ← un seul, à la racine
├── src/                ← React (le front)
│   └── jeux.js         ← logique pure : recherche et filtres (et CRUD jusqu'à la vidéo 4)
├── server/             ← Express + SQLite (ajouté en vidéo 5)
└── cypress/            ← tests E2E (ajouté en vidéo 6)
```

- Jusqu'à la vidéo 4, il n'y a que `src/`.
- La logique métier vit dans des fonctions pures (`jeux.js`). Les composants React ne font que les appeler. Cette séparation rend les tests de la vidéo 4 simples.
- `npm run dev` démarre client et serveur ensemble (paquet `concurrently`) à partir de la vidéo 5.

## Rituel de fin de vidéo

Chaque vidéo se termine par la même consigne : **le lecteur fait un commit dans son propre projet** avant de passer à la suivante.

- Message suggéré : `Fin de la vidéo N : <sujet>` (par exemple `Fin de la vidéo 2 : CRUD`).
- Avant de committer, le lecteur vérifie que l'application fonctionne (et, à partir de la vidéo 4, que les tests passent).
- Ce commit lui donne un point de retour à chaque transition, et un repère pour comparer son travail à la branche de référence correspondante.
- Le rituel est montré en vidéo 1 (premier commit) puis simplement rappelé à la fin des vidéos suivantes.

## Progression en vidéos

### Vidéo 1 : Mise en place
- **Plan :** présenter brièvement comment utiliser le tutoriel (projet personnel du lecteur, dépôt de référence et branches comme filet de sécurité), puis créer le projet avec `npm create vite@latest`, nettoyer le modèle par défaut, définir la structure des dossiers, créer les composants `ListeJeux` et `CarteJeu`, afficher 4 ou 5 jeux écrits en dur.
- **Résultat :** une page qui affiche une liste de jeux.
- **Concepts :** structure d'un projet, composants, props.
- **Pièges :** `key` oubliées dans les listes, confusion props/état, fichiers par défaut de Vite.

### Vidéo 2 : Le CRUD
- **Plan :** passer les jeux dans un état (`useState`), écrire `ajouterJeu`, `modifierJeu` et `supprimerJeu` dans `jeux.js`, créer un formulaire réutilisable pour l'ajout et la modification, ajouter un bouton de suppression.
- **Résultat :** on peut gérer sa liste, mais tout disparaît au rechargement de la page. Ce point est dit explicitement dans la vidéo : il motive la vidéo 5.
- **Concepts :** état React, formulaires contrôlés, logique CRUD dans des fonctions pures.
- **Pièges :** modifier l'état directement au lieu de créer un nouveau tableau, générer des `id` uniques.

### Vidéo 3 : Recherche et filtres
- **Plan :** écrire `rechercherJeux(jeux, texte)` et `filtrerJeux(jeux, { plateforme, statut })`, brancher une barre de recherche et des menus de filtre, combiner les deux.
- **Résultat :** on retrouve un jeu en quelques secondes dans une liste de 30 jeux.
- **Concepts :** dérivation de données, combinaison de filtres.
- **Pièges :** casse et accents dans la recherche, ne pas stocker la liste filtrée dans l'état (on la calcule à partir de la liste complète), cas « aucun résultat ».

### Vidéo 4 : Tests unitaires (Vitest)
- **Plan :** installer Vitest, écrire un premier test simple pour comprendre `describe` / `it` / `expect`, puis tester `ajouterJeu`, `modifierJeu`, `supprimerJeu`, `rechercherJeux` et `filtrerJeux`.
- **Cas limites :** liste vide, `id` inexistant, recherche sans accents ou en majuscules, filtres combinés, liste d'origine non modifiée.
- **Résultat :** une suite de tests qui passe, et un test qui échoue volontairement pour montrer ce qu'un test attrape.
- **Pièges :** tester l'implémentation plutôt que le comportement, tests qui dépendent les uns des autres.

### Vidéo 5 : API et SQLite
- **Plan :**
  1. Créer `server/` avec Express et `better-sqlite3`.
  2. Écrire `db.js` : création de la table `jeux` au démarrage.
  3. Définir `GET /api/jeux`, `POST /api/jeux`, `PUT /api/jeux/:id` et `DELETE /api/jeux/:id`.
  4. Configurer le proxy de Vite et lancer client et serveur ensemble.
  5. Remplacer l'état local de React par des appels `fetch`.
- **Résultat :** les jeux survivent au rechargement de la page et au redémarrage du serveur.
- **Décision de conception :** `ajouter`, `modifier` et `supprimer` passent côté serveur. La **recherche et les filtres restent côté client** : le front récupère toute la liste et réutilise les fonctions déjà testées en vidéo 4. Limite à dire dans la vidéo : cela ne passerait pas à l'échelle sur des milliers de jeux. Le filtrage en SQL est une piste d'extension.
- **Pièges :** oublier `express.json()`, requêtes SQL construites avec du texte (montrer les requêtes paramétrées), erreurs CORS (évitées par le proxy).
- **À surveiller au tournage :** si la vidéo devient trop longue, la scinder en deux (8 vidéos au total avec la vidéo 7).

### Vidéo 6 : Tests Cypress
- **Plan :** installer Cypress, écrire un premier scénario (la page s'affiche), puis les scénarios de bout en bout : ajouter, modifier, rechercher, filtrer et supprimer un jeu. Cibler les éléments avec des attributs `data-cy`.
- **Isolation des données :** le serveur utilise une **base de test séparée**, remise à zéro avant chaque test via une petite route réservée à cet usage. Les tests ne touchent jamais à la vraie bibliothèque.
- **Résultat :** une suite E2E qui tourne en mode interactif et en ligne de commande.
- **Pièges :** sélecteurs fragiles (texte, classes CSS), tests qui dépendent de l'état laissé par le précédent, `cy.wait` fixes.
- **Mise en perspective :** récapitulatif de ce que couvre chaque type de test (unitaire contre E2E).

### Vidéo 7 : Consoles et relations 1-N
- **Plan :**
  1. Créer la table `consoles` et remplacer `jeux.plateforme` par `jeux.console_id INTEGER NOT NULL REFERENCES consoles(id)`. Activer `PRAGMA foreign_keys = ON` : SQLite n'applique pas les clés étrangères par défaut.
  2. Semer les 4 consoles (PC, PlayStation, Xbox, Switch) ; les 30 jeux d'exemple pointent vers elles.
  3. Ajouter les routes `GET`, `POST`, `PUT` et `DELETE /api/consoles`.
  4. Adapter les routes `/api/jeux` : `console_id` remplace `plateforme`, et `GET /api/jeux` renvoie aussi le nom de la console (via un `JOIN`).
  5. Installer `react-router` (dernière version) et déclarer deux routes : `/` (les jeux) et `/consoles` (une **seconde page**), avec une navigation entre les deux. La page « Consoles » liste les consoles avec leur nombre de jeux et permet l'ajout, le renommage et la suppression. L'état (jeux, consoles, recherche, filtres) reste dans `App` et est partagé entre les deux pages.
  6. Le formulaire d'un jeu propose les consoles de la base (désactivé avec un message s'il n'y en a aucune) ; le filtre par plateforme devient un filtre par console (`filtrerJeux` filtre sur `consoleId`, la constante `PLATEFORMES` disparaît).
  7. Mettre à jour les tests Vitest (`filtrerJeux`) et les scénarios Cypress, puis ajouter les nouveaux.
- **Règles de la relation :**
  - `nom` d'une console : obligatoire (espaces seuls refusés), unique (`409` si doublon).
  - Supprimer une console qui contient encore des jeux est **refusé** : `409` avec « Cette console contient encore des jeux. » ; id inconnu : `404`.
  - Un `console_id` inexistant dans `POST` ou `PUT /api/jeux` donne `400` avec « Console inconnue. ».
- **Résultat :** on gère ses consoles, chaque jeu est rattaché à une console, et la base empêche les incohérences.
- **Concepts :** clé étrangère, relation 1 à N, `JOIN`, contraintes d'intégrité, codes `409` et `400`, routage côté client (deux pages, navigation).
- **Pièges :**
  - `PRAGMA foreign_keys` désactivé par défaut.
  - `CREATE TABLE IF NOT EXISTS` ne modifie pas une table existante : le lecteur doit **supprimer `server/jeux.db`** pour repartir sur le nouveau schéma (une vraie migration est hors périmètre).
  - Ordre de suppression avec les clés étrangères (jeux avant consoles) dans la route de réinitialisation des tests.
  - Un message d'erreur resté affiché après un changement de page : il est effacé au clic sur la navigation.
- **Tests Cypress :**
  - Les scénarios existants sont adaptés : une console doit exister avant de créer un jeu.
  - Nouveaux scénarios : ajouter, renommer et supprimer une console vide (sur la page `/consoles`) ; refus de supprimer une console qui contient des jeux ; doublon de nom refusé ; obligation de choisir une console pour un jeu ; navigation entre les deux pages, y compris l'ouverture directe de `/consoles`.
  - `api.cy.js` ajoute les cas `409`, `404` et `400` des consoles.
  - La route de réinitialisation vide aussi `consoles`.
- **Conclusion de la série :** pistes pour la suite : TypeScript, authentification, API externe comme RAWG, relations N-N, séparation front/back en deux packages dans un vrai projet.

## Dépôt de référence et branches git

Le dépôt de référence a **un historique linéaire** sur `main`, dans l'ordre du tournage :

- un commit par étape à l'intérieur d'une vidéo ;
- un **commit de transition** qui marque la fin de chaque vidéo, avec le message `Fin de la vidéo N : <sujet>`.

Chaque branche est une étiquette qui pointe vers le commit de transition correspondant. L'arrivée de la vidéo N est le départ de la vidéo N+1.

| Branche | Pointe vers |
|---|---|
| `01-mise-en-place` | Commit de transition de la vidéo 1 |
| `02-crud` | Commit de transition de la vidéo 2 |
| `03-recherche-filtres` | Commit de transition de la vidéo 3 |
| `04-tests-unitaires` | Commit de transition de la vidéo 4 |
| `05-api-sqlite` | Commit de transition de la vidéo 5 |
| `06-cypress` | Commit de transition de la vidéo 6 |
| `07-consoles` | Commit de transition de la vidéo 7, identique à `main` |

- `git log --oneline` sur `main` sert de table des matières du tutoriel.
- Le point de départ de la vidéo 1 est un dossier vide.
- Les branches servent de **référence et de point de reprise**, pas de point d'entrée normal.

### Comment le lecteur utilise le dépôt

1. **Par défaut :** il construit dans son propre projet. Il commence par `npm create vite`, fait son propre `git init` et committe comme il veut. Il apprend en écrivant le code lui-même.
2. **Pour comparer :** il consulte la branche correspondante sur GitHub, ou utilise `git diff <branche N-1> <branche N>`, qui montre exactement ce que la vidéo N ajoute.
3. **En cas de blocage :** il clone le dépôt de référence dans un **dossier séparé** (`git clone <url> jeux-video-reference`), fait `git checkout` de la branche de la vidéo précédente, puis repart de cet état propre, en copiant les fichiers ou en continuant dans ce clone.

Ce parcours est expliqué au début de la vidéo 1 (voir ci-dessous) et détaillé dans le `README`.

### Maintenance

Il n'y a qu'une seule histoire à maintenir. Pour corriger une étape, on réécrit l'historique à partir de ce commit (`rebase`), puis on replace les branches sur les nouveaux commits de transition. On construit le dépôt à la main, dans l'ordre des vidéos. Un script de reconstruction ne sera écrit que si les corrections deviennent fréquentes.

## README du dépôt de référence

Livrable à part entière, à la racine du dépôt. Il contient :

- les **prérequis** : Node.js, git, un éditeur de code ;
- la **mise en route**, avec les commandes à copier ;
- l'explication des trois façons d'utiliser le dépôt (voir ci-dessus) et la liste des branches avec la vidéo correspondante.

La vidéo 1 y renvoie et ne refait qu'une démonstration courte de `git init` et d'un premier commit.

## Hors périmètre

- TypeScript
- Authentification
- Bibliothèque de composants UI
- Appels à une API externe (RAWG, IGDB)
- Déploiement
- Filtrage et recherche en SQL
- Relations N-N (un jeu sur plusieurs consoles)
- Migrations de schéma
- Monorepo avec outillage (workspaces, Turborepo)
