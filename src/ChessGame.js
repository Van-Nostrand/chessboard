//TODO - rename piecesObject to piecesLedger or something similar
//TODO - Explore updating just an individual piece rather than the whole pieceLedger
import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import {
  BOARDDIMENSIONS, 
  TILESIZE, 
  TILEBORDERSIZE, 
  LIGHT_TILE, 
  DARK_TILE,
  PIECE_OBJECTS
} from "./CONSTANTS";

import KingClass from "./pieceData/KingClass";
import QueenClass from "./pieceData/QueenClass";
import RookClass from "./pieceData/RookClass";
import PawnClass from "./pieceData/PawnClass";
import BishopClass from "./pieceData/BishopClass";
import KnightClass from "./pieceData/KnightClass";

//This is the main component for this whole game
//It handles clicks and selections, and maintains the list of pieces and tiles
//I think the board will prompt selected pieces to trigger their "vision" methods
class ChessGame extends Component{
  constructor(props){
    super(props);

    //create checkerboard
    let tileBool = true;
    let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
      return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
        tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
        return tileBool? LIGHT_TILE : DARK_TILE;
      });
    });

    //declare pieces
    let newPiecesObject = {};
    Object.keys(PIECE_OBJECTS).forEach((piece, i) => {
      newPiecesObject[piece] = this.imbueClass(piece, PIECE_OBJECTS[piece]);
    });

    
    //cellMap is used for piece name lookup by cell
    //I will eventually merge it and the piecesObject into gameLedger below
    let cellMap = this.buildCellLedger(newPiecesObject);

    this.updatePieceVision(newPiecesObject, cellMap);

    //unimplemented test
    let gameLedger = {...newPiecesObject, findByCell: cellMap};

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      piecesObject: newPiecesObject,
      tileArr,
      turn: true,
      selectedPiece: "",
      cellMap,
      messageBoard: "no piece selected",
      gameLedger,                 //unused so far
      whiteKingWasInCheck: false, //unused so far
      blackKingWasInCheck: false  //unused so far
    }
  }

  imbueClass = (name, pieceData) => {
    switch(name.charAt(1)) {
      case "P": return new PawnClass(name, pieceData.x, pieceData.y, pieceData.pngPos, name.charAt(0) === "w" ? -1 : 1);
      case "K": return new KingClass(name, pieceData.x, pieceData.y, pieceData.pngPos);
      case "N": return new KnightClass(name, pieceData.x, pieceData.y, pieceData.pngPos);
      case "Q": return new QueenClass(name, pieceData.x, pieceData.y, pieceData.pngPos);
      case "R": return new RookClass(name, pieceData.x, pieceData.y, pieceData.pngPos);
      case "B": return new BishopClass(name, pieceData.x, pieceData.y, pieceData.pngPos);
      default: console.log("error imbueing classes");
    }
  }

  tileClick = (e) => {
    //Clicking a tile while no piece selected
    if(this.state.selectedPiece.length === 0){
      return;
    }

    //Piece is selected, user wants to move here
    if(this.state.selectedPiece.length > 0){
      
      let rect = document.getElementById("pieces-container").getBoundingClientRect();
      let cell = [Math.floor((e.clientX - rect.left) / TILESIZE),Math.floor((e.clientY - rect.top) / TILESIZE)];
      
      let legal = this.state.piecesObject[this.state.selectedPiece].newview[`${cell[0]},${cell[1]}`] && this.state.piecesObject[this.state.selectedPiece].newview[`${cell[0]},${cell[1]}`] === "m";

      //IF KING ALREADY IN CHECK
        //TEST KING NO LONGER IN CHECK
      //ELSE
        //TEST KING NOT PUT IN CHECK

      if(legal){
        this.ownKingNotInCheck("m", cell);
      } else if(!legal){
        console.log("ILLEGAL!");
        this.setState({selectedPiece: "", messageBoard: "Not legal"});
      } else {
        console.log("move is neither legal nor illegal. debug now!");
      }
    } 
  }

  pieceClick = (e, name) => {

    //if selecting a piece
    if(this.state.selectedPiece.length === 0){

      //check turn, then confirm selection and update piece.view
      if((this.state.turn && (/^w/.test(name))) || (!this.state.turn && (/^b/.test(name)))){

        this.setState({
          selectedPiece: name, 
          messageBoard: `piece ${name} is selected`
        });
      }
      else {
        this.setState({messageBoard: "Illegal selection, try again"});
      }
    }
    //if deselecting a piece
    else if(this.state.selectedPiece === name){
      this.setState({selectedPiece: "", messageBoard: "no piece selected"});
    }
    //if attacking a piece
    else if(this.state.selectedPiece.length > 0 && name !== this.state.selectedPiece){

      let targetCoordinates = [this.state.piecesObject[name].x, this.state.piecesObject[name].y];
      let legal = this.state.piecesObject[this.state.selectedPiece].newview[`${targetCoordinates[0]},${targetCoordinates[1]}`] && this.state.piecesObject[this.state.selectedPiece].newview[`${targetCoordinates[0]},${targetCoordinates[1]}`] === "a";
  
      if(legal){ 
        this.ownKingNotInCheck("a",name);
      }
      else {
        this.setState({selectedPiece: "", messageBoard: "illegal attack"});
      }
    } 
    else {
      console.log("something is wrong in pieceClick");
    }
  }

  ownKingNotInCheck = (action, arg) => {
    // let proposedNewPieces = {...this.state.piecesObject, ...this.state.piecesObject[this.state.selectedPiece]};

    // let selectedpc = this.state.selectedPiece;

    //IF THIS IS A MOVE
    if(action === "m"){
      let proposedNewPiece = Object.assign({}, this.state.piecesObject[this.state.selectedPiece]);
      let originalState 
      proposedNewPiece.testVar = true;
      
      //in this case, arg is an array describing a cell
      proposedNewPiece.x = arg[0];
      proposedNewPiece.y = arg[1];
      
      let proposedNewPieces = {...this.state.piecesObject, [this.state.selectedPiece]: proposedNewPiece};
      
      let proposedNewCellMap = this.buildCellLedger(proposedNewPieces);
      let teamKing = this.state.turn ? "wK" : "bK";

      //special case for when the currently moved piece is the king
      if(this.state.selectedPiece === teamKing){
        proposedNewPieces[teamKing].amIChecked(proposedNewCellMap,[proposedNewPiece.x,proposedNewPiece.y]);
      }
      else {
        proposedNewPieces[teamKing].amIChecked(proposedNewCellMap);
      }
      //if this teams king has a checkView property with ANY key/value pairs, the king is in check and the move cannot continue
      
      debugger;
      if(Object.keys(proposedNewPieces[teamKing].checkView).length > 0){
        console.log("the king is in check")
        this.setState(prevState => {
          return {...prevState, selectedPiece: "", messageBoard: "this puts your king in check, try again"};
        });
      }
      //else the move is safe and can continue
      else{
        console.log("the king is not in check")
        this.pieceMove(arg, proposedNewPieces, proposedNewCellMap);
      }
    }
    else if(action === "a"){

    }
  }

  //this calls a function on each piece that updates their own view property
  updatePieceVision = (piecesObject, cellMap) => {
    
    let pieceNames = Object.keys(piecesObject);

    for(let i = 0; i < pieceNames.length; i++){
      if(/^(w|b)K/.test(pieceNames[i])){
        piecesObject[pieceNames[i]].amIChecked(cellMap);
      }

      //if the piece isn't dead, update vision
      if(piecesObject[pieceNames[i]].x >= 0){
        piecesObject[pieceNames[i]].vision(cellMap, piecesObject);
      }
    }

    return piecesObject;
  }

  //handles updating the cell ledger, all piece views, the message board, 
  updateGame = (newPiecesObject, ...args) => {
    let pieceNames = Object.keys(newPiecesObject);  

    //update piece views
    this.updatePieceVision(newPiecesObject, args[2]);

    //determine if this is a piecemove or piecekill based on whether the second args variable is an array
    let messageBoard = Array.isArray(args[1]) ? `piece ${args[0]} moved to ${args[1][0]},${args[1][1]}` : `${args[0]} has successfully attacked ${args[1]}`;

    this.setState({
      piecesObject: newPiecesObject,
      cellMap: args[2],
      turn: !this.state.turn,
      selectedPiece: "",
      messageBoard
    });
  }

  pieceMove = (cell, newPieceObject, newCellMap) => {
    
    // let newPieceObject = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;

    //if this is the pieces first move
    if(newPieceObject[selectedpc].firstMove){
      newPieceObject[selectedpc].firstMove = false;
    } 

    this.updateGame(newPieceObject, selectedpc, cell, newCellMap);
  }

  //moves a piece to kill another piece
  pieceKill = (target) => {
    
    let newPieceObject = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;

    newPieceObject[selectedpc].x = newPieceObject[target].x;
    newPieceObject[selectedpc].y = newPieceObject[target].y;
    newPieceObject[target].x = -1;
    newPieceObject[target].y = -1;
    newPieceObject[target].dead = true;

    this.updateGame(newPieceObject, selectedpc, target);
  }

  //updated cellMap builder
  buildCellLedger = (piecesObject) => {
    let cellMap = {};
    let piecenames = Object.keys(piecesObject);
    piecenames.forEach((piece, i) => {
      let coordinates = `${piecesObject[piece].x},${piecesObject[piece].y}`;
      cellMap[coordinates] = piece;
    }) ;
    return cellMap;
  }
  
  render(){
    
    //GENERATE TILES
    let boardTiles = this.makeTiles();

    //GENERATE PIECES
    let pieceObjects = this.makePieces();

    //STYLES
    let tileContainerStyle = {
      width: `${this.state.boardDimensions[0] * this.state.tileSize}px`,
      height: `${this.state.boardDimensions[1] * this.state.tileSize}px`,
      margin: `auto`,
      padding: `0px`,
      display: "flex",
      flexFlow: "row",
      flexWrap: "wrap",
      border: `1px solid blue`,
      position: "absolute"
    }
    let outerStyle = {
      display: "flex", 
      alignItems: "center", 
      justifyontent: "center",
      flexFlow: "row",
      height: "100vh"
    }
    let piecesContainerStyle = {
      width: `${this.state.boardDimensions[0] * this.state.tileSize}px`,
      height: `${this.state.boardDimensions[1] * this.state.tileSize}px`,
      margin: `auto`,
      padding: `0px`,
      display: "flex",
      flexFlow: "row",
      flexWrap: "wrap",
      position: "absolute",
      pointerEvents: "none"
    }
    let h3Style = {
      display: "inline",
      alignSelf: "flex-end",
      
    }
    let h2Style = {
      display: "inline",
      alignSelf: "flex-start"
    }

    return(
      <div style={outerStyle}>
        <h2 style={h2Style}>{this.state.turn ? "White turn" : "Black turn"}</h2>
        <div id="tile-container" style={tileContainerStyle}>
          {boardTiles}
        </div>
        <div id="pieces-container" style={piecesContainerStyle} >
          {pieceObjects}
        </div>
        <h3 style={h3Style}>{this.state.messageBoard}</h3>
      </div>
    )
  }

  //makes the tiles for the game
  makeTiles = () => {
    return new Array(this.state.boardDimensions[0]).fill().map((column, i) => {
      return new Array(this.state.boardDimensions[1]).fill().map((tile,j) => {
        return <Tile
                  key={`tile-${i}-${j}`} 
                  size={this.state.tileSize} 
                  borderColour="red" 
                  backgroundColor={this.state.tileArr[i][j]}
                  borderSize={this.state.tileBorderSize} 
                  onClick={this.tileClick} />
      });
    });
  }

  //makes the pieces for the game
  makePieces = () => {
    return Object.keys(this.state.piecesObject).map((name, i) => {
      return <Piece 
                x={this.state.piecesObject[name].x}
                y={this.state.piecesObject[name].y}
                dead={this.state.piecesObject[name].dead}
                pngPos={this.state.piecesObject[name].pngPos}
                key={name}
                name={name}
                size={TILESIZE}
                border={this.state.selectedPiece}
                onClick={this.pieceClick} />
    });
  }
}

export default ChessGame;
