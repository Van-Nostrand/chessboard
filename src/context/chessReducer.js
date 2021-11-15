export default function chessReducer (state, action) {
  switch (action.type) {
    case 'illegal':
      return {
        ...state,
        selectedPiece: '',
        messageBoard: action.message
      }
    case 'illegal-keep-selection':
      return {
        ...state,
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
    case 'testModeOn':
      return {
        ...state,
        testmode: true
      }
    case 'testModeOff':
      return {
        ...state,
        testmode: false,
        testboard: {}
      }
    case 'init-testboard':
      return {
        ...state,
        testboard: { ...action.payload }
      }
    case 'update-tileSize':
      return {
        ...state,
        tileSize: action.tileSize
      }
    default:
      throw new Error('3RR0RZ')
  }
}
