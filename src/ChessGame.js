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
  const handleTileClick = (e, coordinates) => {

    console.log('clicked a tile @', coordinates)

    // Accidental, or clicking a tile while no piece selected
    if (selectedPiece.length === 0) return

    // a piece is already selected, user wants to move here
    if (selectedPiece.length > 0) {
      console.log('determining intent of ', piecesObject[selectedPiece])
      const xCoord = parseInt(coordinates.split(',')[0])
      const yCoord = parseInt(coordinates.split(',')[1])
      // pieces will have coordinates in their view object if they can do anything
      //MOVING
      if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'm') {
        console.log('piece is trying to move')
        tryMoving([xCoord, yCoord])
      }
      //CASTLING
      else if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'c') {
        console.log('piece is trying to castle')
        processCastling([xCoord, yCoord])
      }
      //ENPASSANT
      else if (piecesObject[selectedPiece]?.view?.[coordinates] && piecesObject[selectedPiece].view[coordinates] === 'e') {
        console.log('piece is trying to kill en passant')
        tryEnPassant([xCoord, yCoord])
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
  // - to attack with a selected piece
  const handlePieceClick = (e, name) => {
    console.log('clicked a piece named', name)
    //if selecting a piece
    if (selectedPiece.length === 0) {

      console.log('determining intent of this piece..')

      //check turn, then confirm selection and update piece.view
      if ((turn && (/^w/.test(name))) || (!turn && (/^b/.test(name)))) {
        console.log('piece can move')
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
      console.log('something is wrong in handlePieceClick')
    }
  }


  //tests and completes attacks
  const tryAttacking = (targetCell, targetPieceName) => {

    const newWGraveyard = recursiveStateCopy(wGraveyard)
    const newBGraveyard = recursiveStateCopy(bGraveyard)

    //make a copy of state and carry out the attack
    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = targetCell[0]
    newPiecesObject[selectedPiece].y = targetCell[1]
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
      const newMessageBoard = `${selectedPiece} attacked ${targetPieceName}`

      turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard, newWGraveyard, newBGraveyard })
    } else {
      console.log('that attack puts your king in check...')
      illegalMoveButKeepSelection('that attack puts your king in check')
      // dispatch({ type: 'illegal-keep-selection', message: 'that attack puts your king in check' })
    }
  }


  // tests and completes moves
  const tryMoving = (cell) => {
    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = cell[0]
    newPiecesObject[selectedPiece].y = cell[1]

    //test whether move puts own king in check
    const newCellMap = buildNewCellMap(newPiecesObject)
    const isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap )

    if (!isKingInCheck) {

      //test for pawn promotion
      if ((/^wP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 0 ) || (/^bP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 7)) {
        pawnBeingPromoted(newPiecesObject, newCellMap)
      } else {
        // if (newPiecesObject[selectedPiece].firstMove) newPiecesObject[selectedPiece].firstMove = false
        const newMessageBoard = `${selectedPiece} moved to ${cell[0]},${cell[1]}`
        turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard })
      }
    } else {
      illegalMoveButKeepSelection('that move puts your king in check')
      // dispatch({ type: 'illegal-keep-selection', message: 'that move puts your king in check' })
    }
  }


  // swaps a pawn with a piece of the users choice
  const promotePawn = ( newPieceType ) => {
    const newPieceNumbering = recursiveStateCopy(pieceNumbering)

    const newPieceTeam = selectedPiece.charAt(0)
    const newPiecesObject = recursiveStateCopy(piecesObject)

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

    updatePieceVision(newPiecesObject, newCellMap)

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
  //KingClass.vision has it's own "amIChecked" method, so this is "process" instead of "try"
  const processCastling = (cell) => {
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

    turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard })
  }


  const tryEnPassant = (cell) => {
    const newWGraveyard = recursiveStateCopy(wGraveyard)
    const newBGraveyard = recursiveStateCopy(bGraveyard)

    const newMessageBoard = `${selectedPiece} just attacked ${enPassantPiece} en passent`
    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = cell[0]
    newPiecesObject[selectedPiece].y = cell[1]

    if (enPassantPiece.charAt(0) === 'w') {
      newWGraveyard[enPassantPiece] = { ...newPiecesObject[enPassantPiece] }
      newWGraveyard[enPassantPiece].dead = true
    }
    else if (enPassantPiece.charAt(0) === 'b') {
      newBGraveyard[enPassantPiece] = { ...newPiecesObject[enPassantPiece] }
      newBGraveyard[enPassantPiece].dead = true
    }
    delete newPiecesObject[enPassantPiece]

    const newCellMap = buildNewCellMap(newPiecesObject)

    // is king in check?
    const isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap )
    if (!isKingInCheck) {
      turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard, newWGraveyard, newBGraveyard })
    } else {
      illegalMoveButKeepSelection('en passent would put your king in check right now')
    }
  }


  // todo - does this need to exist here and in a king class?
  const isMyKingInCheck = ( newPiecesObject, newCellMap ) => {

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
    let inCheck = false

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
          inCheck = true
          return
        }
        //if the tested cell is occupied, but not by an enemy queen or bishop, this path is done but continue checking other paths
        else if (newCellMap[`${i},${j}`]) {
          pathDone = true
        }
      }
    })

    //if it's proven that the king is being attacked, then no need to continue checking
    if (!inCheck) {
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
            inCheck = true
            return
          } else if (newCellMap[`${i},${j}`]) {
            pathDone = true
          }
        }
      })
    }

    //test for enemy pawn attacks
    if (!inCheck) {
      pawnPaths.forEach(path => {
        const cellTest = `${kingX - path[0]},${kingY - path[1]}`

        if (newCellMap[cellTest] && pawnReg.test(newCellMap[cellTest])) {
          inCheck = true
          return
        }
      })
    }

    //test for knight attacks
    if (!inCheck) {
      knightPaths.forEach(path => {
        const cellTest = `${kingX + path[0]},${kingY + path[1]}`

        if (newCellMap[cellTest] && knightReg.test(newCellMap[cellTest])) {
          inCheck = true
          return
        }
      })
    }
    return inCheck
  }

  // triggered after most turns
  // selectedpiece gets a namechange here to avoid redeclaring and confusion of variables. again, strike against this function
  // todo - change argument to single object
  const turnMaintenance = (args) => {
    const {
      newPiecesObject,
      newCellMap,
      newMessageBoard,
      newWGraveyard = args.newWGraveyard || chessGameState.wGraveyard,
      newBGraveyard = args.newBGraveyard || chessGameState.bGraveyard
    } = args

    let newEnPassantPiece = ''

    //if the piece has a firstMove prop, flip it
    if (newPiecesObject[selectedPiece].firstMove) {
      newPiecesObject[selectedPiece].firstMove = false

      //if it's a pawn and it just had a double move, flag for enpassant attacks
      if (/^\wP/.test(selectedPiece) && (newPiecesObject[selectedPiece].y === 4 || newPiecesObject[selectedPiece].y === 3)) {
        newEnPassantPiece = selectedPiece
      }
    }

    //update piece views
    //not sure I'm handling this properly
    updatePieceVision(newPiecesObject, newCellMap, newEnPassantPiece)
    // newPiecesObject = updatePieceVision(newPiecesObject, newCellMap, newEnPassantPiece)

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

  const illegalMoveButKeepSelection = (message) => {
    dispatch({
      type: 'illegal-keep-selection',
      messageBoard: message
    })
  }

  // =======================
  // RENDERING
  // =======================

  // GENERATE TILES
  const boardTiles = makeTiles(tileSize, [8, 8], handleTileClick)

  // GENERATE PIECES
  const pieceObjects = makePieces(piecesObject, handlePieceClick, tileSize, selectedPiece)

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
