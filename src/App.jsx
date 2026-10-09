import ListeJeux from './components/ListeJeux.jsx'
import { JEUX_INITIAUX } from './donnees.js'

function App() {
  return (
    <main>
      <h1>Ma bibliothèque de jeux vidéo</h1>
      <ListeJeux jeux={JEUX_INITIAUX} />
    </main>
  )
}

export default App
