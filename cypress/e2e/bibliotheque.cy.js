const ZELDA = { titre: 'Zelda', console: 'Switch', statut: 'terminé', note: 5 }
const HADES = { titre: 'Hades', console: 'PC', statut: 'en cours', note: null }
const POKEMON = { titre: 'Pokémon Épée', console: 'Switch', statut: 'terminé', note: 3 }

// Crée les consoles Switch et PC, puis les jeux, directement via l'API
// (plus rapide que de passer par les formulaires), puis ouvre la page.
function visiterAvec(jeux) {
  const ids = {}
  ;['Switch', 'PC'].forEach((nom) => {
    cy.request('POST', '/api/consoles', { nom }).then((reponse) => {
      ids[nom] = reponse.body.id
    })
  })
  cy.then(() => {
    jeux.forEach(({ console: nomConsole, ...jeu }) => {
      cy.request('POST', '/api/jeux', { ...jeu, console_id: ids[nomConsole] })
    })
  })
  cy.visit('/')
}

describe('Bibliothèque de jeux vidéo', () => {
  beforeEach(() => {
    // Chaque test repart d'une base de test vide.
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('affiche la page avec une bibliothèque vide', () => {
    cy.visit('/')

    cy.contains('h1', 'Ma bibliothèque de jeux vidéo')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')
    cy.get('[data-cy="compteur"]').should('have.text', '0 / 0 jeux')
  })

  it('ajoute un jeu et le retrouve après rechargement', () => {
    visiterAvec([])

    cy.get('[data-cy="champ-titre"]').type("Assassin's Creed")
    cy.get('[data-cy="champ-console"]').select('PC')
    cy.get('[data-cy="champ-statut"]').select('en cours')
    cy.get('[data-cy="champ-note"]').select('4')
    cy.get('[data-cy="bouton-soumettre"]').click()

    cy.get('[data-cy="carte-jeu"]')
      .should('have.length', 1)
      .and('contain', "Assassin's Creed")
      .and('contain', 'PC')
    cy.get('[data-cy="champ-titre"]').should('have.value', '')

    cy.reload()
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', "Assassin's Creed")
  })

  it('modifie un jeu', () => {
    visiterAvec([ZELDA])

    cy.get('[data-cy="modifier"]').click()
    cy.get('[data-cy="champ-titre"]').should('have.value', 'Zelda')
    cy.get('[data-cy="champ-titre"]').clear().type('Zelda BOTW')
    cy.get('[data-cy="champ-statut"]').select('en cours')
    cy.get('[data-cy="bouton-soumettre"]').click()

    cy.get('[data-cy="carte-jeu"]').should('have.length', 1)
    cy.get('[data-cy="carte-jeu"]').should('contain', 'Zelda BOTW').and('contain', 'en cours')
    cy.get('[data-cy="bouton-soumettre"]').should('contain', 'Ajouter')
  })

  it('supprime un jeu', () => {
    visiterAvec([ZELDA, HADES])

    cy.contains('[data-cy="carte-jeu"]', 'Zelda').find('[data-cy="supprimer"]').click()

    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Hades')
    cy.contains('Zelda').should('not.exist')
  })

  it('recherche un jeu sans tenir compte des accents ni de la casse', () => {
    visiterAvec([ZELDA, HADES, POKEMON])
    cy.get('[data-cy="carte-jeu"]').should('have.length', 3)

    cy.get('[data-cy="recherche"]').type('pokemon')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Pokémon Épée')

    cy.get('[data-cy="recherche"]').clear()
    cy.get('[data-cy="carte-jeu"]').should('have.length', 3)

    cy.get('[data-cy="recherche"]').type('zzz')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')
  })

  it('filtre par console et par statut', () => {
    visiterAvec([ZELDA, HADES, POKEMON])

    cy.get('[data-cy="filtre-console"]').select('Switch')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 2)
    cy.get('[data-cy="compteur"]').should('have.text', '2 / 3 jeux')

    cy.get('[data-cy="filtre-statut"]').select('en cours')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')

    cy.get('[data-cy="filtre-console"]').select('Toutes les consoles')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Hades')
  })

  it('refuse un titre vide ou fait d’espaces', () => {
    visiterAvec([])

    cy.get('[data-cy="champ-console"]').select('PC')
    cy.get('[data-cy="bouton-soumettre"]').click()
    cy.get('[data-cy="carte-jeu"]').should('not.exist')

    cy.get('[data-cy="champ-titre"]').type('   ')
    cy.get('[data-cy="bouton-soumettre"]').click()
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
  })

  it('affiche un message quand le serveur répond par une erreur', () => {
    cy.intercept('GET', '/api/jeux', { statusCode: 500, body: { erreur: 'Boom' } })

    cy.visit('/')

    cy.get('[data-cy="erreur"]').should('contain', 'Boom')
  })
})
