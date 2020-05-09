import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./TestBoard.css";
import rulesets from "./PieceRules";
import {
  BOARDDIMENSIONS, 
  TILESIZE, 
  TILEBORDERSIZE, 
  LIGHT_TILE, 
  DARK_TILE,
  PIECE_OBJECTS
} from "./CONSTANTS";

class TestBoard extends Component{
  constructor(props){
    super(props);
    console.log("constructor");
    //create checkerboard
    //why is this done here?
    let tileBool = true;
    let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
      return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
        tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
        return tileBool? LIGHT_TILE : DARK_TILE;
      });
    });

    //imbue all the piece objects with their rulesets
    Object.keys(PIECE_OBJECTS).forEach((piece, i) => {
      PIECE_OBJECTS[piece].rules = rulesets(piece);
    })
    // console.log(PIECE_OBJECTS);

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      piecesObject: PIECE_OBJECTS,
      tileArr,
      turn: true,
      selectedPiece: "",
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
      let legal = this.checkMoveLegality(cell);
            
      if(legal){
        this.pieceMove(cell);
      } else if(!legal){
        console.log("ILLEGAL!");
        this.setState({selectedPiece: "", messageBoard: "ILLEGAL! FUCK YOU!"});
      } else {
        console.log("move is neither legal nor illegal. debug now");
      }
    } 
  }

  //Handle piece clicks
  //may set state on selections, but not on actions
  pieceClick = (e, name) => {
    
    //Selecting a piece
    if(this.state.selectedPiece.length === 0){

      //TODO - once turn taking is implemented, implement selection legality and changing selections
      let legal = this.checkSelectionLegality(name);
      if(legal) this.setState({selectedPiece: name, messageBoard: `piece ${name} is selected`});
      else this.setState({messageBoard: "Illegal selection, try again"});
    }
    //Deselecting a piece
    else if(this.state.selectedPiece === name){
      this.setState({selectedPiece: "", messageBoard: "no piece selected"});
    }
    //Attacking a piece
    else if(this.state.selectedPiece.length > 0 && name !== this.state.selectedPiece){
      let legal = this.checkAttackLegality(name);
      if(legal) this.pieceKill(name);
      else this.setState({selectedPiece: "", messageBoard: "illegal attack"});
    } else {
      console.log("something is wrong in pieceClick");
    }
  }

  //moves the currently selected piece to cell
  pieceMove = (cell) => {
    
    let newstate = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;

    newstate[selectedpc].xC = cell[0];
    newstate[selectedpc].yC = cell[1];

    this.setState({piecesObject: newstate, turn: !this.state.turn, selectedPiece: "", messageBoard: `piece ${selectedpc} moved to ${cell[0]},${cell[1]}`});
  }

  //moves a piece to kill another piece
  pieceKill = (target) => {
    
    let newstate = {...this.state.piecesObject};
    let selectedpc = this.state.selectedPiece;

    newstate[selectedpc].xC = newstate[target].xC;
    newstate[selectedpc].yC = newstate[target].yC;
    newstate[target].dead = true;
  
    this.setState({piecesObject: newstate, turn: !this.state.turn, selectedPiece: "", messageBoard: `${selectedpc} has successfully attacked ${target}`});
  }

  handleTurns = () => {
        
  }

  checkSelectionLegality = (target) => {
    // debugger;
    if(this.state.turn){
      return /^w/.test(target);
    } else if(!this.state.turn) {
      return /^b/.test(target);
    } else {
      return console.log("something is wrong");
    }
  }

  //checks the legality of attacks
  checkAttackLegality = (target) => {
    console.log(target);
    //target is string
    let isLegal = false;
    let selectedpc = this.state.piecesObject[this.state.selectedPiece];
    let targetpc = this.state.piecesObject[target];
    let attack = [targetpc.xC - selectedpc.xC, targetpc.yC - selectedpc.yC];
    if(selectedpc.rules.attacklogic == null){
      isLegal = selectedpc.rules.movelogic(attack[0], attack[1]);
    } else if (selectedpc.rules.attacklogic){
      isLegal = selectedpc.rules.attacklogic(attack[0],attack[1]);
    }
    console.log(isLegal);
    return isLegal;
  }

  //checks the legality of moves
  checkMoveLegality = (cell) => {
    let isLegal = false;
    let piece = this.state.piecesObject[this.state.selectedPiece];
    
    let move = [cell[0] - piece.xC, cell[1] - piece.yC];
    isLegal = piece.rules.movelogic(move[0],move[1]);
    // debugger;
    return isLegal;
  }
  
  render(){
    console.log("render");
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
