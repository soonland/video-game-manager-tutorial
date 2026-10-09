import Database from 'better-sqlite3'

const fichier = process.env.DB_FICHIER ?? 'server/jeux.db'

export const db = new Database(fichier)

// SQLite n'applique pas les clés étrangères par défaut : il faut les activer.
db.pragma('foreign_keys = ON')

// Attention : CREATE TABLE IF NOT EXISTS ne modifie pas une table qui existe déjà.
// Après un changement de schéma, supprime le fichier de base (server/jeux.db).
db.exec(`
  CREATE TABLE IF NOT EXISTS consoles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE COLLATE NOCASE
  );

  CREATE TABLE IF NOT EXISTS jeux (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    console_id INTEGER NOT NULL REFERENCES consoles(id),
    statut TEXT NOT NULL,
    note INTEGER
  );
`)

// Remplit la base avec des consoles et des jeux d'exemple, seulement si elle est vide.
// Chaque jeu désigne sa console par son nom (champ "plateforme" de donnees.js).
export function semerSiVide(consoles, jeux) {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM consoles').get()
  if (total > 0) return

  const insererConsole = db.prepare('INSERT INTO consoles (nom) VALUES (?)')
  const insererJeu = db.prepare(
    'INSERT INTO jeux (titre, console_id, statut, note) VALUES (?, ?, ?, ?)',
  )
  const semer = db.transaction(() => {
    const idParNom = {}
    for (const nom of consoles) {
      idParNom[nom] = insererConsole.run(nom).lastInsertRowid
    }
    for (const { titre, plateforme, statut, note } of jeux) {
      insererJeu.run(titre, idParNom[plateforme], statut, note ?? null)
    }
  })
  semer()
}
