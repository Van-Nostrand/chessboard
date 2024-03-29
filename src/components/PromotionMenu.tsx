import React, { useState, useEffect, useContext } from 'react'
import { Piece } from '@/components'
import { getNewPiece, buildPiecesObject, makeTiles } from '@/functions'
import { ChessGameContext } from '@/context'


export default function PromotionMenu () {
  const [pieceSelection, setPieceSelection] = useState('')

  const { state: { tileSize, selectedPiece }, promotePawn } = useContext(ChessGameContext)

  useEffect(() => {
    if (pieceSelection.length > 0) {
      promotePawn(pieceSelection)
    }
  }, [pieceSelection])

  const team = selectedPiece.charAt(0)

  const queen = getNewPiece({ name: `${team}Q`, x: 0, y: 0 })
  const knight = getNewPiece({ name: `${team}N`, x: 1, y: 0 })
  const bishop = getNewPiece({ name: `${team}B`, x: 2, y: 0 })
  const rook = getNewPiece({ name: `${team}R`, x: 3, y: 0 })

  const piecesObject = buildPiecesObject([queen, knight, bishop, rook])
  const pieces = Object.keys(piecesObject).map((name, i) =>
    <Piece
      key={`piece${i}`}
      pieceData={piecesObject[name]}
      size={tileSize}
      border={selectedPiece === name}
      onClick={(_e: any, name: string) => setPieceSelection(name.charAt(1))}
    />
  )
  const boardTiles = makeTiles(tileSize, [4, 1], () => {})

  return (
    <div className="promotion-menu">
      <p>Choose a piece</p>
      <div className="board-container">
        <div className="board-container__tiles">
          {boardTiles}
        </div>
        <div className="board-container__pieces">
          {pieces}
        </div>
      </div>
    </div>
  )
}


