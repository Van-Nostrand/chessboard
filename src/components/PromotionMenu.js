import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import {
  getNewPiece,
  buildPiecesObject,
  makePieces,
  makeTiles
} from '@/functions'
import { ChessGameContext } from '@/context'
/**
 *
 * @param {*} param0
 * @returns jsx
 */
export default function PromotionMenu ({ selectPiece, team }) {
  const [pieceSelection, setPieceSelection] = useState('')

  const { chessGameState } = useContext(ChessGameContext)

  useEffect(() => {
    if (pieceSelection.length > 0) {
      selectPiece(pieceSelection)
    }
  }, [pieceSelection])

  const queen = getNewPiece({ name: `${team}Q`, x: 0, y: 0 })
  const knight = getNewPiece({ name: `${team}N`, x: 1, y: 0 })
  const bishop = getNewPiece({ name: `${team}B`, x: 2, y: 0 })
  const rook = getNewPiece({ name: `${team}R`, x: 3, y: 0 })

  const tempPiecesObject = buildPiecesObject([queen, knight, bishop, rook])
  const pieces = makePieces(tempPiecesObject, (e, name) => setPieceSelection(name.charAt(1)), chessGameState.tileSize, '')
  const boardTiles = makeTiles(chessGameState.tileSize, [4, 1], () => {})

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

PromotionMenu.propTypes = {
  selectPiece: PropTypes.func,
  team: PropTypes.string
}
