import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./TestBoard.css";
import rulesets from "./PieceRules";
import ChessGovernor from "./ChessGovernor";
import {
  BOARDDIMENSIONS, 
  TILESIZE, 
  TILEBORDERSIZE, 
  LIGHT_TILE, 
  DARK_TILE,
  PIECE_OBJECTS
} from "./CONSTANTS";
import {
  KingClass,
  QueenClass,
  RookClass,
  KnightClass,
  BishopClass,
  PawnClass
} from "./PieceClasses";

//This is the main component for this whole game
//It handles clicks and selections, and maintains the list of pieces and tiles
//I think the board will prompt selected pieces to trigger their "vision" methods
//TODO - Move all updating stuff at the end of pieceMove and pieceKill to a separate updateAll function
//TODO - Investigate why I made occupiedObject's values all single index arrays...
class TestBoard extends Component{
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

    //imbue all the piece objects with their rulesets
    //also added a name property, which is the pieces name
    // Object.keys(PIECE_OBJECTS).forEach((piece, i) => {
    //   let rules = rulesets(piece);
    //   let ruleKeys = Object.keys(rules);
    //   ruleKeys.forEach(rule => PIECE_OBJECTS[piece][rule] = rules[rule]);
    //   PIECE_OBJECTS[piece].name = piece;
    // });

    //------------------------
    //TESTING PIECE CLASSES
    //-------------------------
    let newPiecesObject = {};
    Object.keys(PIECE_OBJECTS).forEach((piece, i) => {
      newPiecesObject[piece] = this.imbueClass(piece, PIECE_OBJECTS[piece]);
      
    });

    //initial occupiedObject creation
    //this is an object that is an easy reference to occupied cells
    let occupiedObject = this.buildOccupiedObject(PIECE_OBJECTS);

