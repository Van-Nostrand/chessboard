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
