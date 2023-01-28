import React, { useEffect, useRef, useContext } from 'react'

import { ChessGraveyard, PromotionMenu, TestingBoard } from '@/components'
import { ChessGameContext } from '@/context'
import {
  makeTiles,
  makePieces,
  sortAndFillGraveyards
} from '@/functions'
import { useWindowToGetTileSize, useGameFunctions } from '@/hooks'


export default function ChessGame () {
  const piecesContainerRef = useRef(null)

  const GameContext = useContext(ChessGameContext)
  const {
    illegalMove,
    clearPieceSelection,
    selectPiece,
    updateTilesize,
    state: {
      boardDimensions,
      graveyard,
      graveyardDimensions,
      messageBoard,
      pawnPromotionFlag,
      piecesObject,
      selectedPiece,
      testmode,
      tileSize,
      turn
    }
  } = GameContext

  const [newTileSize, mobileWindow] = useWindowToGetTileSize()
  const { tryAttacking, tryMoving, tryEnPassant, processCastling } = useGameFunctions()

  useEffect(() => {
    updateTilesize(newTileSize)
  }, [newTileSize])

  /**
   * Decide why a user clicked a tile and then call the appropriate function
   * reasons a user would click a tile:
   * - accidentally
   * - to move a selected piece
   * - - normal move
   * - - Castling
   * - - En Passant
   * - illegal move attempt
   */
  const handleTileClick = (_e: any, coordinates: string) => {

    console.log('clicked a tile @', coordinates)

    // Accidental, or clicking a tile while no piece selected
    if (selectedPiece.length === 0) return

    // a piece is already selected, user wants to move here
    if (selectedPiece.length > 0) {
      console.log('determining intent of ', piecesObject[selectedPiece])
      const xCoord = parseInt(coordinates.split(',')[0])
      const yCoord = parseInt(coordinates.split(',')[1])
      // pieces will have coordinates in their view object if they can do anything
      // MOVING
      if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'm') {
        console.log('piece is trying to move')
        tryMoving([xCoord, yCoord])
      }
      // CASTLING
      else if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'c') {
        console.log('piece is trying to castle')
        processCastling([xCoord, yCoord])
      }
      // ENPASSANT
      else if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'e') {
        console.log('piece is trying to kill en passant')
        tryEnPassant([xCoord, yCoord])
      }
      // ILLEGAL MOVE
      else {
        console.log('the move was illegal')
        illegalMove('Illegal Move')
      }
    }
  }

  /**
   * Determine why the user clicked a piece and then call the appropriate function
   * reasons to click a piece:
   * - accidental
   * - to select
   * - to deselect
   * - to attack with a selected piece
   */
  const handlePieceClick = (_e: any, name: string) => {
    console.log('clicked a piece named', name)
    // if selecting a piece
    if (selectedPiece.length === 0) {

      console.log('determining intent of this piece..')

      // check turn, then confirm selection and update piece.view
      if ((turn && (/^w/.test(name))) || (!turn && (/^b/.test(name)))) {
        console.log('piece can move')
        selectPiece(name)
      }
      // failed selection
      else {
        illegalMove('Illegal selection, try again')
      }
    }
    // if deselecting a piece
    else if (selectedPiece === name) {
      clearPieceSelection()
    }
    // if attacking a piece
    else if (selectedPiece.length > 0 && name.charAt(0) !== selectedPiece.charAt(0)) {
      const targetCell = [ piecesObject[name].x, piecesObject[name].y ]

      // if the selected piece can see this cell, and the cell is verified for attacks...
      if (piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] && piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] === 'a') {
        tryAttacking(targetCell, name)
      }
      // failed
      else {
        illegalMove('Illegal attack')
      }
    }
    // error
    else {
      console.error('something is wrong in handlePieceClick')
    }
  }

  const [wGraveyardPieces, bGraveyardPieces] = sortAndFillGraveyards(graveyard, tileSize)
  const boardContainerStyle = {
    [mobileWindow ? 'height' : 'width']: `${(tileSize * boardDimensions[0]) + ((graveyardDimensions[0] * tileSize) * 2)}px`,
    [mobileWindow ? 'width' : 'height']: `${Math.max(tileSize * boardDimensions[1], graveyardDimensions[1] * tileSize)}px`
  }

  const boardSize = tileSize * 8

  // console.log('PAWN PROMOTION FLAG??', pawnPromotionFlag)

  return (
    <div className='game-container'>

      { pawnPromotionFlag && <PromotionMenu />}
      <h3 className='message-board'>
        {messageBoard}
      </h3>

      <div
        className={`board-container${testmode ? '--hidden' : ''}`}
        style={boardContainerStyle}
      >
        <ChessGraveyard
          pieces={wGraveyardPieces}
          classString={`w-graveyard${testmode ? '--hidden' : ''}`}
        />

        <div
          className='board-container__tiles'
          style={{
            flexBasis: `${boardSize}px`,
            [mobileWindow ? 'width' : 'height']: `${boardSize}px`
          }}
        >
          { makeTiles(tileSize, [boardDimensions[0], boardDimensions[1]], handleTileClick) }
        </div>

        <div
          className='board-container__pieces'
          ref={piecesContainerRef}
          style={{
            width: `${boardSize}px`,
            height: `${boardSize}px`,
            ...(mobileWindow ? {} : { left: `${graveyardDimensions[0] * tileSize}px` })
          }}
        >
          { makePieces(piecesObject, handlePieceClick, tileSize, selectedPiece) }
        </div>

        <ChessGraveyard
          pieces={bGraveyardPieces}
          classString={`b-graveyard${testmode ? '--hidden' : ''}`}
        />
      </div>
      <h2 className={`turn-header${testmode ? '--hidden' : ''}`}>
        {turn ? 'White turn' : 'Black turn'}
      </h2>
      <TestingBoard />
    </div>
  )
}
