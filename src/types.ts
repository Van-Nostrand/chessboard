import {
  King,
  Bishop,
  Knight,
  Queen,
  Rook,
  Pawn
} from '@/pieceData'

export interface IPiece {
  x: number
  y: number
  imgSrc: string
  paths: any[]
  name: string
  view: any
  attackView: any
  dead: boolean
  moveLogic?: (x: number, y: number) => boolean
}

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
  [property: string]: King | Bishop | Knight | Queen | Rook | Pawn
}
