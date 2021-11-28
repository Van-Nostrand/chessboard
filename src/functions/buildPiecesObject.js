
export const buildPiecesObject = (pieceArray) => {
  const piecesObject = {}
  pieceArray.forEach( piece => {
    piecesObject[piece.name] = piece
  })
  return piecesObject
}
