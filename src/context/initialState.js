import { gameSetup } from '@/functions/gameSetup'
import { BOARDDIMENSIONS } from '@/constants'

const [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ] = gameSetup()

export const initialState = {
  boardDimensions: BOARDDIMENSIONS,
  tileArr: initTileArr,
  cellMap: initialCellMap,
  piecesObject: initialPiecesObject,
  wGraveyard: {},
  bGraveyard: {},
  turn: true,
  selectedPiece: '',
  enPassantPiece: '',
  messageBoard: 'CHESS!',
  pawnPromotionFlag: false,
  pieceNumbering: initialPieceNumbers,
  windowSize: '',
  screenType: ''
}
