export default function chessReducer (state, action) {
  switch (action.type) {
  case 'illegal':
    return {
      ...state,
      selectedPiece: '',
      messageBoard: action.message
    }
  case 'selected':
    return {
      ...state,
      selectedPiece: action.name,
      messageBoard: `piece ${action.name} is selected`
    }
  case 'deselected':
    return {
      ...state,
      selectedPiece: '',
      messageBoard: 'no piece selected'
    }
  case 'promoted':
    return {
      ...state,
      piecesObject: action.piecesObject,
      cellMap: action.cellMap,
      messageBoard: action.messageBoard,
      pieceNumbering: action.pieceNumbering,
      selectedPiece: '',
      pawnPromotionFlag: false,
      turn: !state.turn
    }
  case 'promoting':
    return {
      ...state,
      piecesObject: action.piecesObject,
      cellMap: action.cellMap,
      pawnPromotionFlag: true,
      messageBoard: `${state.selectedPiece} is being promoted`
    }
  case 'maintenance':
    return {
      ...state,
      piecesObject: action.piecesObject,
      cellMap: action.cellMap,
      messageBoard: action.messageBoard,
      enPassantPiece: action.enPassantPiece,
      wGraveyard: action.wGraveyard,
      bGraveyard: action.bGraveyard,
      selectedPiece: '',
      turn: !state.turn
    }
  case 'windowWidthChange':
    return {
      ...state,
      windowSize: action.windowSize
    }
  case 'screenBreakpoint':
    return {
      ...state,
      screenType: action.screenType,
      windowSize: action.windowSize
    }
  default:
    throw new Error('3RR0RZ')
  }
}
