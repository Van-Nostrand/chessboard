import { gameSetup } from '@/functions/gameSetup'
import { BOARDDIMENSIONS } from '@/constants'

const [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ] = gameSetup()

export interface IContext {
  bGraveyard: any
  boardDimensions: number[]
  cellMap: any
  enPassantPiece: string
  graveyard: any
  graveyardDimensions: number[]
  messageBoard: string
  pawnPromotionFlag: boolean
  piecesObject: any
  pieceNumbering: any
  screenType: string
  selectedPiece: string
  testmode: boolean
  testboard: any
  tileArr: any
  tileSize: number
  turn: boolean
  windowSize: string
  wGraveyard: any
}

export const initialState: IContext = {
  bGraveyard: {},
  boardDimensions: BOARDDIMENSIONS,
  cellMap: initialCellMap,
  enPassantPiece: '',
  graveyard: {},
  graveyardDimensions: [3, 8],
  messageBoard: 'CHESS!',
  pawnPromotionFlag: false,
  piecesObject: initialPiecesObject,
  pieceNumbering: initialPieceNumbers,
  screenType: '',
  selectedPiece: '',
  testmode: false,
  testboard: {},
  tileArr: initTileArr,
  tileSize: undefined,
  turn: true,
  windowSize: '',
  wGraveyard: {}
}
