import { useState } from 'react'
import BarreFiltres from './components/BarreFiltres.jsx'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import { JEUX_INITIAUX } from './donnees.js'
import { ajouterJeu, filtrerJeux, modifierJeu, rechercherJeux, supprimerJeu } from './jeux.js'

function App() {
  const [jeux, setJeux] = useState(JEUX_INITIAUX)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [filtres, setFiltres] = useState({ plateforme: '', statut: '' })

  // La liste affichée est calculée à partir de la liste complète : on ne la stocke pas.
  const jeuxAffiches = filtrerJeux(rechercherJeux(jeux, recherche), filtres)

  function ajouter(donnees) {
    setJeux(ajouterJeu(jeux, donnees))
  }

  function enregistrerModification(donnees) {
    setJeux(modifierJeu(jeux, jeuEnEdition.id, donnees))
    setJeuEnEdition(null)
  }

  function supprimer(id) {
    setJeux(supprimerJeu(jeux, id))
    if (jeuEnEdition?.id === id) setJeuEnEdition(null)
  }

  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
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
      <p className="compteur">
        {jeuxAffiches.length} / {jeux.length} jeux
      </p>
      <ListeJeux jeux={jeuxAffiches} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
    </main>
  )
}

export default App
