import React, { Component, useState, useEffect, useRef } from "react";
import CanvasPieces from "./CanvasPieces";
import CanvasChessBoard from "./CanvasChessBoard";
import {
  PIECE_OBJECTS,
  PIECE_PATHS,
  PIECE_PROTOTYPES,
  PIECE_SVGS,
} from "./CONSTANTS";

import KingClass from "./pieceData/KingClass";
import QueenClass from "./pieceData/QueenClass";
import RookClass from "./pieceData/RookClass";
import PawnClass from "./pieceData/PawnClass";
import BishopClass from "./pieceData/BishopClass";
import KnightClass from "./pieceData/KnightClass";

class CanvasChessGameTest extends Component{
  constructor(props){
    super(props);

    let pieceNumbering = {
      "wP": 10,
      "wR": 10,
      "wN": 10,
      "wB": 10,
      "wQ": 10,
      "bP": 10,
      "bR": 10,
      "bN": 10,
      "bB": 10,
      "bQ": 10
    };
  
    let pieceLedger = {};
    for(let piece in PIECE_OBJECTS){
      switch(true){
        case /^(w|b)Q/.test(piece): pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...PIECE_SVGS.queen};
          pieceNumbering
          break;
        case /^(w|b)K/.test(piece): pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...PIECE_SVGS.king};
          break;
        case /^(w|b)B/.test(piece): pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...PIECE_SVGS.bishop};
          break;
        case /^(w|b)R/.test(piece): pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...PIECE_SVGS.rook};
          break;
        case /^(w|b)P/.test(piece): pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...PIECE_SVGS.pawn};
          break;
        case /^(w|b)N/.test(piece): pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...PIECE_SVGS.knight};
          break;
        default: console.log("something went wrong while building pieces");
      }
    }

    

    this.state = {
      pieceLedger,
      selectedPiece: "",
      messageBoard: "Chess!",
      pieceNumbering,
      
    }
  }

  setSelectedPiece = (pieceName) => {
    this.setState({selectedPiece: pieceName, messageBoard: `${pieceName} is selected`});
  }

  boardClick = (e) => {
    console.log(`${e.clientX},${e.clientY}`);
    if(this.state.selectedPiece.length > 0){
      let newPieceLedger = this.recursiveStateCopy(this.state.pieceLedger);
      let newCoordinates = [Math.floor(e.clientX / 60), Math.floor(e.clientY / 60)];
      newPieceLedger[this.state.selectedPiece].x = newCoordinates[0];
      newPieceLedger[this.state.selectedPiece].y = newCoordinates[1];

      this.setState({pieceLedger: newPieceLedger, selectedPiece: ""});
    }
  }

  // deep copies state, gets all recursive about it
  // may need modifying if state structure is altered in the future
  // calls recursiveStateCopy
  // returns object representing piece state
  recursiveStateCopy = (oldstate) => {
    let newState = {};
    let oldstateKeys = Object.keys(oldstate);

    if(oldstateKeys.length > 0){
      oldstateKeys.forEach(key => {
        // recursive copy objects 
        if(typeof(oldstate[key]) === "object" && !Array.isArray(oldstate[key])){
          newState[key] = this.recursiveStateCopy(oldstate[key]);
        }
        // copy up to 2d arrays with map
        else if(typeof(oldstate[key]) === "object" && Array.isArray(oldstate[key])){
          newState[key] = oldstate[key].map(value => {
            if(Array.isArray(value)){
              return value.map(subvalue => subvalue);
            }
            else return value;
          });
        }
        // copy strings
        else if(typeof(oldstate[key]) === "string"){
          newState[key] = `${oldstate[key]}`;
        }
        // copy primitives
        else {
          newState[key] = oldstate[key];
        }
      });
    }
    // i dont think this is necessary...
    else{
      newState = {...oldstate};
    }
    return newState;
  }

  render(){
    let h5Style = {
      position: "absolute",
      transform: "translate(0px,500px)",
      fontSize: "35px"
    }
    
    return(
      <div id="game-container">
        <CanvasChessBoard onClick={this.boardClick} />
        <CanvasPieces selectedPiece={this.state.selectedPiece} setSelectedPiece={this.setSelectedPiece} pieceLedger={this.state.pieceLedger} />
        <h5 style={h5Style}>{this.state.messageBoard}</h5>
      </div>
    );
  }

  // switch statement wrapper
  // returns an object representing a pieces view
  pieceVisionSwitch = (piecesObject, cellMap, pieceName, enPassantPiece = "") => {
    switch(true){
      case /^(w|b)Q/.test(pieceName): return QueenClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)K/.test(pieceName): return KingClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)B/.test(pieceName): return BishopClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)N/.test(pieceName): return KnightClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)R/.test(pieceName): return RookClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)P/.test(pieceName): return PawnClass.vision(cellMap, piecesObject, pieceName, enPassantPiece);
      default: console.log("something went wrong in updatepiecevision");
    }
  }
}

export default CanvasChessGameTest;