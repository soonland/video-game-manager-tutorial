import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router'
import BarreFiltres from './components/BarreFiltres.jsx'
import FormulaireJeu from './components/FormulaireJeu.jsx'
import ListeJeux from './components/ListeJeux.jsx'
import PageConsoles from './components/PageConsoles.jsx'
import {
  chargerConsoles,
  chargerJeux,
  creerConsole,
  creerJeu,
  mettreAJourConsole,
  mettreAJourJeu,
  retirerConsole,
  retirerJeu,
} from './api.js'
import { filtrerJeux, rechercherJeux } from './jeux.js'

// Le lien actif est stylé grâce à l'attribut aria-current que react-router ajoute lui-même.
const LIEN =
  '-mb-px border-b-2 border-transparent px-1 pb-2 text-slate-400 hover:text-slate-100 aria-[current=page]:border-violet-500 aria-[current=page]:font-semibold aria-[current=page]:text-slate-100'

function chargerTout() {
  return Promise.all([chargerJeux(), chargerConsoles()])
}

function App() {
  const [jeux, setJeux] = useState([])
  const [consoles, setConsoles] = useState([])
  const [erreur, setErreur] = useState(null)
  const [jeuEnEdition, setJeuEnEdition] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [filtres, setFiltres] = useState({ consoleId: '', statut: '' })

  // La recherche et les filtres restent côté client : on filtre la liste complète reçue du serveur.
  const jeuxAffiches = filtrerJeux(rechercherJeux(jeux, recherche), filtres)

  function appliquer([listeJeux, listeConsoles]) {
    setJeux(listeJeux)
    setConsoles(listeConsoles)
    setErreur(null)
  }

  async function recharger() {
    try {
      appliquer(await chargerTout())
    } catch (e) {
      setErreur(e.message)
    }
  }

  useEffect(() => {
    chargerTout()
      .then(appliquer)
      .catch((e) => setErreur(e.message))
  }, [])

  // Exécute une action sur le serveur, puis recharge les jeux et les consoles.
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

  function ajouterConsole(nom) {
    return executer(() => creerConsole(nom))
  }

  function renommerConsole(id, nom) {
    return executer(() => mettreAJourConsole(id, nom))
  }

  function supprimerConsole(id) {
    return executer(() => retirerConsole(id))
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Ma bibliothèque de jeux vidéo</h1>
      <nav className="mb-6 flex gap-4 border-b border-slate-800">
        <NavLink to="/" className={LIEN} data-cy="lien-jeux" onClick={() => setErreur(null)}>
          Jeux
        </NavLink>
        <NavLink
          to="/consoles"
          className={LIEN}
          data-cy="lien-consoles"
          onClick={() => setErreur(null)}
        >
          Consoles
        </NavLink>
      </nav>
      {erreur && (
        <p
          className="mb-4 rounded-md border border-rose-500 bg-rose-500/10 px-3 py-2 text-rose-300"
          role="alert"
          data-cy="erreur"
        >
          Une erreur est survenue : {erreur}
        </p>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              {jeuEnEdition ? (
                <FormulaireJeu
                  key={jeuEnEdition.id}
                  jeuInitial={jeuEnEdition}
                  consoles={consoles}
                  onSoumettre={enregistrerModification}
                  onAnnuler={() => setJeuEnEdition(null)}
                />
              ) : (
                <FormulaireJeu key="nouveau" consoles={consoles} onSoumettre={ajouter} />
              )}
              <BarreFiltres
                recherche={recherche}
                onRecherche={setRecherche}
                filtres={filtres}
                onFiltres={setFiltres}
                consoles={consoles}
              />
              <p className="my-3 text-sm text-slate-400" data-cy="compteur">
                {jeuxAffiches.length} / {jeux.length} jeux
              </p>
              <ListeJeux jeux={jeuxAffiches} onModifier={setJeuEnEdition} onSupprimer={supprimer} />
            </>
          }
        />
        <Route
          path="/consoles"
          element={
            <PageConsoles
              consoles={consoles}
              onAjouter={ajouterConsole}
              onRenommer={renommerConsole}
              onSupprimer={supprimerConsole}
            />
          }
        />
      </Routes>
    </main>
  )
}

export default App
