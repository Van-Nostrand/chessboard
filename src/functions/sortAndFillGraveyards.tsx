import React from 'react'
import { Piece } from '@/components'
import { IPiece } from '@/types'

export const sortAndFillGraveyards = (graveyard: { [n: string]: IPiece }, tileSize: number): Array<Array<JSX.Element>> => {
  const graveyards: { [k:string]: JSX.Element[] } = { w: [], b: [] }

  for (const piece in graveyard) {
    graveyards[piece.charAt(0)].push(
      <Piece
        pieceData={graveyard[piece]}
        border={false}
        key={piece}
        size={tileSize}
      />
    )
  }

  return [graveyards.w, graveyards.b]
}
