import { IPiecesObject, ICellMap } from '@/types'
//  this calls a function on each piece that updates their own view property
//  kings and pawns need different arguments for their vision functions
//    so there is some logic to handle that
export const updatePieceVision = (newPiecesObject: IPiecesObject, newCellMap: ICellMap, newEnPassantPiece = '') => {

  for (const piece in newPiecesObject) {
    newPiecesObject[piece].vision(
      newCellMap,
      (/^\wP/.test(piece)
        ? newEnPassantPiece
        : /^\wK/.test(piece)
          ? newPiecesObject
          : null
      ),
      (/^\wP/.test(piece)
        ? newPiecesObject
        : null
      )
    )
  }

  return newPiecesObject
}
