import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./TestBoard.css";
import rules from "./PieceRules";
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

    //create checkerboard
    let tileBool = true;
    let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
      return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
        tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
        return tileBool? LIGHT_TILE : DARK_TILE;
      });
    });
    Object.keys(PIECE_OBJECTS).forEach((piece, i) => {
      PIECE_OBJECTS[piece].rules = rules(piece);
    })

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      piecesObject: PIECE_OBJECTS,
      tileArr,
      selectedPiece: ""
    }
  }

  

  //HANDLE TILE CLICKS
  tileClick = (e) => {
    
    //ACCIDENTALLY CLICKING A TILE
    if(this.state.selectedPiece.length === 0){
      return;
    }
    
    //Piece is selected, user wants to move here
    if(this.state.selectedPiece.length > 0){
      
      //First, get tile coordinates
      let rect = document.getElementById("pieces-container").getBoundingClientRect();
      let cell = [Math.floor((e.clientX - rect.left) / TILESIZE),Math.floor((e.clientY - rect.top) / TILESIZE)];

      //Then perform the legality check
      let legal = this.checkLegality(cell);

            
      if(legal){
        //is legal, so 
        let newPieceState = {...this.state.piecesObject};
        newPieceState[this.state.selectedPiece].xC = cell[0];
        newPieceState[this.state.selectedPiece].yC = cell[1];
        this.setState({piecesObject: newPieceState, selectedPiece: ""});
      } else if(!legal){
        console.log("ILLEGAL!");
      } else {
        console.log("move is neither legal nor illegal, im confused...");
      }
      
      //TODO - if illegal, handle it
    } 
  }

  
  
  //HANDLE PIECE CLICKS
  pieceClick = (e, name) => {
    
    //IF THIS IS A PIECE SELECTION
    if(this.state.selectedPiece.length === 0){
      this.setState({selectedPiece: name});
    }
    //IF THIS IS A PIECE DESELECTION
    else if(this.state.selectedPiece === name){
      this.setState({selectedPiece: ""});
    }
    //IF THIS IS AN ATTACK TARGET SELECTION
    else if(this.state.selectedPiece.length > 0 && name !== this.state.selectedPiece){
      this.pieceKill(this.state.selectedPiece, name);
    }
    //TODO - implement attacks
  }
  
  pieceKill = (piece, target) => {
    if(this.state.piecesObject[piece].rules.capture !== "same"){
      this.setState({selectedPiece: ""});
      return;
    }
    let newstate = {...this.state.piecesObject};
    newstate[piece].xC = newstate[target].xC;
    newstate[piece].yC = newstate[target].yC;
    newstate[target].dead = true;
  
    this.setState({piecesObject: newstate, selectedPiece: ""});
  }

  createRange = (start, end) => {
    if(start < end) {
      return Array.from({length: (end - start)}, (v,k) => start === 0 ? k + start + 1: k + start)
    } else {
      throw "invalid arguments";
    }
  }
  
  checkLegality = (cell) => {
    //TODO - move rules are a range. incorporate that.
    let isLegal = false;
    let moverules = this.state.piecesObject[this.state.selectedPiece].rules.move;
    let pieceCoordinates = [this.state.piecesObject[this.state.selectedPiece].xC, this.state.piecesObject[this.state.selectedPiece].yC];
    let difference = [cell[0] - pieceCoordinates[0], cell[1] - pieceCoordinates[1]];

    let moveRanges = new Array(moverules.length);
   
    moverules.forEach((ruleset, i) => {
      let newrange = new Array(ruleset.length);
   
      ruleset.forEach((limit, j) => {
        try{
          if(limit > 0){
            newrange[j] = this.createRange(0,limit);
          } else if (limit < 0){
            newrange[j] = this.createRange(limit,0);
          } else {
            newrange[j] = [0];
          }
        } catch(err) {
          console.log(err)
        }
      })
      moveRanges[i] = newrange;
    })

    // I have my ranges, now I just need to check if the difference is within those ranges. 
    moveRanges.forEach((ruleset, i) => {
      let truthArr = [false, false];
      ruleset.forEach((domain, j) => {
        if(domain.includes(difference[j])){
          truthArr[j] = true;
        }
        if(truthArr[0] && truthArr[1]){
          isLegal = true;
        }
      })
    })
    
    return isLegal;
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

    return(
      <div style={outerStyle}>
        <div id="tile-container" style={tileContainerStyle}>
          {boardTiles}
        </div>
        <div id="pieces-container" style={piecesContainerStyle} >
          {pieceObjects}
        </div>
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
                rules={this.state.piecesObject[name]}
                actualrules={rules(name)}
                key={name}
                name={name}
                size={TILESIZE}
                border={this.state.selectedPiece}
                onClick={this.pieceClick} />
    });
  }
}

export default TestBoard;