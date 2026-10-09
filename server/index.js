import express from 'express'
import { db, semerSiVide } from './db.js'
import { CONSOLES_INITIALES, JEUX_INITIAUX } from './donnees.js'

// Le serveur a sa propre liste de statuts : il ne dépend pas du code du front.
const STATUTS = ['à jouer', 'en cours', 'terminé']
const PORT = process.env.PORT ?? 3001

// Un jeu est toujours lu avec le nom de sa console (JOIN).
const SELECT_JEUX = `
  SELECT jeux.id, jeux.titre, jeux.console_id, consoles.nom AS console, jeux.statut, jeux.note
  FROM jeux JOIN consoles ON consoles.id = jeux.console_id
`

// Une console est lue avec le nombre de jeux qu'elle contient.
const SELECT_CONSOLES = `
  SELECT consoles.id, consoles.nom, COUNT(jeux.id) AS nb_jeux
  FROM consoles LEFT JOIN jeux ON jeux.console_id = consoles.id
`

const app = express()
app.use(express.json())

// Renvoie un message d'erreur si le corps est invalide, sinon null.
function validerJeu(corps) {
  if (typeof corps.titre !== 'string' || corps.titre.trim() === '') {
    return 'Le titre est obligatoire.'
  }
  if (!Number.isInteger(corps.console_id)) {
    return 'La console est obligatoire.'
  }
  if (!db.prepare('SELECT 1 FROM consoles WHERE id = ?').get(corps.console_id)) {
    return 'Console inconnue.'
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

function validerConsole(corps) {
  if (typeof corps.nom !== 'string' || corps.nom.trim() === '') {
    return 'Le nom est obligatoire.'
  }
  return null
}

function lireId(req) {
  const id = Number(req.params.id)
  return Number.isInteger(id) ? id : null
}

function lireConsole(id) {
  return db.prepare(`${SELECT_CONSOLES} WHERE consoles.id = ? GROUP BY consoles.id`).get(id)
}

function estDoublon(erreur) {
  return erreur.code === 'SQLITE_CONSTRAINT_UNIQUE'
}

function jeuIntrouvable(res) {
  return res.status(404).json({ erreur: 'Jeu introuvable.' })
}

function consoleIntrouvable(res) {
  return res.status(404).json({ erreur: 'Console introuvable.' })
}

// --- Jeux ---

app.get('/api/jeux', (req, res) => {
  res.json(db.prepare(`${SELECT_JEUX} ORDER BY jeux.id`).all())
})

app.post('/api/jeux', (req, res) => {
  const erreur = validerJeu(req.body ?? {})
  if (erreur) return res.status(400).json({ erreur })

  const { titre, console_id, statut, note = null } = req.body
  const resultat = db
    .prepare('INSERT INTO jeux (titre, console_id, statut, note) VALUES (?, ?, ?, ?)')
    .run(titre.trim(), console_id, statut, note)
  res.status(201).json(db.prepare(`${SELECT_JEUX} WHERE jeux.id = ?`).get(resultat.lastInsertRowid))
})

app.put('/api/jeux/:id', (req, res) => {
  const id = lireId(req)
  if (id === null) return jeuIntrouvable(res)

  const erreur = validerJeu(req.body ?? {})
  if (erreur) return res.status(400).json({ erreur })

  const { titre, console_id, statut, note = null } = req.body
  const resultat = db
    .prepare('UPDATE jeux SET titre = ?, console_id = ?, statut = ?, note = ? WHERE id = ?')
    .run(titre.trim(), console_id, statut, note, id)
  if (resultat.changes === 0) return jeuIntrouvable(res)

  res.json(db.prepare(`${SELECT_JEUX} WHERE jeux.id = ?`).get(id))
})

app.delete('/api/jeux/:id', (req, res) => {
  const id = lireId(req)
  if (id === null) return jeuIntrouvable(res)

  const resultat = db.prepare('DELETE FROM jeux WHERE id = ?').run(id)
  if (resultat.changes === 0) return jeuIntrouvable(res)

  res.status(204).end()
})

// --- Consoles ---

app.get('/api/consoles', (req, res) => {
  res.json(db.prepare(`${SELECT_CONSOLES} GROUP BY consoles.id ORDER BY consoles.id`).all())
})

app.post('/api/consoles', (req, res) => {
  const erreur = validerConsole(req.body ?? {})
  if (erreur) return res.status(400).json({ erreur })

  try {
    const resultat = db.prepare('INSERT INTO consoles (nom) VALUES (?)').run(req.body.nom.trim())
    res.status(201).json(lireConsole(resultat.lastInsertRowid))
  } catch (e) {
    if (estDoublon(e)) return res.status(409).json({ erreur: 'Cette console existe déjà.' })
    throw e
  }
})

app.put('/api/consoles/:id', (req, res) => {
  const id = lireId(req)
  if (id === null) return consoleIntrouvable(res)

  const erreur = validerConsole(req.body ?? {})
  if (erreur) return res.status(400).json({ erreur })

  try {
    const resultat = db
      .prepare('UPDATE consoles SET nom = ? WHERE id = ?')
      .run(req.body.nom.trim(), id)
    if (resultat.changes === 0) return consoleIntrouvable(res)
    res.json(lireConsole(id))
  } catch (e) {
    if (estDoublon(e)) return res.status(409).json({ erreur: 'Cette console existe déjà.' })
    throw e
  }
})

app.delete('/api/consoles/:id', (req, res) => {
  const id = lireId(req)
  if (id === null) return consoleIntrouvable(res)

  const existante = lireConsole(id)
  if (!existante) return consoleIntrouvable(res)
  if (existante.nb_jeux > 0) {
    return res.status(409).json({ erreur: 'Cette console contient encore des jeux.' })
  }

  db.prepare('DELETE FROM consoles WHERE id = ?').run(id)
  res.status(204).end()
})

if (process.env.APP_ENV === 'test') {
  // Route réservée aux tests : repart d'une base vide avant chaque scénario.
  // Les jeux sont supprimés avant les consoles à cause de la clé étrangère.
  app.post('/api/test/reinitialiser', (req, res) => {
    db.exec(`
      DELETE FROM jeux;
      DELETE FROM consoles;
      DELETE FROM sqlite_sequence WHERE name IN ('jeux', 'consoles');
    `)
    res.status(204).end()
  })
} else {
  semerSiVide(CONSOLES_INITIALES, JEUX_INITIAUX)
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
