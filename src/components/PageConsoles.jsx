import { useState } from 'react'

function PageConsoles({ consoles, onAjouter, onRenommer, onSupprimer }) {
  const [nouveauNom, setNouveauNom] = useState('')
  const [edition, setEdition] = useState(null)

  function ajouter(evenement) {
    evenement.preventDefault()
    const nom = nouveauNom.trim()
    if (nom === '') return

    onAjouter(nom)
    setNouveauNom('')
  }

  function renommer(evenement) {
    evenement.preventDefault()
    const nom = edition.nom.trim()
    if (nom === '') return

    onRenommer(edition.id, nom)
    setEdition(null)
  }

  return (
    <section className="consoles" data-cy="consoles">
      <h2>Consoles</h2>
      <form className="formulaire-console" onSubmit={ajouter}>
        <input
          data-cy="nouvelle-console-nom"
          aria-label="Nom de la nouvelle console"
          placeholder="Nouvelle console"
          value={nouveauNom}
          onChange={(evenement) => setNouveauNom(evenement.target.value)}
        />
        <button type="submit" data-cy="ajouter-console">
          Ajouter
        </button>
      </form>
      <ul className="liste-consoles">
        {consoles.map((uneConsole) => (
          <li key={uneConsole.id} data-cy="console">
            {edition?.id === uneConsole.id ? (
              <form className="formulaire-console" onSubmit={renommer}>
                <input
                  data-cy="champ-renommer"
                  aria-label={`Nouveau nom de ${uneConsole.nom}`}
                  value={edition.nom}
                  onChange={(evenement) => setEdition({ ...edition, nom: evenement.target.value })}
                />
                <button type="submit" data-cy="valider-renommer">
                  Enregistrer
                </button>
                <button type="button" className="secondaire" onClick={() => setEdition(null)}>
                  Annuler
                </button>
              </form>
            ) : (
              <>
                <span>
                  {uneConsole.nom} · {uneConsole.nb_jeux} {uneConsole.nb_jeux > 1 ? 'jeux' : 'jeu'}
                </span>
                <span className="carte-actions">
                  <button
                    type="button"
                    className="secondaire"
                    data-cy="renommer-console"
                    onClick={() => setEdition({ id: uneConsole.id, nom: uneConsole.nom })}
                  >
                    Renommer
                  </button>
                  <button
                    type="button"
                    className="danger"
                    data-cy="supprimer-console"
                    onClick={() => onSupprimer(uneConsole.id)}
                  >
                    Supprimer
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PageConsoles
