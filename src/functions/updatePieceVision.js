// import React from 'react'

import {
  King,
  Queen,
  Rook,
  Pawn,
  Bishop,
  Knight
} from '@/pieceData'

//this calls a function on each piece that updates their own view property
export const updatePieceVision = (newPiecesObject, newCellMap, newEnPassantPiece = '') => {

  const pieceNames = Object.keys(newPiecesObject)

  for (let i = 0; i < pieceNames.length; i++) {
    if (!newPiecesObject[pieceNames[i]].dead) {
      switch (true) {
        case /^(w|b)Q/.test(pieceNames[i]):
          newPiecesObject[pieceNames[i]].view = Queen.vision(newCellMap, newPiecesObject, pieceNames[i])
          break
        case /^(w|b)K/.test(pieceNames[i]):
          newPiecesObject[pieceNames[i]].view = King.vision(newCellMap, newPiecesObject, pieceNames[i])
          break
        case /^(w|b)B/.test(pieceNames[i]):
          newPiecesObject[pieceNames[i]].view = Bishop.vision(newCellMap, newPiecesObject, pieceNames[i])
          break
        case /^(w|b)N/.test(pieceNames[i]):
          newPiecesObject[pieceNames[i]].view = Knight.vision(newCellMap, newPiecesObject, pieceNames[i])
          break
        case /^(w|b)R/.test(pieceNames[i]):
          newPiecesObject[pieceNames[i]].view = Rook.vision(newCellMap, newPiecesObject, pieceNames[i])
          break
        case /^(w|b)P/.test(pieceNames[i]):
          newPiecesObject[pieceNames[i]].view = Pawn.vision(newCellMap, newPiecesObject, pieceNames[i], newEnPassantPiece)
          break
        default: console.log('something went wrong in updatepiecevision')
      }
    }
  }
  return newPiecesObject
}
