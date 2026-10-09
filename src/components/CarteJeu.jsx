function CarteJeu({ jeu, onModifier, onSupprimer }) {
  return (
    <li className="carte-jeu">
      <h2>{jeu.titre}</h2>
      <p>
        {jeu.plateforme} · {jeu.statut}
      </p>
      {jeu.note !== null && <p>Note : {jeu.note}/5</p>}
      <div className="carte-actions">
        <button type="button" className="secondaire" onClick={() => onModifier(jeu)}>
          Modifier
        </button>
        <button type="button" className="danger" onClick={() => onSupprimer(jeu.id)}>
          Supprimer
        </button>
      </div>
    </li>
  )
}

export default CarteJeu
