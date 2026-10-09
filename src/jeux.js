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
