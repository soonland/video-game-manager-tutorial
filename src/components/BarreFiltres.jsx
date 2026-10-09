import { PLATEFORMES, STATUTS } from '../jeux.js'

function BarreFiltres({ recherche, onRecherche, filtres, onFiltres }) {
  return (
    <div className="barre-filtres">
      <input
        type="search"
        placeholder="Rechercher un titre…"
        aria-label="Rechercher un jeu"
        value={recherche}
        onChange={(evenement) => onRecherche(evenement.target.value)}
      />
      <select
        aria-label="Filtrer par plateforme"
        value={filtres.plateforme}
        onChange={(evenement) => onFiltres({ ...filtres, plateforme: evenement.target.value })}
      >
        <option value="">Toutes les plateformes</option>
        {PLATEFORMES.map((plateforme) => (
          <option key={plateforme}>{plateforme}</option>
        ))}
      </select>
      <select
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
