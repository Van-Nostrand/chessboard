
import React from "react";
import Tile from "./Tile";
import Piece from "./Piece";

/*
any functionality inside ChessGame.js that builds something is going to be moved in here as a static method
*/
export class ChessBuilder {
  
  //makes the tiles for the game
  
  static makeTiles(tileArr, tileSize, tileBorderSize, tileClick){
   
    return new Array(tileArr.length).fill().map((column, i) => {
      return new Array(tileArr[0].length).fill().map((tile,j) => {
        return <Tile
                  key={`tile-${i}-${j}`} 
                  size={tileSize} 
                  borderColour="red" 
                  backgroundColor={tileArr[i][j]}
                  borderSize={tileBorderSize} 
                  onClick={tileClick} />;
      });
    });
  }

  //makes the pieces for the game
  static makePieces(piecesObject, tileSize, selectedPiece, pieceClick){
    return Object.keys(piecesObject).map((name, i) => {
      return <Piece 
                x={piecesObject[name].x}
                y={piecesObject[name].y}
                dead={piecesObject[name].dead}
                pngPos={piecesObject[name].pngPos}
                key={name}
                name={name}
                size={tileSize}
                border={selectedPiece}
                onClick={pieceClick} />
    });
  }
}
