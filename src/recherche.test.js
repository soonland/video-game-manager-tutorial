import { describe, it, expect } from 'vitest'
import { filtrerJeux, rechercherJeux } from './jeux.js'

const jeux = [
  { id: 1, titre: 'Pokémon Épée', console_id: 4, statut: 'terminé', note: 3 },
  { id: 2, titre: 'Hades', console_id: 1, statut: 'en cours', note: null },
  { id: 3, titre: 'Hollow Knight', console_id: 1, statut: 'terminé', note: 5 },
]

const ids = (liste) => liste.map((jeu) => jeu.id)

describe('rechercherJeux', () => {
  it('renvoie tous les jeux quand le texte est vide', () => {
    expect(rechercherJeux(jeux, '')).toEqual(jeux)
  })

  it('ignore les majuscules et les minuscules', () => {
    expect(ids(rechercherJeux(jeux, 'HADES'))).toEqual([2])
  })

  it('ignore les accents du titre', () => {
    expect(ids(rechercherJeux(jeux, 'pokemon epee'))).toEqual([1])
  })

  it('ignore les accents du texte recherché', () => {
    const sansAccent = [{ ...jeux[0], titre: 'Pokemon Sword' }]

    expect(rechercherJeux(sansAccent, 'POKÉMON')).toHaveLength(1)
  })

  it('ignore les espaces autour du texte', () => {
    expect(ids(rechercherJeux(jeux, '  hollow  '))).toEqual([3])
  })

  it('renvoie une liste vide quand rien ne correspond', () => {
    expect(rechercherJeux(jeux, 'zzz')).toEqual([])
  })
})

describe('filtrerJeux', () => {
  it('renvoie tous les jeux sans filtre', () => {
    expect(filtrerJeux(jeux)).toEqual(jeux)
  })

  it('renvoie tous les jeux quand les filtres sont vides', () => {
    expect(filtrerJeux(jeux, { consoleId: '', statut: '' })).toEqual(jeux)
  })

  it('filtre par console', () => {
    expect(ids(filtrerJeux(jeux, { consoleId: 1 }))).toEqual([2, 3])
  })

  it('filtre par statut', () => {
    expect(ids(filtrerJeux(jeux, { statut: 'terminé' }))).toEqual([1, 3])
  })

  it('combine console et statut', () => {
    expect(ids(filtrerJeux(jeux, { consoleId: 1, statut: 'terminé' }))).toEqual([3])
  })

  it('renvoie une liste vide quand aucune combinaison ne correspond', () => {
    expect(filtrerJeux(jeux, { consoleId: 4, statut: 'en cours' })).toEqual([])
  })
})
