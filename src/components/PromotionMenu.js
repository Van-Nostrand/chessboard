import React, { useState, useEffect, useContext } from 'react'
// import pieceImg from '../assets/pieces.png'
import PropTypes from 'prop-types'
import {
  getNewPiece,
  buildPiecesObject,
  makePieces,
  makeTiles
} from '@/functions'
import { ChessGameContext } from '@/context'
/**
 * todo - This is broken, fix it
 * @param {*} param0
 * @returns
 */
export default function PromotionMenu ({ selectPiece, team }) {
  const [pieceSelection, setPieceSelection] = useState('')

  const { chessGameState } = useContext(ChessGameContext)

  useEffect(() => {
    if (pieceSelection.length > 0) {
      selectPiece(pieceSelection)
    }
  }, [pieceSelection])
  console.log('PROMOTION MENU!! selectPiece', selectPiece, 'team', team )

  const queen = getNewPiece({ name: `${team}Q`, x: 0, y: 0 })
  const knight = getNewPiece({ name: `${team}N`, x: 1, y: 0 })
  const bishop = getNewPiece({ name: `${team}B`, x: 2, y: 0 })
  const rook = getNewPiece({ name: `${team}R`, x: 3, y: 0 })

  const tempPiecesObject = buildPiecesObject([queen, knight, bishop, rook])
  const pieces = makePieces(tempPiecesObject, (e, name) => setPieceSelection(name.charAt(1)), chessGameState.tileSize, '')
  const boardTiles = makeTiles(chessGameState.tileSize, [4, 1], () => {})

  // const queenStyle = {
  //   backgroundImage: `url(${pieceImg})`,
  //   backgroundSize: '400px',
  //   backgroundPosition: team === 'w' ? '-70px -3px' : '-70px 63px',
  //   backgroundOrigin: 'border-box',
  // }
  // const knightStyle = {
  //   backgroundImage: `url(${pieceImg})`,
  //   backgroundSize: '400px',
  //   backgroundPosition: team === 'w' ? '197px -3px' : '197px 63px',
  //   backgroundOrigin: 'border-box',
  // }
  // const bishopStyle = {
  //   backgroundImage: `url(${pieceImg})`,
  //   backgroundSize: '400px',
  //   backgroundPosition: team === 'w' ? '-136px -3px' : '-136px 63px',
  //   backgroundOrigin: 'border-box',
  // }
  // const rookStyle = {
  //   backgroundImage: `url(${pieceImg})`,
  //   backgroundSize: '400px',
  //   backgroundPosition: team === 'w' ? '130px -3px' : '130px 63px',
  //   backgroundOrigin: 'border-box',
  // }

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
      {/* <div style={queenStyle} className="promotion-choice" onClick={() => setPieceSelection('Q')}></div>
      <div style={knightStyle} className="promotion-choice" onClick={() => setPieceSelection('N')}></div>
      <div style={bishopStyle} className="promotion-choice" onClick={() => setPieceSelection('B')}></div>
      <div style={rookStyle} className="promotion-choice" onClick={() => setPieceSelection('R')}></div> */}
    </div>
  )
}

PromotionMenu.propTypes = {
  selectPiece: PropTypes.func,
  team: PropTypes.string
}
