import React from 'react'
import { Piece } from '@/components'

export const makePieces = (piecesObject, clickHandler, tileSize, selectedPiece) => {

  return Object.keys(piecesObject).map( name => {
    return (
      <Piece
        pieceData={piecesObject[name]}
        key={name}
        size={tileSize}
        border={selectedPiece === name}
        onClick={clickHandler} />
    )
  })
}
