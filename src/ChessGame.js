//TODO - Rename occupiedObject to pieceMap or something similar
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
  PIECE_OBJECTS,
  W_KING_CHECK_TEST
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

    //------------------------
    // PIECE CLASSES
    //-------------------------
    let newPiecesObject = {};
    Object.keys(PIECE_OBJECTS).forEach((piece, i) => {
      newPiecesObject[piece] = this.imbueClass(piece, PIECE_OBJECTS[piece]);
      
    });

    /*
      occupiedObject is used for piece name lookup by cell
      I will eventually merge it into piecesObject and rename appropriately
    */
    let occupiedObject = this.buildCellLedger(newPiecesObject);

    this.updatePieceVision(newPiecesObject, occupiedObject);

    //unimplemented test
    let gameLedger = {...newPiecesObject, findByCell: occupiedObject};

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      piecesObject: newPiecesObject,
      tileArr,
      turn: true,
      selectedPiece: "",
      occupiedObject,
      messageBoard: "no piece selected",
      gameLedger //unused so far
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

  //HANDLE TILE CLICKS
  //only sets state if illegal move detected
  tileClick = (e) => {
    //Clicking a tile while no piece selected
    if(this.state.selectedPiece.length === 0){
      return;
    }
    
    //Piece is selected, user wants to move here
    if(this.state.selectedPiece.length > 0){
      
      //First, get coordinates of the clicked cell
      let rect = document.getElementById("pieces-container").getBoundingClientRect();
      let cell = [Math.floor((e.clientX - rect.left) / TILESIZE),Math.floor((e.clientY - rect.top) / TILESIZE)];
      
      //testing legality with new method
      let legal = this.state.piecesObject[this.state.selectedPiece].newview[`${cell[0]},${cell[1]}`] && this.state.piecesObject[this.state.selectedPiece].newview[`${cell[0]},${cell[1]}`] === "m";

      if(legal){
        this.pieceMove(cell);
      } else if(!legal){
        console.log("ILLEGAL!");
        this.setState({selectedPiece: "", messageBoard: "Not legal"});
      } else {
        console.log("move is neither legal nor illegal. debug now!");
      }
    } 
  }

  //Handle piece clicks
  //may set state on selections, but not on actions
  pieceClick = (e, name) => {

    //if selecting a piece
    if(this.state.selectedPiece.length === 0){

      //check turn, then confirm selection and update piece.view
      if(this.state.turn && (/^w/.test(name)) || !this.state.turn && (/^b/.test(name))){

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
  
      if(legal) this.pieceKill(name);
      else this.setState({selectedPiece: "", messageBoard: "illegal attack"});
    } 
    else {
      console.log("something is wrong in pieceClick");
    }
  }

  //this updates the vision of every piece
  //TODO - this is mutating data... I'm only using it in game setup, but think of a better way
  updatePieceVision = (newPiecesObject, newOccupiedCells) => {
    
    let pieceNames = Object.keys(newPiecesObject);

    for(let i = 0; i < pieceNames.length; i++){
      //TESTING NEW PAWN VISION
      // if( pieceNames[i].charAt(1) === "B" && pieceNames[i].charAt(0) === "b"){
      //   let trialview = newPiecesObject[pieceNames[i]].pseudovision(newOccupiedCells);
      //   newPiecesObject[pieceNames[i]].newview = trialview;
      // }
      if(/^wK/.test(pieceNames[i])){
        newPiecesObject[pieceNames[i]].amIChecked(newOccupiedCells);
      }

      //if the piece isn't dead, update vision
      if(newPiecesObject[pieceNames[i]].x >= 0){
        // let newPieceView = newPiecesObject[pieceNames[i]].vision(newPiecesObject, newOccupiedCells, pieceNames[i]);
        // newPiecesObject[pieceNames[i]].view = newPieceView;
        newPiecesObject[pieceNames[i]].pseudovision(newOccupiedCells, newPiecesObject);
        // newPiecesObject[pieceNames[i]].vision(newPiecesObject, newOccupiedCells, pieceNames[i]);
      }
    }

    return newPiecesObject;
  }

  //handles updating the cell ledger, all piece views, the message board, 
  updateGame = (newPiecesObject, ...args) => {

    let newOccupiedCells = this.buildCellLedger(newPiecesObject);
    let pieceNames = Object.keys(newPiecesObject);  

    //update piece views
    this.updatePieceVision(newPiecesObject, newOccupiedCells);

    //determine if this is a piecemove or piecekill based on whether the second args variable is an array
    let messageBoard = Array.isArray(args[1]) ? `piece ${args[0]} moved to ${args[1][0]},${args[1][1]}` : `${args[0]} has successfully attacked ${args[1]}`;

    this.setState({
      piecesObject: newPiecesObject,
      occupiedObject: newOccupiedCells,
      turn: !this.state.turn,
      selectedPiece: "",
      messageBoard
    });
  }

  //this is called once all of the checks have approved and a move is deemed legal
  newPieceMove = (cell) => {
    let newPieceObject = {...this.state.piecesObject};
    let deltas = [cell[0] - newPieceObject[this.state.selectedPiece].x, cell[1] - newPieceObject[this.state.selectedPiece].y];

    newPieceObject[this.state.selectedPiece].x = cell[0];
    newPieceObject[this.state.selectedPiece].y = cell[1];

    // updateGame = (newPiecesObject, newOccupiedCells, ...args) => {
    this.updateGame(newPieceObject);
    
  }

  //moves the currently selected piece to cell
  pieceMove = (cell) => {
    
    let newPieceObject = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;
    let deltas = [cell[0] - newPieceObject[selectedpc].x,cell[1] - newPieceObject[selectedpc].y];

    //REMOVES ENPASSANT FLAG
    if(newPieceObject[selectedpc].hasOwnProperty("enPassant") && newPieceObject[selectedpc].enPassant) newPieceObject[selectedpc].enPassant = false;

    //if this is the pieces first move
    if(newPieceObject[selectedpc].firstMove){
      newPieceObject[selectedpc].firstMove = false;

      // CREATES ENPASSANT FLAG
      //if the piece is a pawn AND not flagged for enpassant AND did not just move diagonally AND moved two spaces
      if(
        newPieceObject[selectedpc].name.charAt(1) === "P" && 
        !newPieceObject[selectedpc].enPassant &&
        cell[0] - newPieceObject[selectedpc].x === 0 &&
        (cell[1] - newPieceObject[selectedpc].y === 2 || cell[1] - newPieceObject[selectedpc].y === -2) 
        ){
          newPieceObject[selectedpc].enPassant = true;
      }
    } 
    else if(newPieceObject[selectedpc].enPassant){
      newPieceObject[selectedpc].enPassant = false;
    }

    //if this is enpassant attack
    //RESUME WORK HERE
    if(selectedpc.charAt(1) === "P"){
      let attackArray = Object.keys(newPieceObject[selectedpc].view).filter(path => newPieceObject[selectedpc].view[path[0]] === cell);

      if(attackArray.length > 1){
        this.enPassant(attackArray);
        return;
      }
    }

    newPieceObject[selectedpc].x = cell[0];
    newPieceObject[selectedpc].y = cell[1];

    this.updateGame(newPieceObject, selectedpc, cell);
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

    // let newOccupiedObject = this.buildCellLedger(newPieceObject);

    this.updateGame(newPieceObject, selectedpc, target);
  }

  //updated occupiedObject builder
  buildCellLedger = (piecesObject) => {
    let grid = {};
    let piecenames = Object.keys(piecesObject);
    piecenames.forEach((piece, i) => {
      let coordinates = `${piecesObject[piece].x},${piecesObject[piece].y}`;
      grid[coordinates] = piece;
    }) ;
    return grid;
  }
  
  render(){
    
    //GENERATE TILES
    let boardTiles = this.makeTiles();

    //GENERATE PIECES
    let pieceObjects = this.makePieces();

    //STYLES
    //TODO - move these into their respective components
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

  //TODO - this mutates data, not sure if this is ok..
  // oldUpdatePieceVision = (newPiecesObject, newOccupiedCells) => {
    
  //   let pieceNames = Object.keys(newPiecesObject);

  //   for(let i = 0; i < pieceNames.length; i++){
  //     //TESTING NEW PAWN VISION
  //     if( pieceNames[i].charAt(1) === "B" && pieceNames[i].charAt(0) === "b"){
  //       let trialview = newPiecesObject[pieceNames[i]].pseudovision(newOccupiedCells);
  //       newPiecesObject[pieceNames[i]].newview = trialview;
  //     }

  //     //if the piece isn't dead, update vision
  //     if(newPiecesObject[pieceNames[i]].x >= 0){
  //       let newPieceView = newPiecesObject[pieceNames[i]].vision(newPiecesObject, newOccupiedCells, pieceNames[i]);
  //       newPiecesObject[pieceNames[i]].view = newPieceView;
  //     }
  //   }
  // }

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
