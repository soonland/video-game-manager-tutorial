import { useEffect, useState } from 'react'
import BarreFiltres from './components/BarreFiltres.jsx'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import { chargerJeux, creerJeu, mettreAJourJeu, retirerJeu } from './api.js'
import { filtrerJeux, rechercherJeux } from './jeux.js'

function App() {
  const [jeux, setJeux] = useState([])
  const [erreur, setErreur] = useState(null)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [filtres, setFiltres] = useState({ plateforme: '', statut: '' })

  // La recherche et les filtres restent côté client : on filtre la liste complète reçue du serveur.
  const jeuxAffiches = filtrerJeux(rechercherJeux(jeux, recherche), filtres)

  async function recharger() {
    try {
      setJeux(await chargerJeux())
      setErreur(null)
    } catch (e) {
      setErreur(e.message)
    }
  }

  useEffect(() => {
    chargerJeux()
      .then(setJeux)
      .catch((e) => setErreur(e.message))
  }, [])

  // Exécute une action sur le serveur, puis recharge la liste.
  async function executer(action) {
    try {
      await action()
      await recharger()
    } catch (e) {
      setErreur(e.message)
    }
  }

  function ajouter(donnees) {
    return executer(() => creerJeu(donnees))
  }

  function enregistrerModification(donnees) {
    const id = jeuEnEdition.id
    setJeuEnEdition(null)
    return executer(() => mettreAJourJeu(id, donnees))
  }

  function supprimer(id) {
    if (jeuEnEdition?.id === id) setJeuEnEdition(null)
    return executer(() => retirerJeu(id))
  }

  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
      {erreur && (
        <p className="erreur" role="alert" data-cy="erreur">
          Une erreur est survenue : {erreur}
        </p>
      )}
      {jeuEnEdition ? (
        <FormulaireJeu
          key={jeuEnEdition.id}
          jeuInitial={jeuEnEdition}
          onSoumettre={enregistrerModification}
          onAnnuler={() => setJeuEnEdition(null)}
        />
      ) : (
        <FormulaireJeu key="nouveau" onSoumettre={ajouter} />
      )}
      <BarreFiltres
        recherche={recherche}
        onRecherche={setRecherche}
        filtres={filtres}
        onFiltres={setFiltres}
      />
      <p className="compteur" data-cy="compteur">
        {jeuxAffiches.length} / {jeux.length} jeux
      </p>
      <ListeJeux jeux={jeuxAffiches} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
    </main>
  )
}

export default App
