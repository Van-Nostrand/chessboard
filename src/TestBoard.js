//TODO - Rename occupiedObject to pieceMap or something similar
//TODO - rename piecesObject to piecesLedger or something similar
//TODO - Explore updating just an individual piece rather than the whole pieceLedger
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
  PIECE_OBJECTS,
  W_KING_CHECK_TEST
} from "./CONSTANTS";

//This is the main component for this whole game
//It handles clicks and selections, and maintains the list of pieces and tiles
//I think the board will prompt selected pieces to trigger their "vision" methods
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
    
    //initial occupiedObject creation
    //this is an object that is an easy reference to occupied cells
    // let occupiedObject = this.buildOccupiedObject(PIECE_OBJECTS);

    //WHITE KING TESTING
    Object.keys(W_KING_CHECK_TEST).forEach((piece, i) => {
      let rules = rulesets(piece);
      let ruleKeys = Object.keys(rules);
      ruleKeys.forEach(rule => W_KING_CHECK_TEST[piece][rule] = rules[rule]);
      W_KING_CHECK_TEST[piece].name = piece;
    });

    //WHITE KING TESTING
    let occupiedObject = this.buildOccupiedObject(W_KING_CHECK_TEST);    

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      // piecesObject: PIECE_OBJECTS,
      piecesObject: W_KING_CHECK_TEST,
      tileArr,
      turn: true,
      selectedPiece: "",
      occupiedObject,
      messageBoard: "no piece selected"
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
      if(ChessGovernor.checkSelectionLegality(name, this.state.turn)) {

        //update the pieces view
        //TODO - Move this to the end of movePiece
        let newPiecesObject = {...this.state.piecesObject};
        let newPieceView = newPiecesObject[name].vision(newPiecesObject, this.state.occupiedObject, name);
        newPiecesObject[name].view = newPieceView;
        
        //TESTING PIECE VISION
        console.log(newPieceView);

        this.setState({
          piecesObject: newPiecesObject,
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

  //moves the currently selected piece to cell
  //TODO - build a new occupiedObject
  pieceMove = (cell) => {

    //testing out a refactor
    let newSinglePiece = {...this.state.piecesObject[this.state.selectedPiece]};
    console.log("here's newSinglePiece before moving");
    console.log(newSinglePiece);

    //NEW WAY
    if(newSinglePiece.hasOwnProperty("enPassant") && 
      newSinglePiece.enPassant) newSinglePiece.enPassant = false;

    if(newSinglePiece.firstMove){
      newSinglePiece.firstMove = false;

      if(
        newSinglePiece.name.charAt(1) === "P" && 
        !newSinglePiece.enPassant &&
        cell[0] - newSinglePiece.xC === 0 &&
        (cell[1] - newSinglePiece.yC === 2 || cell[1] - newSinglePiece.yC === -2) 
        ){
          newSinglePiece.enPassant = true;
      }
    }
    newSinglePiece.xC = cell[0];
    newSinglePiece.yC = cell[1];

    let newPiecesLedger = {...this.state.piecesObject, [this.state.selectedPiece]: newSinglePiece};

    let newOccupiedObject = this.buildOccupiedObject(newPiecesLedger);

    this.setState({
      piecesObject: newPiecesLedger, 
      occupiedObject: newOccupiedObject,
      turn: !this.state.turn, 
      selectedPiece: "", 
      messageBoard: `piece ${this.state.selectedPiece} moved to ${cell[0]},${cell[1]}`
    });
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
  
    this.setState({
      piecesObject: newPieceObject, 
      occupiedObject: newOccupiedObject, 
      turn: !this.state.turn,
      selectedPiece: "",
      messageBoard: `${selectedpc} has successfully attacked ${target}`
    });
  }

  //this returns an object with a list of coordinates of each piece, the key being the coordinate and the value being the piece name
  //TODO - I'm certain this is efficient, but go over other options sometime
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
  //TODO - consider having ChessBuilder do this
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
  //TODO - consider having ChessBuilder do this
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
