
export const buildPiecesObject = (pieceArray: any[]) => pieceArray.reduce(
  (acc, cur) => {
    acc[cur.name] = cur
    return acc
  }, {}
)
