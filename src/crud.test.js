import { describe, it, expect } from 'vitest'
import { ajouterJeu, modifierJeu, supprimerJeu } from './jeux.js'

const zelda = { id: 1, titre: 'Zelda', plateforme: 'Switch', statut: 'terminé', note: 5 }
const hades = { id: 2, titre: 'Hades', plateforme: 'PC', statut: 'en cours', note: null }
const nouveau = { titre: 'Celeste', plateforme: 'PC', statut: 'à jouer', note: null }

describe('ajouterJeu', () => {
  it('ajoute le jeu à la fin de la liste avec un nouvel id', () => {
    const resultat = ajouterJeu([zelda, hades], nouveau)

    expect(resultat).toHaveLength(3)
    expect(resultat[2]).toEqual({ ...nouveau, id: 3 })
  })

  it('donne l’id 1 quand la liste est vide', () => {
    expect(ajouterJeu([], nouveau)).toEqual([{ ...nouveau, id: 1 }])
  })

  it('prend le plus grand id existant + 1, même s’il y a des trous', () => {
    const resultat = ajouterJeu([{ ...zelda, id: 1 }, { ...hades, id: 7 }], nouveau)

    expect(resultat[2].id).toBe(8)
  })

  it('ne modifie pas la liste d’origine', () => {
    const jeux = [zelda, hades]

    ajouterJeu(jeux, nouveau)

    expect(jeux).toEqual([zelda, hades])
  })
})

describe('modifierJeu', () => {
  it('modifie uniquement le jeu ciblé', () => {
    const resultat = modifierJeu([zelda, hades], 2, { statut: 'terminé', note: 4 })

    expect(resultat).toEqual([zelda, { ...hades, statut: 'terminé', note: 4 }])
  })

  it('conserve l’id du jeu même si les modifications en contiennent un autre', () => {
    const resultat = modifierJeu([zelda, hades], 1, { id: 99, titre: 'Zelda BOTW' })

    expect(resultat[0]).toEqual({ ...zelda, titre: 'Zelda BOTW' })
  })

  it('renvoie une liste identique si l’id n’existe pas', () => {
    expect(modifierJeu([zelda, hades], 42, { titre: 'X' })).toEqual([zelda, hades])
  })

  it('ne modifie pas la liste d’origine', () => {
    const jeux = [zelda, hades]

    modifierJeu(jeux, 1, { titre: 'Autre' })

    expect(jeux[0].titre).toBe('Zelda')
  })
})

describe('supprimerJeu', () => {
  it('retire le jeu ciblé', () => {
    expect(supprimerJeu([zelda, hades], 1)).toEqual([hades])
  })

  it('renvoie une liste identique si l’id n’existe pas', () => {
    expect(supprimerJeu([zelda, hades], 42)).toEqual([zelda, hades])
  })

  it('renvoie une liste vide quand on supprime le dernier jeu', () => {
    expect(supprimerJeu([zelda], 1)).toEqual([])
  })

  it('ne modifie pas la liste d’origine', () => {
    const jeux = [zelda, hades]

    supprimerJeu(jeux, 1)

    expect(jeux).toHaveLength(2)
  })
})