    let piecesObject = this.updatePieceVision(PIECE_OBJECTS, occupiedObject);

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      piecesObject,
      tileArr,
      turn: true,
      selectedPiece: "",
      occupiedObject,
      messageBoard: "no piece selected"
    }
  }

  imbueClass = (name, pieceData) => {
    switch(name.charAt(1)) {
      case "P": return new PawnClass(name, pieceData.xC, pieceData.yC, pieceData.pngPos, name.charAt(0) === "w" ? -1 : 1);
      case "K": return new KingClass(name, pieceData.xC, pieceData.yC, pieceData.pngPos);
      case "N": return new KnightClass(name, pieceData.xC, pieceData.yC, pieceData.pngPos);
      case "Q": return new QueenClass(name, pieceData.xC, pieceData.yC, pieceData.pngPos);
      case "R": return new RookClass(name, pieceData.xC, pieceData.yC, pieceData.pngPos);
      case "B": return new BishopClass(name, pieceData.xC, pieceData.yC, pieceData.pngPos);
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
      
      //First, get tile coordinates
      let rect = document.getElementById("pieces-container").getBoundingClientRect();
      let cell = [Math.floor((e.clientX - rect.left) / TILESIZE),Math.floor((e.clientY - rect.top) / TILESIZE)];

      //Then perform the legality check
      let legal = ChessGovernor.checkMoveLegality(this.state.selectedPiece, cell, this.state.piecesObject, this.state.occupiedObject);

      if(legal){
        this.pieceMove(cell);
      } else if(!legal){
        console.log("ILLEGAL!");
        this.setState({selectedPiece: "", messageBoard: "Not legal"});
      } else {
        console.log("move is neither legal nor illegal. debug now");
      }
    } 
  }

  //Handle piece clicks
  //may set state on selections, but not on actions
  pieceClick = (e, name) => {
    
    //if selecting a piece
    if(this.state.selectedPiece.length === 0){

      //check turn, then confirm selection and update piece.view
      if(ChessGovernor.checkSelectionLegality(name, this.state.turn)) {

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
      let legal = ChessGovernor.checkAttackLegality(this.state.selectedPiece, name, this.state.piecesObject, this.state.occupiedObject);
      if(legal) this.pieceKill(name);
      else this.setState({selectedPiece: "", messageBoard: "illegal attack"});
    } else {
      console.log("something is wrong in pieceClick");
    }
  }

  //this updates the vision of every piece
  //TODO - this is mutating data... I'm only using it in game setup, but think of a better way
  updatePieceVision = (piecesObject, occupiedObject) => {
    
    let pieceNames = Object.keys(piecesObject);
    debugger;

    for(let i = 0; i < pieceNames.length; i++){

      //if the piece isn't dead, update vision
      if(piecesObject[pieceNames[i]].xC >= 0){
        let newPieceView = piecesObject[pieceNames[i]].vision(piecesObject, occupiedObject, pieceNames[i]);
        piecesObject[pieceNames[i]].view = newPieceView;
      }
    }

    return piecesObject;
  }


  //TODO - implement king checking after vision update
  updateGame = (newPiecesObject, newOccupiedObject, ...args) => {

    let pieceNames = Object.keys(newPiecesObject);

    for(let i = 0; i < pieceNames.length; i++){
      //if the piece isn't dead, update vision
      if(newPiecesObject[pieceNames[i]].xC >= 0){
        let newPieceView = newPiecesObject[pieceNames[i]].vision(newPiecesObject, newOccupiedObject, pieceNames[i]);
        newPiecesObject[pieceNames[i]].view = newPieceView;
      }
    }

    let kingLocations = [];
    Object.keys(newOccupiedObject).forEach((occupiedCell, i) => {
      if(newOccupiedObject[occupiedCell][0].charAt(1) === "K"){
        kingLocations.push( [occupiedCell, newOccupiedObject[occupiedCell][0]]);
      }
    });

    console.log(kingLocations);
    
    //determine if this is a piecemove or piecekill based on whether the second args variable is an array
    let messageBoard = Array.isArray(args[1]) ? `piece ${args[0]} moved to ${args[1][0]},${args[1][1]}` : `${args[0]} has successfully attacked ${args[1]}`;

    this.setState({
      piecesObject: newPiecesObject,
      occupiedObject: newOccupiedObject,
      turn: !this.state.turn,
      selectedPiece: "",
      messageBoard
    });
  }

  //moves the currently selected piece to cell
  pieceMove = (cell) => {
    
    let newPieceObject = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;

    if(newPieceObject[selectedpc].hasOwnProperty("enPassant") && newPieceObject[selectedpc].enPassant) newPieceObject[selectedpc].enPassant = false;

    if(newPieceObject[selectedpc].firstMove){
      newPieceObject[selectedpc].firstMove = false;

      if(
        newPieceObject[selectedpc].name.charAt(1) === "P" && 
        !newPieceObject[selectedpc].enPassant &&
        cell[0] - newPieceObject[selectedpc].xC === 0 &&
        (cell[1] - newPieceObject[selectedpc].yC === 2 || cell[1] - newPieceObject[selectedpc].yC === -2) 
        ){
          newPieceObject[selectedpc].enPassant = true;
      }
    }
    newPieceObject[selectedpc].xC = cell[0];
    newPieceObject[selectedpc].yC = cell[1];
    
    let newOccupiedObject = this.buildOccupiedObject(newPieceObject);

    this.updateGame(newPieceObject, newOccupiedObject, selectedpc, cell);
  }

  //moves a piece to kill another piece
  pieceKill = (target) => {
    
    let newPieceObject = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;

    newPieceObject[selectedpc].xC = newPieceObject[target].xC;
    newPieceObject[selectedpc].yC = newPieceObject[target].yC;
    newPieceObject[target].xC = -1;
    newPieceObject[target].yC = -1;
    newPieceObject[target].dead = true;

    let newOccupiedObject = this.buildOccupiedObject(newPieceObject);

    this.updateGame(newPieceObject, newOccupiedObject, selectedpc, target);
  }

  //this returns an object with a list of coordinates of each piece, the key being the coordinate and the value being the piece name
  //TODO - re-evaluate efficacy of this
  buildOccupiedObject = (piecesObject) => {
    let grid = {};
    let piecenames = Object.keys(piecesObject);
    piecenames.forEach((piece, i) => {
      let coordinates = `${piecesObject[piece].xC},${piecesObject[piece].yC}`;
      if(!grid[coordinates]) grid[coordinates] = [piece];
      else if(grid[coordinates]) grid[coordinates].push(piece);
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
      justifyContent: "center",
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
                xC={this.state.piecesObject[name].xC}
                yC={this.state.piecesObject[name].yC}
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

export default TestBoard;