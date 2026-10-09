import { useState } from 'react'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import { JEUX_INITIAUX } from './donnees.js'
import { ajouterJeu, modifierJeu, supprimerJeu } from './jeux.js'

function App() {
  const [jeux, setJeux] = useState(JEUX_INITIAUX)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)

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
      <ListeJeux jeux={jeux} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
    </main>
  )
}

export default App
