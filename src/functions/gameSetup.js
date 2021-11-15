// import React from 'react'
import { updatePieceVision } from './updatePieceVision'
import { buildNewCellMap } from './buildNewCellMap'
import {
  BOARDDIMENSIONS,
  PIECE_OBJECTS,
  // PIECEPATHS
} from '@/constants'
import { createPiece } from './createPiece'

//sets up the game. I want to add a check window function and scale game accordingly
export const gameSetup = () => {

  //create checkerboard
  let tileBool = true
  const initTileArr = new Array(BOARDDIMENSIONS[0]).fill().map(() => {
    return new Array(BOARDDIMENSIONS[1]).fill().map((tile, j) => {
      tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool
      // return tileBool? LIGHT_TILE : DARK_TILE;
      return tileBool? 'light-tile tile' : 'dark-tile tile'
    })
  })

  const initialPieceNumbers = {
    'wP': 0,
    'wR': 0,
    'wN': 0,
    'wB': 0,
    'wQ': 0,
    'bP': 0,
    'bR': 0,
    'bN': 0,
    'bB': 0,
    'bQ': 0
  }

  //declare pieces, give them their paths
  //will eventually phase this out
  const initialPiecesObject = {}
  PIECE_OBJECTS.forEach( piece => {
    initialPiecesObject[piece.name] = createPiece(piece)
  })

  //cellMap is used for piece name lookup by cell
  const initialCellMap = buildNewCellMap(initialPiecesObject)
  console.log('before update, pieces is ', initialPiecesObject)
  //build the view properties of each piece
  updatePieceVision(initialPiecesObject, initialCellMap)

  console.log('after update func, pieces is', initialPiecesObject)

  return [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ]
}
