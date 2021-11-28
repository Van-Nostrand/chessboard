import React, { useState, useEffect/*, useContext*/ } from 'react'
import pieceImg from '../assets/pieces.png'
import PropTypes from 'prop-types'
// import { createPiece } from '@/functions'
// import { ChessGameContext } from '@/context'
/**
 * todo - This is broken, fix it
 * @param {*} param0
 * @returns
 */
export default function PromotionMenu ({ selectPiece, team }) {
  const [pieceSelection, setPieceSelection] = useState('')

  // const { chessGameState, dispatch } = useContext(ChessGameContext)
  // const { }

  useEffect(() => {
    if (pieceSelection.length > 0) {
      selectPiece(pieceSelection)
    }
  }, [pieceSelection])

  // const queen = createPiece(`${team}Q`)
  // const knight = createPiece(`${team}N`)
  // const bishop = createPiece(`${team}B`)
  // const rook = createPiece(`${team}R`)

  const queenStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: '400px',
    backgroundPosition: team === 'w' ? '-70px -3px' : '-70px 63px',
    backgroundOrigin: 'border-box',
  }
  const knightStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: '400px',
    backgroundPosition: team === 'w' ? '197px -3px' : '197px 63px',
    backgroundOrigin: 'border-box',
  }
  const bishopStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: '400px',
    backgroundPosition: team === 'w' ? '-136px -3px' : '-136px 63px',
    backgroundOrigin: 'border-box',
  }
  const rookStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: '400px',
    backgroundPosition: team === 'w' ? '130px -3px' : '130px 63px',
    backgroundOrigin: 'border-box',
  }

  return (
    <div className="promotion-menu">
      <p>Choose a piece</p>
      <div style={queenStyle} className="promotion-choice" onClick={() => setPieceSelection('Q')}></div>
      <div style={knightStyle} className="promotion-choice" onClick={() => setPieceSelection('N')}></div>
      <div style={bishopStyle} className="promotion-choice" onClick={() => setPieceSelection('B')}></div>
      <div style={rookStyle} className="promotion-choice" onClick={() => setPieceSelection('R')}></div>
    </div>
  )
}

PromotionMenu.propTypes = {
  selectPiece: PropTypes.func,
  team: PropTypes.string
}
