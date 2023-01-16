import {
  King,
  Bishop,
  Knight,
  Queen,
  Rook,
  Pawn
} from '@/pieceData'

export interface ICellMap {
  [coordinates: string]: string
}

export interface IPieceView {
  [coordinates: string]: string
}

export interface IPieceProps {
  x: number
  y: number
  name: string
}

export interface IPiecesObject {
  [name: string]: King | Bishop | Knight | Queen | Rook | Pawn
}

export interface IDefaultContext {
  bGraveyard: any
  boardDimensions: number[]
  cellMap: any
  enPassantPiece: string
  graveyard: any
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
