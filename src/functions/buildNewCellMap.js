// import React from 'react'

// cellMap is used to lookup pieces by occupied cell coordinates rather than their name
export const buildNewCellMap = (newPiecesObject) => {
  const newCellMap = {}
  const piecenames = Object.keys(newPiecesObject)
  piecenames.forEach( piece => {
    if (!newPiecesObject[piece].dead) {
      const coordinates = `${newPiecesObject[piece].x},${newPiecesObject[piece].y}`
      newCellMap[coordinates] = piece
    } else if (newPiecesObject[piece].dead) {
      console.log('buildNewCellMap: found a dead piece, should never have happened', piece)
    }
  })
  return newCellMap
}
