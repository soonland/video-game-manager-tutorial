const VALIDE = { titre: 'Hades', plateforme: 'PC', statut: 'terminé', note: 5 }

function requete(methode, url, corps) {
  return cy.request({ method: methode, url, body: corps, failOnStatusCode: false })
}

describe('API des jeux', () => {
  beforeEach(() => {
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('refuse un titre vide', () => {
    requete('POST', '/api/jeux', { ...VALIDE, titre: '   ' }).then((reponse) => {
      expect(reponse.status).to.eq(400)
      expect(reponse.body.erreur).to.eq('Le titre est obligatoire.')
    })
  })

  it('refuse un statut invalide', () => {
    requete('POST', '/api/jeux', { ...VALIDE, statut: 'nimporte' }).its('status').should('eq', 400)
  })

  it('refuse une note hors de 0 à 5', () => {
    requete('POST', '/api/jeux', { ...VALIDE, note: 7 }).its('status').should('eq', 400)
  })

  it('répond 404 quand on modifie un jeu inexistant', () => {
    requete('PUT', '/api/jeux/9999', VALIDE).then((reponse) => {
      expect(reponse.status).to.eq(404)
      expect(reponse.body.erreur).to.eq('Jeu introuvable.')
    })
  })

  it('répond 404 quand on supprime un jeu inexistant', () => {
    requete('DELETE', '/api/jeux/9999').its('status').should('eq', 404)
  })

  it('crée un jeu puis le renvoie dans la liste', () => {
    requete('POST', '/api/jeux', VALIDE).then((reponse) => {
      expect(reponse.status).to.eq(201)
      expect(reponse.body).to.deep.include({ id: 1, titre: 'Hades' })
    })

    requete('GET', '/api/jeux').then((reponse) => {
      expect(reponse.body).to.have.length(1)
      expect(reponse.body[0].titre).to.eq('Hades')
    })
  })
})
