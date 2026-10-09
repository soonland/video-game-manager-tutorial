describe('Consoles', () => {
  beforeEach(() => {
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('navigue entre les deux pages, y compris par une adresse directe', () => {
    cy.visit('/')
    cy.get('[data-cy="consoles"]').should('not.exist')
    cy.get('[data-cy="lien-jeux"]').should('have.class', 'active')

    cy.get('[data-cy="lien-consoles"]').click()
    cy.location('pathname').should('eq', '/consoles')
    cy.get('[data-cy="consoles"]').should('be.visible')
    cy.get('[data-cy="champ-titre"]').should('not.exist')
    cy.get('[data-cy="lien-consoles"]').should('have.class', 'active')
    cy.get('[data-cy="lien-jeux"]').should('not.have.class', 'active')

    cy.get('[data-cy="lien-jeux"]').click()
    cy.location('pathname').should('eq', '/')
    cy.get('[data-cy="champ-titre"]').should('exist')

    cy.visit('/consoles')
    cy.get('[data-cy="consoles"]').should('be.visible')
  })

  it('désactive le formulaire des jeux tant qu’aucune console n’existe', () => {
    cy.visit('/')

    cy.get('[data-cy="aucune-console"]').should('be.visible')
    cy.get('[data-cy="champ-titre"]').should('be.disabled')
  })

  it('ajoute une console puis la propose dans le formulaire des jeux', () => {
    cy.visit('/consoles')

    cy.get('[data-cy="nouvelle-console-nom"]').type('Steam Deck')
    cy.get('[data-cy="ajouter-console"]').click()

    cy.get('[data-cy="console"]').should('have.length', 1).and('contain', 'Steam Deck')
    cy.get('[data-cy="console"]').should('contain', '0 jeu')

    cy.get('[data-cy="lien-jeux"]').click()
    cy.get('[data-cy="aucune-console"]').should('not.exist')
    cy.get('[data-cy="champ-console"]').select('Steam Deck')
  })

  it('renomme une console et met à jour les cartes de ses jeux', () => {
    cy.request('POST', '/api/consoles', { nom: 'Switch' }).then((reponse) => {
      cy.request('POST', '/api/jeux', {
        titre: 'Zelda',
        console_id: reponse.body.id,
        statut: 'terminé',
        note: 5,
      })
    })
    cy.visit('/')
    cy.get('[data-cy="carte-jeu"]').should('contain', 'Switch')

    cy.get('[data-cy="lien-consoles"]').click()
    cy.get('[data-cy="renommer-console"]').click()
    cy.get('[data-cy="champ-renommer"]').clear().type('Nintendo Switch')
    cy.get('[data-cy="valider-renommer"]').click()
    cy.get('[data-cy="console"]').should('contain', 'Nintendo Switch').and('contain', '1 jeu')

    cy.get('[data-cy="lien-jeux"]').click()
    cy.get('[data-cy="carte-jeu"]').should('contain', 'Nintendo Switch')
  })

  it('supprime une console vide', () => {
    cy.request('POST', '/api/consoles', { nom: 'Dreamcast' })
    cy.visit('/consoles')
    cy.get('[data-cy="console"]').should('have.length', 1)

    cy.get('[data-cy="supprimer-console"]').click()

    cy.get('[data-cy="console"]').should('not.exist')
    cy.get('[data-cy="erreur"]').should('not.exist')
  })

  it('refuse de supprimer une console qui contient encore des jeux', () => {
    cy.request('POST', '/api/consoles', { nom: 'Xbox' }).then((reponse) => {
      cy.request('POST', '/api/jeux', {
        titre: 'Halo',
        console_id: reponse.body.id,
        statut: 'à jouer',
        note: null,
      })
    })
    cy.visit('/consoles')

    cy.get('[data-cy="supprimer-console"]').click()

    cy.get('[data-cy="erreur"]').should('contain', 'Cette console contient encore des jeux.')
    cy.get('[data-cy="console"]').should('have.length', 1).and('contain', 'Xbox')

    cy.get('[data-cy="lien-jeux"]').click()
    cy.get('[data-cy="erreur"]').should('not.exist')
    cy.get('[data-cy="carte-jeu"]').should('have.length', 1)
  })

  it('refuse un nom de console déjà utilisé, sans tenir compte de la casse', () => {
    cy.request('POST', '/api/consoles', { nom: 'PC' })
    cy.visit('/consoles')

    cy.get('[data-cy="nouvelle-console-nom"]').type('pc')
    cy.get('[data-cy="ajouter-console"]').click()

    cy.get('[data-cy="erreur"]').should('contain', 'Cette console existe déjà.')
    cy.get('[data-cy="console"]').should('have.length', 1)
  })

  it('oblige à choisir une console pour ajouter un jeu', () => {
    cy.request('POST', '/api/consoles', { nom: 'PC' })
    cy.visit('/')

    cy.get('[data-cy="champ-titre"]').type('Portal 2')
    cy.get('[data-cy="bouton-soumettre"]').click()

    cy.get('[data-cy="carte-jeu"]').should('not.exist')
  })
})
