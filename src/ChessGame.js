import React, {
  useEffect,
  useRef,
  useContext
} from 'react'

import {
  ChessGraveyard,
  PromotionMenu,
  TestingBoard
} from '@/components'
import {
  PIECEPATHS,
  PIECE_PROTOTYPES
} from '@/constants'
import { ChessGameContext } from '@/context'
import {
  recursiveStateCopy,
  updatePieceVision,
  buildNewCellMap,
  makeTiles,
  makePieces,
  makeGraveyards
} from '@/functions'
import { useWindowToGetTileSize } from '@/hooks'


export default function ChessGame () {
  const { chessGameState, dispatch } = useContext(ChessGameContext)
  const {
    pieceNumbering,
    enPassantPiece,
    selectedPiece,
    piecesObject,
    turn,
    cellMap,
    wGraveyard,
    bGraveyard,
    testmode,
    tileSize
    // boardDimensions
    // tileArr
  } = chessGameState
  const piecesContainerRef = useRef(null)
  // eslint-disable-next-line no-unused-vars
  const [ newTileSize, newWindowSize ] = useWindowToGetTileSize()

  useEffect(() => {
    dispatch({ type: 'update-tileSize', tileSize: newTileSize })
  }, [newTileSize])

  // this function decides why a user clicked a tile and then calls the appropriate function
  // reasons a user would click a tile:
  // - accidentally
  // - to move a selected piece
  // - - normal move
  // - - Castling
  // - - En Passant
  // - illegal move attempt
  const tileClick = (e, coordinates) => {

    console.log('clicked it')

    // Accidental, or clicking a tile while no piece selected
    if (selectedPiece.length === 0) return

    // a piece is already selected, user wants to move here
    if (selectedPiece.length > 0) {
      console.log('determining intent of ', piecesObject[selectedPiece])
      const xCoord = parseInt(coordinates.split(',')[0])
      const yCoord = parseInt(coordinates.split(',')[1])
      //MOVING
      if (piecesObject[selectedPiece].view[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'm') {
        console.log('piece is trying to move')
        tryMoving([xCoord, yCoord])
      }
      //CASTLING
      else if (piecesObject[selectedPiece].view[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'c') {
        console.log('piece is trying to castle')
        processCastling([xCoord, yCoord])
      }
      //ENPASSANT
      else if (piecesObject[selectedPiece].view[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'e') {
        console.log('piece is trying to kill en passant')
        processEnPassant([xCoord, yCoord])
      }
      //ILLEGAL MOVE
      else {
        console.log('the move was illegal')
        illegalMove('Illegal Move')
      }
    }
  }


  // determines why the user clicked a piece and then calls the appropriate function
  // reasons to click a piece:
  // - accidental
  // - to select
  // - to deselect
  // - to attack
  const pieceClick = (e, name) => {

    //if selecting a piece
    if (selectedPiece.length === 0) {

      //check turn, then confirm selection and update piece.view
      if ((turn && (/^w/.test(name))) || (!turn && (/^b/.test(name)))) {
        dispatch({ type: 'selected', name })
      }
      //failed selection
      else {
        illegalMove('Illegal selection, try again')
      }
    }
    //if deselecting a piece
    else if (selectedPiece === name) {
      dispatch({ type: 'deselected' })
    }
    //if attacking a piece
    else if (selectedPiece.length > 0 && name.charAt(0) !== selectedPiece.charAt(0)) {
      const targetCell = [ piecesObject[name].x, piecesObject[name].y ]

      //if the selected piece can see this cell, and the cell is verified for attacks...
      if (piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] && piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] === 'a') {
        tryAttacking(targetCell, name)
      }
      //failed
      else {
        illegalMove('Illegal attack')
      }
    }
    //error
    else {
      console.log('something is wrong in pieceClick')
    }
  }


  //tests and completes attacks
  const tryAttacking = (targetCell, targetPieceName) => {

    const newWGraveyard = recursiveStateCopy(wGraveyard)
    const newBGraveyard = recursiveStateCopy(bGraveyard)

    //make a copy of state and carry out the attack
    const newPiecesObject = recursiveStateCopy(piecesObject)

    // eslint-disable-next-line
    [ newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y ]  = targetCell
    const targetPiece = cellMap[`${targetCell[0]},${targetCell[1]}`]

    if (targetPiece.charAt(0) === 'w') {
      newWGraveyard[targetPiece] = { ...newPiecesObject[targetPiece] }
      newWGraveyard[targetPiece].dead = true
    }
    else if (targetPiece.charAt(0) === 'b') {
      newBGraveyard[targetPiece] = { ...newPiecesObject[targetPiece] }
      newBGraveyard[targetPiece].dead = true
    }

    delete newPiecesObject[targetPiece]
    const newCellMap = buildNewCellMap(newPiecesObject)
    const isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap )

    if (!isKingInCheck) {
      // SUCCESSFUL ATTACK!
      const message = `${selectedPiece} attacked ${targetPieceName}`

      turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece, newWGraveyard, newBGraveyard)
    }

    else {
      console.log('that attack puts your king in check...')
    }
  }


  // tests and completes moves
  const tryMoving = (cell) => {
    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = cell[0]
    newPiecesObject[selectedPiece].y = cell[1]
    // [ newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y ] = cell

    //test whether move puts own king in check
    const newCellMap = buildNewCellMap(newPiecesObject)
    const isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap )

    if (!isKingInCheck) {

      //test for pawn promotion
      if ((/^wP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 0 ) || (/^bP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 7)) {

        pawnBeingPromoted(newPiecesObject, newCellMap)
        return
      }

      const message = `${selectedPiece} moved to ${cell[0]},${cell[1]}`

      turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece)
    }

    else {
      illegalMove('you\'re endangering your king...')
    }
  }

  // swaps a pawn with a piece of the users choice
  const promotePawn = ( newPieceType ) => {
    const newPieceNumbering = recursiveStateCopy(pieceNumbering)

    const newPieceTeam = selectedPiece.charAt(0)
    let newPiecesObject = recursiveStateCopy(piecesObject)

    newPieceNumbering[`${newPieceTeam}${newPieceType}`] += 1

    // a pieces name is made up of team, type, and number, to differentiate them in state
    const newPiece = createPiece(
      newPieceType,
      newPieceTeam,
      newPiecesObject[selectedPiece].x,
      newPiecesObject[selectedPiece].y,
      newPieceNumbering
    )

    delete newPiecesObject[selectedPiece]
    newPiecesObject[newPiece.name] = newPiece

    const newCellMap = buildNewCellMap(newPiecesObject)
    const newMessageBoard = `${selectedPiece} has been promoted to ${newPiece.name}`

    newPiecesObject = updatePieceVision(newPiecesObject, newCellMap)

    dispatch({
      type: 'promoted',
      piecesObject: newPiecesObject,
      cellMap: newCellMap,
      messageBoard: newMessageBoard,
      pieceNumbering: newPieceNumbering
    })

  }


  // creates a new piece with given arguments
  const createPiece = (type, team, x, y, newPieceNumbering) => {

    const newPiece = { ...PIECE_PROTOTYPES[type] }
    newPiece.pngPos = team === 'w' ? PIECE_PROTOTYPES[type].WpngPos : PIECE_PROTOTYPES[type].BpngPos
    delete newPiece.WpngPos
    delete newPiece.BpngPos

    if (type === 'pawn') {
      newPiece.fifthRank = team === 'w' ? 3 : 4
    }

    const unitNumber = newPieceNumbering[`${team}${type}`] + 1
    newPiece.x = x
    newPiece.y = y
    newPiece.name = `${team}${type}${unitNumber}`
    newPiece.paths = PIECEPATHS[type]

    return newPiece
  }


  // called when a pawn reaches their 8th rank
  // flags the pawn promotion menu to appear
  const pawnBeingPromoted = (newPiecesObject, newCellMap) => {

    dispatch({
      type: 'promoting',
      piecesObject: newPiecesObject,
      cellMap: newCellMap
    })
  }


  //this will be hard coded so that I don't go insane thinking about it. Make it dynamic later
  //KingClass.vision performs it's own "amIChecked" calls... does it make sense for that to happen in KingClass AND in ChessGame?
  const processCastling = (cell) => {
    // const { piecesObject, selectedPiece } = chessGameState
    let rookName
    const newPiecesObject = recursiveStateCopy(piecesObject)

    //shortside castling
    if (cell[0] === 2) {
      rookName = selectedPiece.charAt(0) + 'R1'
      newPiecesObject[rookName].x = 3
      newPiecesObject[rookName].firstMove = false
      newPiecesObject[selectedPiece].x = 2
      newPiecesObject[selectedPiece].firstMove = false
    }
    //longside castling
    else if (cell[0] === 6) {
      rookName = selectedPiece.charAt(0) + 'R2'
      newPiecesObject[rookName].x = 5
      newPiecesObject[rookName].firstMove = false
      newPiecesObject[selectedPiece].x = 6
      newPiecesObject[selectedPiece].firstMove = false
    }
    const newCellMap = buildNewCellMap(newPiecesObject)
    const newMessageBoard = `${selectedPiece} has castled with ${rookName}`

    turnMaintenance(newPiecesObject, newCellMap, newMessageBoard, selectedPiece)
  }


  const processEnPassant = (cell) => {

    // const { wGraveyard, bGraveyard, selectedPiece, enPassantPiece, piecesObject } = chessGameState

    const newWGraveyard = recursiveStateCopy(wGraveyard)
    const newBGraveyard = recursiveStateCopy(bGraveyard)

    const newMessageBoard = `${selectedPiece} just attacked ${enPassantPiece} en passent`
    const newPiecesObject = recursiveStateCopy(piecesObject)

    //eslint-disable-next-line
    [ newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y ] = cell

    if (enPassantPiece.charAt(0) === 'w') {
      newWGraveyard[enPassantPiece] = { ...newPiecesObject[enPassantPiece] }
      newWGraveyard[enPassantPiece].dead = true
    }
    else if (enPassantPiece.charAt(0) === 'b') {
      newBGraveyard[enPassantPiece] = { ...newPiecesObject[enPassantPiece] }
      newBGraveyard[enPassantPiece].dead = true
    }

    const newCellMap = buildNewCellMap(newPiecesObject)

    turnMaintenance(newPiecesObject, newCellMap, newMessageBoard, selectedPiece, newWGraveyard, newBGraveyard)
  }

  // todo - does this need to exist here and in a king class?
  const isMyKingInCheck = ( newPiecesObject, newCellMap ) => {
    // const { turn } = chessGameState

    const kingName = turn ? 'wK' : 'bK'
    const BOARDSIZE = 8
    const enemyChar = kingName.charAt(0) === 'w' ? 'b' : 'w'

    // todo - get from constants
    const bishopPaths = [[1, -1], [1, 1], [-1, 1], [-1, -1]]
    const rookPaths = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    const pawnPaths = [[-1, enemyChar === 'w' ? -1 : 1], [1, enemyChar === 'w' ? -1 : 1]]
    const knightPaths = [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]]

    // todo - move to constants
    const queenReg = new RegExp('^' + enemyChar + 'Q')
    const rookReg = new RegExp('^' + enemyChar + 'R')
    const bishReg = new RegExp('^' + enemyChar + 'B')
    const pawnReg = new RegExp('^' + enemyChar + 'P')
    const knightReg = new RegExp('^' + enemyChar + 'N')

    const kingX = newPiecesObject[kingName].x
    const kingY = newPiecesObject[kingName].y
    let inCheckFlag = false

    //test bishop and diagonal queen attacks
    bishopPaths.forEach( path => {
      const startX = kingX + path[0]
      const startY = kingY + path[1]

      for (
        let i = startX, j = startY, pathDone = false;
        !pathDone &&
        i < BOARDSIZE && j < BOARDSIZE &&
        i >= 0 && j >= 0;
        i += path[0], j += path[1]) {

        //if the tested cell is occupied by either an enemy queen or bishop, stop checking
        if (newCellMap[`${i},${j}`] && (queenReg.test(newCellMap[`${i},${j}`]) || bishReg.test(newCellMap[`${i},${j}`]))) {
          pathDone = true
          inCheckFlag = true
          return
        }
        //if the tested cell is occupied, but not by an enemy queen or bishop, this path is done but continue checking other paths
        else if (newCellMap[`${i},${j}`]) {
          pathDone = true
        }
      }
    })

    //if it's proven that the king is being attacked, then no need to continue checking
    if (!inCheckFlag) {

      //test for linear queen and rook attacks
      rookPaths.forEach(path => {
        const startX = kingX + path[0]
        const startY = kingY + path[1]

        for (
          let i = startX, j = startY, pathDone = false;
          !pathDone &&
          i < BOARDSIZE && j < BOARDSIZE &&
          i >= 0 && j >= 0;
          i += path[0], j += path[1]) {

          //
          if (newCellMap[`${i},${j}`] && (queenReg.test(newCellMap[`${i},${j}`]) || rookReg.test(newCellMap[`${i},${j}`]))) {
            pathDone = true
            inCheckFlag = true
            return
          } else if (newCellMap[`${i},${j}`]) {
            pathDone = true
          }
        }
      })
    }

    //test for enemy pawn attacks
    if (!inCheckFlag) {
      pawnPaths.forEach(path => {
        const cellTest = `${kingX - path[0]},${kingY - path[1]}`

        if (newCellMap[cellTest] && pawnReg.test(newCellMap[cellTest])) {
          inCheckFlag = true
          return
        }
      })
    }

    //test for knight attacks
    if (!inCheckFlag) {
      knightPaths.forEach(path => {
        const cellTest = `${kingX + path[0]},${kingY + path[1]}`

        if (newCellMap[cellTest] && knightReg.test(newCellMap[cellTest])) {
          inCheckFlag = true
          return
        }
      })
    }
    return inCheckFlag
  }

  // triggered after most turns
  // selectedpiece gets a namechange here to avoid redeclaring and confusion of variables. again, strike against this function
  // todo - change argument to single object
  const turnMaintenance = (
    newPiecesObject,
    newCellMap,
    newMessageBoard,
    currentPiece,
    newWGraveyard = chessGameState.wGraveyard,
    newBGraveyard = chessGameState.bGraveyard
  ) => {

    let newEnPassantPiece = ''

    //if the piece has a firstMove prop, flip it
    if (newPiecesObject[currentPiece].firstMove) {
      newPiecesObject[currentPiece].firstMove = false

      //if it's a pawn and it just had a double move, flag for enpassant attacks
      if (/^(w|b)P/.test(currentPiece) && (newPiecesObject[currentPiece].y === 4 || newPiecesObject[currentPiece].y === 3)) {
        newEnPassantPiece = currentPiece
      }
    }

    //update piece views
    //not sure I'm handling this properly
    newPiecesObject = updatePieceVision(newPiecesObject, newCellMap, newEnPassantPiece)

    dispatch({
      type: 'maintenance',
      piecesObject: newPiecesObject,
      cellMap: newCellMap,
      messageBoard: newMessageBoard,
      enPassantPiece: newEnPassantPiece,
      wGraveyard: newWGraveyard,
      bGraveyard: newBGraveyard
    })
  }

  // erases selection, sets messageboard text
  const illegalMove = (newMessageBoard) => {
    dispatch({
      type: 'illegal',
      messageBoard: newMessageBoard
    })
  }

  // =======================
  // RENDERING
  // =======================

  // GENERATE TILES
  const boardTiles = makeTiles(tileSize, [8, 8], tileClick)

  // GENERATE PIECES
  const pieceObjects = makePieces(piecesObject, pieceClick, tileSize, selectedPiece)

  // GENERATE GRAVEYARDS
  const [ wGraveyardPieces, bGraveyardPieces ] = makeGraveyards(wGraveyard, bGraveyard, tileSize)

  // IF PAWN PROMOTING GENERATE MENU
  const theMenu = chessGameState.pawnPromotionFlag
    ? (
      <PromotionMenu
        selectPiece={promotePawn}
        team={chessGameState.selectedPiece.charAt(0)}
      />
    )
    : ''

  //STYLES
  // todo - phase this out?
  const tileContainerStyle = {
    width: `${chessGameState.boardDimensions[0] * tileSize}px`,
    height: `${chessGameState.boardDimensions[1] * tileSize}px`,
  }

  const piecesContainerStyle = {
    width: `${chessGameState.boardDimensions[0] * tileSize}px`,
    height: `${chessGameState.boardDimensions[1] * tileSize}px`,
  }

  return (
    <div className='game-container' >
      {theMenu}
      <h2 className={ testmode ? 'turn-header--hidden' : 'turn-header' }>
        {turn ? 'White turn' : 'Black turn'}
      </h2>
      <div
        className={ testmode ? 'tile-container--hidden' : 'tile-container' }
        style={tileContainerStyle}
      >
        {boardTiles}
      </div>
      <div
        className={ testmode ? 'pieces-container--hidden' : 'pieces-container' }
        ref={piecesContainerRef}
        style={piecesContainerStyle}
      >
        {pieceObjects}
      </div>
      <h3 className='message-board' >{chessGameState.messageBoard}</h3>
      <ChessGraveyard
        pieces={wGraveyardPieces}
        classString={testmode ? 'w-graveyard--hidden' : 'w-graveyard' }
      />
      <ChessGraveyard
        pieces={bGraveyardPieces}
        classString={ testmode ? 'b-graveyard--hidden' : 'b-graveyard' }
      />
      <TestingBoard />
    </div>
  )
}
