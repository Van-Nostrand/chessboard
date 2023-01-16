// import React from 'react'
import PieceClass from '@/pieceData/PieceClass'
import { ICellMap } from '@/types'

// cellMap is used to lookup pieces by occupied cell coordinates rather than their name
export function buildNewCellMap (newPiecesObject: {
  [k: string]: PieceClass
}): ICellMap {
  const newCellMap: ICellMap = {}
  const piecenames = Object.keys(newPiecesObject)
  piecenames.forEach((piece) => {
    if (!newPiecesObject[piece].dead) {
      const coordinates = `${newPiecesObject[piece].x},${newPiecesObject[piece].y}`
      newCellMap[coordinates] = piece
    } else if (newPiecesObject[piece].dead) {
      // todo - re-evaluate testing if pieces are dead
      console.log('buildNewCellMap: found a dead piece, should never have happened', piece)
    }
  })
  return newCellMap
}
