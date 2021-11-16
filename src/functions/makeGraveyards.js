import React from 'react'
import { Piece } from '@/components'

export const makeGraveyards = (wGraveyard, bGraveyard, tileSize) => {
  const wGraveyardPieces = []
  const bGraveyardPieces = []
  for (const name in wGraveyard) {
    wGraveyardPieces.push(
      <Piece
        pieceData={wGraveyard[name]}
        key={name}
        name={name}
        size={tileSize}
      />
    )
  }

  for (const name in bGraveyard) {
    bGraveyardPieces.push(
      <Piece
        pieceData={bGraveyard[name]}
        key={name}
        name={name}
        size={tileSize}
      />
    )
  }

  return [ wGraveyardPieces, bGraveyardPieces ]
}
