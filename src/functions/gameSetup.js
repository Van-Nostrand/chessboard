import React from "react";
import { updatePieceVision } from "./updatePieceVision";
import { buildNewCellMap } from "./buildNewCellMap";
import {
  BOARDDIMENSIONS,
  PIECE_OBJECTS,
  PIECEPATHS
} from "../CONSTANTS";

//sets up the game. I want to add a check window function and scale game accordingly
export const gameSetup = () => {

  //create checkerboard
  let tileBool = true;
  let initTileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
    return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
      tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
      // return tileBool? LIGHT_TILE : DARK_TILE;
      return tileBool? "light-tile tile" : "dark-tile tile";
    });
  });

  let initialPieceNumbers = {
    "wP": 0,
    "wR": 0,
    "wN": 0,
    "wB": 0,
    "wQ": 0,
    "bP": 0,
    "bR": 0,
    "bN": 0,
    "bB": 0,
    "bQ": 0
  };

  //declare pieces, give them their paths
  //will eventually phase this out
  let initialPiecesObject = PIECE_OBJECTS;
  Object.keys(initialPiecesObject).forEach((piece, i) => {

    switch(true){
      case /^(w|b)Q/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["Q"]; initialPieceNumbers[`${piece.charAt(0)}Q`] += 1;
        break;
      case /^(w|b)K/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["K"]; 
        break;
      case /^(w|b)B/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["B"]; initialPieceNumbers[`${piece.charAt(0)}B`] += 1;
        break;
      case /^(w|b)R/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["R"]; initialPieceNumbers[`${piece.charAt(0)}R`] += 1;
        break;
      case /^wP/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["wP"]; initialPieceNumbers[`${piece.charAt(0)}P`] += 1;
        break;
      case /^bP/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["bP"]; initialPieceNumbers[`${piece.charAt(0)}P`] += 1;
        break; 
      case /^(w|b)N/.test(piece): initialPiecesObject[piece].paths = PIECEPATHS["N"]; initialPieceNumbers[`${piece.charAt(0)}N`] += 1;
        break;
      default: console.log("something went wrong while assigning paths");
    }
  });

  //cellMap is used for piece name lookup by cell
  let initialCellMap = buildNewCellMap(initialPiecesObject);

  //build the view properties of each piece
  initialPiecesObject = updatePieceVision(initialPiecesObject, initialCellMap);

  return [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ];
}