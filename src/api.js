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
