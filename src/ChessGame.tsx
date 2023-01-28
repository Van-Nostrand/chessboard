import React, { useEffect, useContext } from 'react'

import { ChessGraveyard, PromotionMenu, Piece } from '@/components'
import { ChessGameContext } from '@/context'
import { makeTiles, sortAndFillGraveyards } from '@/functions'
import { useWindowToGetTileSize, useGameFunctions, useDevLogger } from '@/hooks'


export default function ChessGame () {

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

  const logger = useDevLogger()

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

    logger('clicked a tile @', coordinates)

    // Accidental, or clicking a tile while no piece selected
    if (selectedPiece.length === 0) return

    // a piece is already selected, user wants to move here
    if (selectedPiece.length > 0) {
      logger('determining intent of ', piecesObject[selectedPiece])
      const [xCoord, yCoord] = coordinates.split(',').map((num) => parseInt(num))

      // pieces will have coordinates in their view object if they can do anything
      // MOVING
      if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'm') {
        logger('piece is trying to move')
        tryMoving([xCoord, yCoord])
      }
      // CASTLING
      else if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'c') {
        logger('piece is trying to castle')
        processCastling([xCoord, yCoord])
      }
      // ENPASSANT
      else if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'e') {
        logger('piece is trying to kill en passant')
        tryEnPassant([xCoord, yCoord])
      }
      // ILLEGAL MOVE
      else {
        logger('the move was illegal')
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
    logger('clicked a piece named', name)

    // if no piece is selected - player is trying to select a piece
    if (selectedPiece.length === 0) {
      // check turn, then confirm selection and update piece.view
      if ((turn && (/^w/.test(name))) || (!turn && (/^b/.test(name)))) {
        logger('valid selection, player can move piece')
        selectPiece(name)
      }
      // failed selection
      else {
        illegalMove('Illegal selection, try again')
      }
    }
    // else, if a piece is already selected and...
    else if (selectedPiece.length > 0) {
      // ...its the selected piece - player is deselecting
      if (selectedPiece === name) {
        clearPieceSelection()
      }
      // ...its a different piece...
      else {
        // ...on the same team - player is switching selected piece
        if (name.charAt(0) === selectedPiece.charAt(0)) {
          selectPiece(name)
        }
        // ...on the opposite team - player is attacking
        else {
          const targetCell = [ piecesObject[name].x, piecesObject[name].y ]

          // if the selected piece can see this cell, and the cell is verified for attacks...
          if (
            piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] &&
            piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] === 'a'
          ) {
            tryAttacking(targetCell, name)
          }
          // failed
          else {
            illegalMove('Illegal attack')
          }
        }
      }
    }
    // unhandled scenarios
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
          style={{
            width: `${boardSize}px`,
            height: `${boardSize}px`,
            ...(mobileWindow ? {} : { left: `${graveyardDimensions[0] * tileSize}px` })
          }}
        >
          {Object.keys(piecesObject).map((name, i) =>
            <Piece
              key={`piece${i}`}
              pieceData={piecesObject[name]}
              size={tileSize}
              border={selectedPiece === name}
              onClick={handlePieceClick}
            />
          )}
        </div>

        <ChessGraveyard
          pieces={bGraveyardPieces}
          classString={`b-graveyard${testmode ? '--hidden' : ''}`}
        />
      </div>
      <h2 className={`turn-header${testmode ? '--hidden' : ''}`}>
        {turn ? 'White turn' : 'Black turn'}
      </h2>
      <footer>
        <a className="iconlink" href="mailto:dmdoull43@gmail.com" target="_blank" rel="noreferrer">
          <img src={require('@/assets/email.png')} alt="email" />
        </a>
        <a className="iconlink" href="https://github.com/Van-Nostrand" target="_blank" rel="noreferrer">
          <img src={require('@/assets/github.svg')} alt="https://github.com/Van-Nostrand" />
        </a>
        <a className="iconlink" href="https://www.linkedin.com/in/mike-doull-34b9211a6/" target="_blank" rel="noreferrer">
          <img src={require('@/assets/linkedin2.svg')} alt="https://www.linkedin.com/in/mike-doull-34b9211a6/" />
        </a>
      </footer>
      {/* <TestingBoard /> */}
    </div>
  )
}
