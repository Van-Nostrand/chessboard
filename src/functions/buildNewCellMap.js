// import React from 'react'

// cellMap is used to lookup pieces by occupied cell coordinates rather than their name
export const buildNewCellMap = (newPiecesObject) => {
  const newCellMap = {}
  const piecenames = Object.keys(newPiecesObject)
  piecenames.forEach( piece => {
    if (!newPiecesObject[piece].dead) {
      const coordinates = `${newPiecesObject[piece].x},${newPiecesObject[piece].y}`
      newCellMap[coordinates] = piece
    }
  })
  return newCellMap
}
