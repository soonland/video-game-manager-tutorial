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
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})
