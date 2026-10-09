import { useState } from 'react'
import { CARTE, CHAMP } from '../classes.js'
import { STATUTS } from '../jeux.js'
import Bouton from './Bouton.jsx'

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
    <form className={`${CARTE} mb-6 grid gap-3`} data-cy="formulaire" onSubmit={soumettre}>
      <h2 className="text-lg font-semibold">{jeuInitial ? 'Modifier le jeu' : 'Ajouter un jeu'}</h2>
      {consoles.length === 0 && (
        <p className="text-amber-300" data-cy="aucune-console">
          Ajoute d’abord une console pour pouvoir ajouter un jeu.
        </p>
      )}
      <fieldset className="grid gap-3" disabled={consoles.length === 0}>
        <label className="grid gap-1 text-sm">
          Titre
          <input
            className={CHAMP}
            name="titre"
            data-cy="champ-titre"
            value={valeurs.titre}
            onChange={changer}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          Console
          <select
            className={CHAMP}
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
        <label className="grid gap-1 text-sm">
          Statut
          <select
            className={CHAMP}
            name="statut"
            data-cy="champ-statut"
            value={valeurs.statut}
            onChange={changer}
          >
            {STATUTS.map((statut) => (
              <option key={statut}>{statut}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Note (0 à 5)
          <select
            className={CHAMP}
            name="note"
            data-cy="champ-note"
            value={valeurs.note}
            onChange={changer}
          >
            <option value="">Aucune</option>
            {[0, 1, 2, 3, 4, 5].map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <Bouton type="submit" data-cy="bouton-soumettre">
            {jeuInitial ? 'Enregistrer' : 'Ajouter'}
          </Bouton>
          {onAnnuler && (
            <Bouton variante="secondaire" data-cy="bouton-annuler" onClick={onAnnuler}>
              Annuler
            </Bouton>
          )}
        </div>
      </fieldset>
    </form>
  )
}

export default FormulaireJeu
