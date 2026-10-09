// Fonctions pures de la bibliothèque : elles ne modifient jamais la liste reçue,
// elles renvoient toujours une nouvelle liste.

export const PLATEFORMES = ['PC', 'PlayStation', 'Xbox', 'Switch']
export const STATUTS = ['à jouer', 'en cours', 'terminé']

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

export function filtrerJeux(jeux, { consoleId = '', statut = '' } = {}) {
  return jeux.filter(
    (jeu) =>
      (consoleId === '' || jeu.console_id === consoleId) &&
      (statut === '' || jeu.statut === statut),
  )
}
