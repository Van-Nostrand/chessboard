import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import Piece from "./Piece";

const ChessBoard = ({ tiles, piecesObject, tileClick, pieceClick }) => {

  const boardDimensions = [8,8];
  const tileSize = 60;

  useEffect(() => {

  });


  //makes board tiles 
  makeTiles = () => {
    return new Array(boardDimensions[0]).fill().map((column, i) => {
      return new Array(boardDimensions[1]).fill().map((tile,j) => {
        let cS = 
        return <Tile
                  key={`tile-${i}-${j}`} 
                  size={tileSize} 
                  borderColour="red" 
                  classString={tileArr[i][j]}
                  borderSize={tileBorderSize} 
                  onClick={this.tileClick} />
      });
    });
  }


  //makes pieces for the render method
  makeLivePieces = () => {
    let { piecesObject, selectedPiece } = this.state;
    let livePieces = [];

    Object.keys(piecesObject).forEach((name, i) => {
      livePieces.push(
        <Piece 
          x={piecesObject[name].x}
          y={piecesObject[name].y}
          dead={piecesObject[name].dead}
          key={name}
          name={name}
          size={TILESIZE}
          border={selectedPiece}
          onClick={this.pieceClick} />
      );
    });
    return livePieces;
  }


  makeDeadPieces = () => {
    let { wGraveyard, bGraveyard } = this.state;
    let wPieces = [];
    let bPieces = [];
    let wGraveyardKeys = Object.keys(wGraveyard);
    let bGraveyardKeys = Object.keys(bGraveyard);

    if(wGraveyardKeys.length > 0){
      wGraveyardKeys.forEach(name => {
        wPieces.push(
          <Piece
            x={wGraveyard[name].x}
            y={wGraveyard[name].y}
            dead={wGraveyard[name].dead}
            key={name}
            name={name}
            size={TILESIZE} />
        );
      });
    }

    if(bGraveyardKeys.length > 0){
      bGraveyardKeys.forEach(name => {
        bPieces.push(
          <Piece
            x={bGraveyard[name].x}
            y={bGraveyard[name].y}
            dead={bGraveyard[name].dead}
            key={name}
            name={name}
            size={TILESIZE} />
        )
      });
    }

    return [wPieces, bPieces];

  }

  //STYLES
  let tileContainerStyle = {
    width: `${boardDimensions[0] * tileSize}px`,
    height: `${boardDimensions[1] * tileSize}px`,
  }
 
  let piecesContainerStyle = {
    width: `${boardDimensions[0] * tileSize}px`,
    height: `${boardDimensions[1] * tileSize}px`,
  }  

  return (
    <div id="board-container">
      <div id="tile-container" style={tileContainerStyle}>
        {tiles}
      </div>
      <div id="pieces-container" style={piecesContainerStyle} >
        {pieces}
      </div>
    </div>
  );
}