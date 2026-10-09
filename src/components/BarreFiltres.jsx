import { STATUTS } from '../jeux.js'

function BarreFiltres({ recherche, onRecherche, filtres, onFiltres, consoles }) {
  return (
    <div className="barre-filtres">
      <input
        type="search"
        data-cy="recherche"
        placeholder="Rechercher un titre…"
        aria-label="Rechercher un jeu"
        value={recherche}
        onChange={(evenement) => onRecherche(evenement.target.value)}
      />
      <select
        data-cy="filtre-console"
        aria-label="Filtrer par console"
        value={filtres.consoleId}
        onChange={(evenement) =>
          onFiltres({
            ...filtres,
            consoleId: evenement.target.value === '' ? '' : Number(evenement.target.value),
          })
        }
      >
        <option value="">Toutes les consoles</option>
        {consoles.map((uneConsole) => (
          <option key={uneConsole.id} value={uneConsole.id}>
            {uneConsole.nom}
          </option>
        ))}
      </select>
      <select
        data-cy="filtre-statut"
        aria-label="Filtrer par statut"
        value={filtres.statut}
        onChange={(evenement) => onFiltres({ ...filtres, statut: evenement.target.value })}
      >
        <option value="">Tous les statuts</option>
        {STATUTS.map((statut) => (
          <option key={statut}>{statut}</option>
        ))}
      </select>
    </div>
  )
}

export default BarreFiltres
