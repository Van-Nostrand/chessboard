import { useContext } from 'react'
import { ChessGameContext } from '@/context'
import { recursiveStateCopy, buildNewCellMap } from '@/functions'
import { IPiecesObject, ICellMap } from '@/types'

/**
 * moved functions here to keep myself sane
 */
export default function useGameFunctions () {
  const {
    pawnBeingPromoted,
    turnMaintenance,
    illegalMoveButKeepSelection,
    state: chessGameState
  } = useContext(ChessGameContext)

  const {
    piecesObject,
    selectedPiece,
    graveyard,
    enPassantPiece,
    cellMap,
    turn
  } = chessGameState

  /**
   * tests and completes moves
   */
  function tryMoving (cell: number[]) {

    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = cell[0]
    newPiecesObject[selectedPiece].y = cell[1]

    // test whether move puts own king in check
    const newCellMap = buildNewCellMap(newPiecesObject)
    const isKingInCheck = isMyKingInCheck(newPiecesObject, newCellMap)

    if (!isKingInCheck) {

      // test for pawn promotion - is a pawn on the furthest possible y coordinate based on their team
      if ((/^wP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 0 ) || (/^bP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 7)) {
        pawnBeingPromoted(newPiecesObject, newCellMap)
      } else {
        // if (newPiecesObject[selectedPiece].firstMove) newPiecesObject[selectedPiece].firstMove = false
        const newMessageBoard = `${selectedPiece} moved to ${cell[0]},${cell[1]}`
        turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard })
      }
    } else {
      // the player is putting their king in check
      illegalMoveButKeepSelection('that move puts your king in check')
    }
  }

  /**
   * tests and completes attacks
   */
  function tryAttacking (targetCell: number[], targetPieceName: string) {

    // I can probably defer this until later when I know the attack works or not
    // and if only one piece on one side is being attacked, then both graveyards don't need deep copies
    const newGraveyard = recursiveStateCopy(graveyard)

    // make a copy of state and carry out the attack
    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = targetCell[0]
    newPiecesObject[selectedPiece].y = targetCell[1]
    const targetPiece = cellMap[`${targetCell[0]},${targetCell[1]}`]

    newGraveyard[targetPiece] = recursiveStateCopy(newPiecesObject[targetPiece])
    newGraveyard[targetPiece].dead = true

    delete newPiecesObject[targetPiece]
    const newCellMap = buildNewCellMap(newPiecesObject)
    const isKingInCheck = isMyKingInCheck(newPiecesObject, newCellMap)

    if (!isKingInCheck) {
      // SUCCESSFUL ATTACK!
      const newMessageBoard = `${selectedPiece} attacked ${targetPieceName}`
      turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard, newGraveyard })
    } else {
      console.log('that attack puts your king in check...')
      illegalMoveButKeepSelection('that attack puts your king in check')
    }
  }

  /**
   * test and complete en passant
   */
  function tryEnPassant (cell: number[]) {

    const newGraveyard = recursiveStateCopy(graveyard)

    const newMessageBoard = `${selectedPiece} just attacked ${enPassantPiece} en passent`
    const newPiecesObject = recursiveStateCopy(piecesObject)

    newPiecesObject[selectedPiece].x = cell[0]
    newPiecesObject[selectedPiece].y = cell[1]

    newGraveyard[enPassantPiece] = recursiveStateCopy(newPiecesObject[enPassantPiece])
    newGraveyard[enPassantPiece].dead = true

    delete newPiecesObject[enPassantPiece]

    const newCellMap = buildNewCellMap(newPiecesObject)

    // is king in check?
    const isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap )
    if (!isKingInCheck) {
      turnMaintenance({ newPiecesObject, newCellMap, newMessageBoard })
    } else {
      illegalMoveButKeepSelection('en passent would put your king in check right now')
    }
  }

  /**
   * castling has already been validated
   * move the necessary pieces
   */
  function processCastling (cell: number[]) {
    let rookName
    const newPiecesObject = recursiveStateCopy(piecesObject)

    // shortside castling
    if (cell[0] === 2) {
      rookName = selectedPiece.charAt(0) + 'R1'
      newPiecesObject[rookName].x = 3
      newPiecesObject[rookName].firstMove = false
      newPiecesObject[selectedPiece].x = 2
      newPiecesObject[selectedPiece].firstMove = false
    }
    // longside castling
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

  /**
   * tests king safety
   * todo - does this need to exist here and in a king class?
   */
  function isMyKingInCheck (newPiecesObject: IPiecesObject, newCellMap: ICellMap) {
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

    // test bishop and diagonal queen attacks
    bishopPaths.forEach( path => {
      const startX = kingX + path[0]
      const startY = kingY + path[1]

      for (
        let i = startX, j = startY, pathDone = false;
        !pathDone &&
        i < BOARDSIZE && j < BOARDSIZE &&
        i >= 0 && j >= 0;
        i += path[0], j += path[1]) {

        // if the tested cell is occupied by either an enemy queen or bishop, stop checking
        if (newCellMap[`${i},${j}`] && (queenReg.test(newCellMap[`${i},${j}`]) || bishReg.test(newCellMap[`${i},${j}`]))) {
          pathDone = true
          inCheck = true
          return
        }
        // if the tested cell is occupied, but not by an enemy queen or bishop, this path is done but continue checking other paths
        else if (newCellMap[`${i},${j}`]) {
          pathDone = true
        }
      }
    })

    // if it's proven that the king is being attacked, then no need to continue checking
    if (!inCheck) {
      // test for axial queen and rook attacks
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

    // test for enemy pawn attacks
    if (!inCheck) {
      pawnPaths.forEach(path => {
        const cellTest = `${kingX - path[0]},${kingY - path[1]}`

        if (newCellMap[cellTest] && pawnReg.test(newCellMap[cellTest])) {
          inCheck = true
          return
        }
      })
    }

    // test for knight attacks
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

  return {
    isMyKingInCheck,
    tryMoving,
    tryAttacking,
    tryEnPassant,
    processCastling
  }
}
