//this calls a function on each piece that updates their own view property
export const updatePieceVision = (newPiecesObject, newCellMap, newEnPassantPiece = '') => {

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
