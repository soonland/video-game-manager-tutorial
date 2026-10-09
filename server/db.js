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
