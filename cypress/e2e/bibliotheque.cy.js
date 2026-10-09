const ZELDA = { titre: 'Zelda', plateforme: 'Switch', statut: 'terminé', note: 5 }
const HADES = { titre: 'Hades', plateforme: 'PC', statut: 'en cours', note: null }
const POKEMON = { titre: 'Pokémon Épée', plateforme: 'Switch', statut: 'terminé', note: 3 }

// Crée les jeux directement via l'API (plus rapide que de passer par le formulaire), puis ouvre la page.
function visiterAvec(jeux) {
  jeux.forEach((jeu) => cy.request('POST', '/api/jeux', jeu))
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
    cy.visit('/')

    cy.get('[data-cy="champ-titre"]').type("Assassin's Creed")
    cy.get('[data-cy="champ-plateforme"]').select('PC')
    cy.get('[data-cy="champ-statut"]').select('en cours')
    cy.get('[data-cy="champ-note"]').select('4')
    cy.get('[data-cy="bouton-soumettre"]').click()

    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', "Assassin's Creed")
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

  it('filtre par plateforme et par statut', () => {
    visiterAvec([ZELDA, HADES, POKEMON])

    cy.get('[data-cy="filtre-plateforme"]').select('Switch')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 2)
    cy.get('[data-cy="compteur"]').should('have.text', '2 / 3 jeux')

    cy.get('[data-cy="filtre-statut"]').select('en cours')
    cy.get('[data-cy="carte-jeu"]').should('not.exist')
    cy.get('[data-cy="aucun-jeu"]').should('be.visible')

    cy.get('[data-cy="filtre-plateforme"]').select('Toutes les plateformes')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1).and('contain', 'Hades')
  })

  it('refuse un titre vide ou fait d’espaces', () => {
    cy.visit('/')

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
