let consoleId

const valide = () => ({ titre: 'Hades', console_id: consoleId, statut: 'terminé', note: 5 })

function requete(methode, url, corps) {
  return cy.request({ method: methode, url, body: corps, failOnStatusCode: false })
}

describe('API des jeux', () => {
  beforeEach(() => {
    cy.request('POST', '/api/test/reinitialiser')
    cy.request('POST', '/api/consoles', { nom: 'PC' }).then((reponse) => {
      consoleId = reponse.body.id
    })
  })

  it('refuse un titre vide', () => {
    requete('POST', '/api/jeux', { ...valide(), titre: '   ' }).then((reponse) => {
      expect(reponse.status).to.eq(400)
      expect(reponse.body.erreur).to.eq('Le titre est obligatoire.')
    })
  })

  it('refuse un statut invalide', () => {
    requete('POST', '/api/jeux', { ...valide(), statut: 'nimporte' })
      .its('status')
      .should('eq', 400)
  })

  it('refuse une note hors de 0 à 5', () => {
    requete('POST', '/api/jeux', { ...valide(), note: 7 }).its('status').should('eq', 400)
  })

  it('refuse un jeu sans console', () => {
    requete('POST', '/api/jeux', { titre: 'Hades', statut: 'terminé' }).then((reponse) => {
      expect(reponse.status).to.eq(400)
      expect(reponse.body.erreur).to.eq('La console est obligatoire.')
    })
  })

  it('refuse un jeu dont la console n’existe pas', () => {
    requete('POST', '/api/jeux', { ...valide(), console_id: 9999 }).then((reponse) => {
      expect(reponse.status).to.eq(400)
      expect(reponse.body.erreur).to.eq('Console inconnue.')
    })
  })

  it('répond 404 quand on modifie un jeu inexistant', () => {
    requete('PUT', '/api/jeux/9999', valide()).then((reponse) => {
      expect(reponse.status).to.eq(404)
      expect(reponse.body.erreur).to.eq('Jeu introuvable.')
    })
  })

  it('répond 404 quand on supprime un jeu inexistant', () => {
    requete('DELETE', '/api/jeux/9999').its('status').should('eq', 404)
  })

  it('crée un jeu puis le renvoie dans la liste avec le nom de sa console', () => {
    requete('POST', '/api/jeux', valide()).then((reponse) => {
      expect(reponse.status).to.eq(201)
      expect(reponse.body).to.deep.include({ id: 1, titre: 'Hades', console: 'PC' })
    })

    requete('GET', '/api/jeux').then((reponse) => {
      expect(reponse.body).to.have.length(1)
      expect(reponse.body[0]).to.deep.include({ titre: 'Hades', console_id: consoleId, console: 'PC' })
    })
  })
})

describe('API des consoles', () => {
  beforeEach(() => {
    cy.request('POST', '/api/test/reinitialiser')
  })

  it('refuse un nom vide', () => {
    requete('POST', '/api/consoles', { nom: '   ' }).then((reponse) => {
      expect(reponse.status).to.eq(400)
      expect(reponse.body.erreur).to.eq('Le nom est obligatoire.')
    })
  })

  it('refuse un nom déjà utilisé, sans tenir compte de la casse', () => {
    requete('POST', '/api/consoles', { nom: 'PC' }).its('status').should('eq', 201)
    requete('POST', '/api/consoles', { nom: 'pc' }).then((reponse) => {
      expect(reponse.status).to.eq(409)
      expect(reponse.body.erreur).to.eq('Cette console existe déjà.')
    })
  })

  it('répond 404 quand on modifie une console inexistante', () => {
    requete('PUT', '/api/consoles/9999', { nom: 'X' }).then((reponse) => {
      expect(reponse.status).to.eq(404)
      expect(reponse.body.erreur).to.eq('Console introuvable.')
    })
  })

  it('répond 404 quand on supprime une console inexistante', () => {
    requete('DELETE', '/api/consoles/9999').its('status').should('eq', 404)
  })

  it('refuse de supprimer une console qui contient des jeux', () => {
    requete('POST', '/api/consoles', { nom: 'Xbox' }).then((console) => {
      requete('POST', '/api/jeux', {
        titre: 'Halo',
        console_id: console.body.id,
        statut: 'à jouer',
      })
      requete('DELETE', `/api/consoles/${console.body.id}`).then((reponse) => {
        expect(reponse.status).to.eq(409)
        expect(reponse.body.erreur).to.eq('Cette console contient encore des jeux.')
      })
    })
  })

  it('supprime une console vide et compte les jeux des autres', () => {
    requete('POST', '/api/consoles', { nom: 'Dreamcast' }).then((vide) => {
      requete('DELETE', `/api/consoles/${vide.body.id}`).its('status').should('eq', 204)
    })
    requete('POST', '/api/consoles', { nom: 'Xbox' }).then((xbox) => {
      requete('POST', '/api/jeux', { titre: 'Halo', console_id: xbox.body.id, statut: 'à jouer' })
    })

    requete('GET', '/api/consoles').then((reponse) => {
      expect(reponse.body).to.have.length(1)
      expect(reponse.body[0]).to.deep.include({ nom: 'Xbox', nb_jeux: 1 })
    })
  })
})
