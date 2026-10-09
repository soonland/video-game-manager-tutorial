import { CARTE } from '../classes.js'
import Bouton from './Bouton.jsx'

function CarteJeu({ jeu, onModifier, onSupprimer }) {
  return (
    <li className={CARTE} data-cy="carte-jeu">
      <h2 className="text-lg font-semibold">{jeu.titre}</h2>
      <p className="text-slate-400">
        {jeu.console} · {jeu.statut}
      </p>
      {jeu.note !== null && <p className="text-slate-400">Note : {jeu.note}/5</p>}
      <div className="mt-3 flex gap-2">
        <Bouton variante="secondaire" data-cy="modifier" onClick={() => onModifier(jeu)}>
          Modifier
        </Bouton>
        <Bouton variante="danger" data-cy="supprimer" onClick={() => onSupprimer(jeu.id)}>
          Supprimer
        </Bouton>
      </div>
    </li>
  )
}

export default CarteJeu
