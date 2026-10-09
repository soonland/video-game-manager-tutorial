import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux, onModifier, onSupprimer }) {
  if (jeux.length === 0) {
    return (
      <p className="text-slate-400" data-cy="aucun-jeu">
        Aucun jeu à afficher.
      </p>
    )
  }

  return (
    <ul className="grid gap-3">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} onModifier={onModifier} onSupprimer={onSupprimer} />
      ))}
    </ul>
  )
}

export default ListeJeux
