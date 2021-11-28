import { gameSetup } from '@/functions/gameSetup'
import { BOARDDIMENSIONS } from '@/constants'

const [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ] = gameSetup()

export const initialState = {
  bGraveyard: {},
  boardDimensions: BOARDDIMENSIONS,
  cellMap: initialCellMap,
  enPassantPiece: '',
  messageBoard: 'CHESS!',
  pawnPromotionFlag: false,
  piecesObject: initialPiecesObject,
  pieceNumbering: initialPieceNumbers,
  screenType: '',
  selectedPiece: '',
  testmode: false,
  testboard: {},
  tileArr: initTileArr,
  tileSize: null,
  turn: true,
  windowSize: '',
  wGraveyard: {}
}
