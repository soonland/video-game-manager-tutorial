import { useState } from 'react'
import { CARTE, CHAMP } from '../classes.js'
import Bouton from './Bouton.jsx'

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
    <section className={CARTE} data-cy="consoles">
      <h2 className="mb-3 text-lg font-semibold">Consoles</h2>
      <form className="flex gap-2" onSubmit={ajouter}>
        <input
          className={`${CHAMP} flex-1`}
          data-cy="nouvelle-console-nom"
          aria-label="Nom de la nouvelle console"
          placeholder="Nouvelle console"
          value={nouveauNom}
          onChange={(evenement) => setNouveauNom(evenement.target.value)}
        />
        <Bouton type="submit" data-cy="ajouter-console">
          Ajouter
        </Bouton>
      </form>
      <ul className="mt-4 grid gap-2">
        {consoles.map((uneConsole) => (
          <li key={uneConsole.id} className="flex items-center justify-between gap-2" data-cy="console">
            {edition?.id === uneConsole.id ? (
              <form className="flex flex-1 gap-2" onSubmit={renommer}>
                <input
                  className={`${CHAMP} flex-1`}
                  data-cy="champ-renommer"
                  aria-label={`Nouveau nom de ${uneConsole.nom}`}
                  value={edition.nom}
                  onChange={(evenement) => setEdition({ ...edition, nom: evenement.target.value })}
                />
                <Bouton type="submit" data-cy="valider-renommer">
                  Enregistrer
                </Bouton>
                <Bouton variante="secondaire" onClick={() => setEdition(null)}>
                  Annuler
                </Bouton>
              </form>
            ) : (
              <>
                <span>
                  {uneConsole.nom} · {uneConsole.nb_jeux} {uneConsole.nb_jeux > 1 ? 'jeux' : 'jeu'}
                </span>
                <span className="flex gap-2">
                  <Bouton
                    variante="secondaire"
                    data-cy="renommer-console"
                    onClick={() => setEdition({ id: uneConsole.id, nom: uneConsole.nom })}
                  >
                    Renommer
                  </Bouton>
                  <Bouton
                    variante="danger"
                    data-cy="supprimer-console"
                    onClick={() => onSupprimer(uneConsole.id)}
                  >
                    Supprimer
                  </Bouton>
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
