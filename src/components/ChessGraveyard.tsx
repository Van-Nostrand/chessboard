import React, { useContext } from 'react'
import { ChessGameContext } from '@/context'

interface IChessGraveyardProps {
  pieces: any
  classString: string
}

export default function ChessGraveyard ({ pieces, classString }: IChessGraveyardProps) {
  const { state: chessGameState } = useContext(ChessGameContext)

  let piecesToRender
  if (pieces && pieces.length > 0) {
    piecesToRender = pieces
  }

  const text = classString.charAt(0) === 'w' ? 'WHITE GRAVEYARD' : 'BLACK GRAVEYARD'

  return (
    <div
      className={`graveyard ${classString}`}
      style={{
        flexBasis: `${chessGameState.tileSize * chessGameState.graveyardDimensions[0]}px`,
        height: `${chessGameState.tileSize * chessGameState.graveyardDimensions[1]}px`
      }}
    >
      <div className="graveyard__text">
        <h3>{text}</h3>
      </div>
      <div className="graveyard__pieces">
        {piecesToRender}
      </div>
    </div>
  )
}
