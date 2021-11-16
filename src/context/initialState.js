import { gameSetup } from '@/functions/gameSetup'
import { BOARDDIMENSIONS } from '@/constants'

const [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ] = gameSetup()

export const initialState = {
  boardDimensions: BOARDDIMENSIONS,
  bGraveyard: {},
  cellMap: initialCellMap,
  enPassantPiece: '',
  tileArr: initTileArr,
  messageBoard: 'CHESS!',
  pawnPromotionFlag: false,
  piecesObject: initialPiecesObject,
  pieceNumbering: initialPieceNumbers,
  screenType: '',
  selectedPiece: '',
  testmode: false,
  testboard: {},
  tileSize: null,
  turn: true,
  windowSize: '',
  wGraveyard: {}
}
