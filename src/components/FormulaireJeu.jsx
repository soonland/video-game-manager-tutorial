import { useState } from 'react'
import { STATUTS } from '../jeux.js'

const VIDE = { titre: '', console_id: '', statut: STATUTS[0], note: '' }

function FormulaireJeu({ jeuInitial, consoles, onSoumettre, onAnnuler }) {
  const [valeurs, setValeurs] = useState(
    jeuInitial ? { ...jeuInitial, note: jeuInitial.note ?? '' } : VIDE,
  )

  function changer(evenement) {
    const { name, value } = evenement.target
    setValeurs({ ...valeurs, [name]: value })
  }

  function soumettre(evenement) {
    evenement.preventDefault()
    const titre = valeurs.titre.trim()
    if (titre === '' || valeurs.console_id === '') return

    onSoumettre({
      titre,
      console_id: Number(valeurs.console_id),
      statut: valeurs.statut,
      note: valeurs.note === '' ? null : Number(valeurs.note),
    })
    if (!jeuInitial) setValeurs(VIDE)
  }

  return (
    <form className="formulaire" data-cy="formulaire" onSubmit={soumettre}>
      <h2>{jeuInitial ? 'Modifier le jeu' : 'Ajouter un jeu'}</h2>
      {consoles.length === 0 && (
        <p data-cy="aucune-console">Ajoute d’abord une console pour pouvoir ajouter un jeu.</p>
      )}
      <fieldset disabled={consoles.length === 0}>
        <label>
          Titre
          <input
            name="titre"
            data-cy="champ-titre"
            value={valeurs.titre}
            onChange={changer}
            required
          />
        </label>
        <label>
          Console
          <select
            name="console_id"
            data-cy="champ-console"
            value={valeurs.console_id}
            onChange={changer}
            required
          >
            <option value="">Choisir une console</option>
            {consoles.map((uneConsole) => (
              <option key={uneConsole.id} value={uneConsole.id}>
                {uneConsole.nom}
              </option>
            ))}
          </select>
        </label>
        <label>
          Statut
          <select name="statut" data-cy="champ-statut" value={valeurs.statut} onChange={changer}>
            {STATUTS.map((statut) => (
              <option key={statut}>{statut}</option>
            ))}
          </select>
        </label>
        <label>
          Note (0 à 5)
          <select name="note" data-cy="champ-note" value={valeurs.note} onChange={changer}>
            <option value="">Aucune</option>
            {[0, 1, 2, 3, 4, 5].map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>
        <div className="actions">
          <button type="submit" data-cy="bouton-soumettre">
            {jeuInitial ? 'Enregistrer' : 'Ajouter'}
          </button>
          {onAnnuler && (
            <button
              type="button"
              className="secondaire"
              data-cy="bouton-annuler"
              onClick={onAnnuler}
            >
              Annuler
            </button>
          )}
        </div>
      </fieldset>
    </form>
  )
}

export default FormulaireJeu
