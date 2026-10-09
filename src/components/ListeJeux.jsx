import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux, onModifier, onSupprimer }) {
  return (
    <ul className="liste-jeux">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} onModifier={onModifier} onSupprimer={onSupprimer} />
      ))}
    </ul>
  )
}

export default ListeJeux
