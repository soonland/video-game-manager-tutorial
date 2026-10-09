import CarteJeu from './CarteJeu.jsx'

function ListeJeux({ jeux }) {
  return (
    <ul className="liste-jeux">
      {jeux.map((jeu) => (
        <CarteJeu key={jeu.id} jeu={jeu} />
      ))}
    </ul>
  )
}

export default ListeJeux
