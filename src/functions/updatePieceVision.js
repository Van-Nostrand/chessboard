// import React from 'react'

import KingClass from '../pieceData/KingClass'
import QueenClass from '../pieceData/QueenClass'
import RookClass from '../pieceData/RookClass'
import PawnClass from '../pieceData/PawnClass'
import BishopClass from '../pieceData/BishopClass'
import KnightClass from '../pieceData/KnightClass'

//this calls a function on each piece that updates their own view property
export const updatePieceVision = (newPiecesObject, newCellMap, newEnPassantPiece = '') => {

  const pieceNames = Object.keys(newPiecesObject)

  for (let i = 0; i < pieceNames.length; i++) {
    if (!newPiecesObject[pieceNames[i]].dead) {
      switch (true) {
      case /^(w|b)Q/.test(pieceNames[i]): newPiecesObject[pieceNames[i]].view = QueenClass.vision(newCellMap, newPiecesObject, pieceNames[i])
        break
      case /^(w|b)K/.test(pieceNames[i]): newPiecesObject[pieceNames[i]].view = KingClass.vision(newCellMap, newPiecesObject, pieceNames[i])
        break
      case /^(w|b)B/.test(pieceNames[i]): newPiecesObject[pieceNames[i]].view = BishopClass.vision(newCellMap, newPiecesObject, pieceNames[i])
        break
      case /^(w|b)N/.test(pieceNames[i]): newPiecesObject[pieceNames[i]].view = KnightClass.vision(newCellMap, newPiecesObject, pieceNames[i])
        break
      case /^(w|b)R/.test(pieceNames[i]): newPiecesObject[pieceNames[i]].view = RookClass.vision(newCellMap, newPiecesObject, pieceNames[i])
        break
      case /^(w|b)P/.test(pieceNames[i]): newPiecesObject[pieceNames[i]].view = PawnClass.vision(newCellMap, newPiecesObject, pieceNames[i], newEnPassantPiece)
        break
      default: console.log('something went wrong in updatepiecevision')
      }
    }
  }
  return newPiecesObject
}
