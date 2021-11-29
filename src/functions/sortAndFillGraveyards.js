import React from 'react'
import { Piece } from '@/components'

export const sortAndFillGraveyards = ( graveyard, tileSize ) => {
  const wGraveyard = []
  const bGraveyard = []
  // console.log('sortandfillgraveyards', graveyard)
  for (const piece in graveyard) {
    const p = (
      <Piece
        pieceData={graveyard[piece]}
        key={piece}
        name={piece}
        size={tileSize}
      />
    )
    if (piece.charAt(0) === 'w') wGraveyard.push(p)
    if (piece.charAt(0) === 'b') bGraveyard.push(p)
  }

  return [ wGraveyard, bGraveyard ]
}
