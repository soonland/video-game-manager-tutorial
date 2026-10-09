function CarteJeu({ jeu }) {
  return (
    <li className="carte-jeu">
      <h2>{jeu.titre}</h2>
      <p>
        {jeu.plateforme} · {jeu.statut}
      </p>
      {jeu.note !== null && <p>Note : {jeu.note}/5</p>}
    </li>
  )
}

export default CarteJeu
