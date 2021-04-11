import React from "react";

// cellMap is used to lookup pieces by occupied cell coordinates rather than their name
export const buildNewCellMap = (newPiecesObject) => {
  let newCellMap = {};
  let piecenames = Object.keys(newPiecesObject);
  piecenames.forEach((piece, i) => {
    if(!newPiecesObject[piece].dead){
      let coordinates = `${newPiecesObject[piece].x},${newPiecesObject[piece].y}`;
      newCellMap[coordinates] = piece;
    }
  }) ;
  return newCellMap;
}