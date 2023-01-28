import {
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook
} from '@/pieceData'
import { IPieceProps } from '@/types'

export const getNewPiece = (props: IPieceProps) => {
  // console.log('inside getNewPiece, props', props)
  switch (true) {
    case /^\wB/.test(props.name): return new Bishop(props)
    case /^\wK/.test(props.name): return new King(props)
    case /^\wN/.test(props.name): return new Knight(props)
    case /^\wP/.test(props.name): return new Pawn(props)
    case /^\wQ/.test(props.name): return new Queen(props)
    case /^\wR/.test(props.name): return new Rook(props)
    default: throw new Error('getNewPiece: I do not know what piece this is')
  }
}
