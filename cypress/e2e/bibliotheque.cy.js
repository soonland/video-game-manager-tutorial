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
})
