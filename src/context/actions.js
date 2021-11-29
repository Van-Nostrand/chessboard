import {
  buildNewCellMap,
  recursiveStateCopy,
  getNewPiece,
  updatePieceVision
} from '@/functions'

export const actions = ( chessGameState, dispatch ) => {
  return ({
    chessGameState,
    dispatch,
    clearPieceSelection: () => {
      dispatch({ type: 'clear-piece-selection' })
    },
    selectPiece: (name) => {
      dispatch({ type: 'select-piece', name })
    },
    // similar to turnMaintenance but different enough to get it's own function
    promotePawn: ( newPieceType ) => {
      const newPieceNumbering = recursiveStateCopy(chessGameState.pieceNumbering)
      const newPiecesObject = recursiveStateCopy(chessGameState.piecesObject)
      const newPieceName = `${chessGameState.selectedPiece.charAt(0)}${newPieceType}${++newPieceNumbering[`${chessGameState.selectedPiece.charAt(0)}${newPieceType}`]}`

      const newPiece = getNewPiece({
        name: newPieceName,
        x: newPiecesObject[chessGameState.selectedPiece].x,
        y: newPiecesObject[chessGameState.selectedPiece].y
      })
      // remove old pawn, add new piece to object
      delete newPiecesObject[chessGameState.selectedPiece]
      newPiecesObject[newPiece.name] = newPiece
      const newCellMap = buildNewCellMap(newPiecesObject)
      const newMessageBoard = `${chessGameState.selectedPiece} has been promoted to ${newPiece.name}`
      updatePieceVision(newPiecesObject, newCellMap)

      dispatch({
        type: 'promoted',
        piecesObject: newPiecesObject,
        cellMap: newCellMap,
        messageBoard: newMessageBoard,
        pieceNumbering: newPieceNumbering
      })
    },
    // called at the end of most turns
    turnMaintenance: (args) => {
      const {
        newPiecesObject,
        newCellMap,
        newMessageBoard,
        newGraveyard = args.newGraveyard || chessGameState.graveyard
      } = args
      let newEnPassantPiece = ''
      //if the piece has a firstMove prop, flip it
      if (newPiecesObject[chessGameState.selectedPiece].firstMove) {
        newPiecesObject[chessGameState.selectedPiece].firstMove = false

        //if it's a pawn and it just had a double move, flag for enpassant attacks
        if ( /^\wP/.test(chessGameState.selectedPiece) && (
          newPiecesObject[chessGameState.selectedPiece].y === 4 ||
          newPiecesObject[chessGameState.selectedPiece].y === 3)
        ) {
          newEnPassantPiece = chessGameState.selectedPiece
        }
      }
      updatePieceVision(newPiecesObject, newCellMap, newEnPassantPiece)
      dispatch({
        type: 'maintenance',
        piecesObject: newPiecesObject,
        cellMap: newCellMap,
        messageBoard: newMessageBoard,
        enPassantPiece: newEnPassantPiece,
        graveyard: newGraveyard
      })
    }

  })
}
