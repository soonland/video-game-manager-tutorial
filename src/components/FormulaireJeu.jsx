import { useState } from 'react'
import { PLATEFORMES, STATUTS } from '../jeux.js'

const VIDE = { titre: '', plateforme: PLATEFORMES[0], statut: STATUTS[0], note: '' }

function FormulaireJeu({ jeuInitial, onSoumettre, onAnnuler }) {
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
    if (titre === '') return

    onSoumettre({
      titre,
      plateforme: valeurs.plateforme,
      statut: valeurs.statut,
      note: valeurs.note === '' ? null : Number(valeurs.note),
    })
    if (!jeuInitial) setValeurs(VIDE)
  }

  return (
    <form className="formulaire" onSubmit={soumettre}>
      <h2>{jeuInitial ? 'Modifier le jeu' : 'Ajouter un jeu'}</h2>
      <label>
        Titre
        <input name="titre" value={valeurs.titre} onChange={changer} required />
      </label>
      <label>
        Plateforme
        <select name="plateforme" value={valeurs.plateforme} onChange={changer}>
          {PLATEFORMES.map((plateforme) => (
            <option key={plateforme}>{plateforme}</option>
          ))}
        </select>
      </label>
      <label>
        Statut
        <select name="statut" value={valeurs.statut} onChange={changer}>
          {STATUTS.map((statut) => (
            <option key={statut}>{statut}</option>
          ))}
        </select>
      </label>
      <label>
        Note (0 à 5)
        <select name="note" value={valeurs.note} onChange={changer}>
          <option value="">Aucune</option>
          {[0, 1, 2, 3, 4, 5].map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </label>
      <div className="actions">
        <button type="submit">{jeuInitial ? 'Enregistrer' : 'Ajouter'}</button>
        {onAnnuler && (
          <button type="button" className="secondaire" onClick={onAnnuler}>
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default FormulaireJeu
