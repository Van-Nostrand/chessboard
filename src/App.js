import React, { Component } from 'react';
import './App.css';
import Tile from './Tile';
import Piece from './Piece';

const NUM_TILES = 64;
const DARK_TILE = "#B47B19";
const LIGHT_TILE = "#F1BE67";
const TILE_BORDER = "#765111";
const TILE_SIZE = 60;
const TILE_BORDER_SIZE = 1;
const BORDER_SIZE = 12;

let posFunc = function(x,y){
  return({
    left: x * (TILE_SIZE + TILE_BORDER_SIZE) + BORDER_SIZE,
    top: y * (TILE_SIZE + TILE_BORDER_SIZE) + BORDER_SIZE
  })
}

class App extends Component {
  constructor(props){
    super(props);

    //CREATE THE BOARD
    let boardArr = [];
    let boardBool = false;

    for(let i = 0; i < NUM_TILES; i++){
      if(!(i !== 0 && i % 8 === 0)){
        boardBool = !boardBool;
      }
      boardArr.push(boardBool ? LIGHT_TILE : DARK_TILE);
    }
    //DONE CREATING THE BOARD

    //Define the pieces, position the graphic properly
    let pieceArr = [
      {name: "wR1", pngPos: "-247px 0px", clicked: false, xC: 0, yC: 7},
      {name: "wR2", pngPos: "-247px 0px", clicked: false, xC: 7, yC: 7},
      {name: "wN1", pngPos: "-184px 0px", clicked: false, xC: 1, yC: 7},
      {name: "wN2", pngPos: "-184px 0px", clicked: false, xC: 6, yC: 7},
      {name: "wB1", pngPos: "-122px 0px", clicked: false, xC: 2, yC: 7},
      {name: "wB2", pngPos: "-122px 0px", clicked: false, xC: 5, yC: 7},
      {name: "wK", pngPos: "0px 0px", clicked: false, xC: 4, yC: 7},
      {name: "wQ", pngPos: "-61px 0px", clicked: false, xC: 3, yC: 7},
      {name: "wP1", pngPos: "-308px 0px", clicked: false, xC: 0, yC: 6},
      {name: "wP2", pngPos: "-308px 0px", clicked: false, xC: 1, yC: 6},
      {name: "wP3", pngPos: "-308px 0px", clicked: false, xC: 2, yC: 6},
      {name: "wP4", pngPos: "-308px 0px", clicked: false, xC: 3, yC: 6},
      {name: "wP5", pngPos: "-308px 0px", clicked: false, xC: 4, yC: 6},
      {name: "wP6", pngPos: "-308px 0px", clicked: false, xC: 5, yC: 6},
      {name: "wP7", pngPos: "-308px 0px", clicked: false, xC: 6, yC: 6},
      {name: "wP8", pngPos: "-308px 0px", clicked: false, xC: 7, yC: 6},
      {name: "bR1", pngPos: "-247px -63px", clicked: false, xC: 0, yC: 0},
      {name: "bR2", pngPos: "-247px -63px", clicked: false, xC: 7, yC: 0},
      {name: "bN1", pngPos: "-184px -63px", clicked: false, xC: 1, yC: 0},
      {name: "bN2", pngPos: "-184px -63px", clicked: false, xC: 6, yC: 0},
      {name: "bB1", pngPos: "-122px -63px", clicked: false, xC: 2, yC: 0},
      {name: "bB2", pngPos: "-122px -63px", clicked: false, xC: 5, yC: 0},
      {name: "bK", pngPos: "0px -63px", clicked: false, xC: 4, yC: 0},
      {name: "bQ", pngPos: "-61px -63px", clicked: false, xC: 3, yC: 0},
      {name: "bP1", pngPos: "-308px -63px", clicked: false, xC: 0, yC: 1},
      {name: "bP2", pngPos: "-308px -63px", clicked: false, xC: 1, yC: 1},
      {name: "bP3", pngPos: "-308px -63px", clicked: false, xC: 2, yC: 1},
      {name: "bP4", pngPos: "-308px -63px", clicked: false, xC: 3, yC: 1},
      {name: "bP5", pngPos: "-308px -63px", clicked: false, xC: 4, yC: 1},
      {name: "bP6", pngPos: "-308px -63px", clicked: false, xC: 5, yC: 1},
      {name: "bP7", pngPos: "-308px -63px", clicked: false, xC: 6, yC: 1},
      {name: "bP8", pngPos: "-308px -63px", clicked: false, xC: 7, yC: 1},
    ];

    this.state = {
      gameBoard: boardArr,
      pieces: pieceArr,
      currPiece: ""
    };

  }
  selectPiece = (e) => {
    let cP = e.target.getAttribute("name");
    let data = this.state.pieces.map((piece, i) => {
      if(cP === piece.name){
        piece.clicked = true;
      }
      return piece;
    })
    this.setState({pieces: data, currPiece: cP});
  }

  moveToTile = (e) => {
    let data = this.state.pieces.map((piece, i) => {
      if(this.state.currPiece === piece.name){
        piece.clicked = false;
        piece.xC = Math.floor((e.pageX - BORDER_SIZE) / (TILE_SIZE + TILE_BORDER_SIZE));
        piece.yC = Math.floor((e.pageY - BORDER_SIZE) / (TILE_SIZE + TILE_BORDER_SIZE));
      }
      return piece;
    })
    let cP = "";
    this.setState({pieces: data, currPiece: cP});
  }
  //TODO: implement piece killing
  handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    //if user is selecting a piece
    if(this.state.currPiece === "" && e.target.getAttribute("class") === "piece"){
      this.selectPiece(e);
    }
    //if a piece is selcted and user is selecting a tile as destination
    else if(this.state.currPiece.length > 0 && e.target.getAttribute("class") === "tile"){
      this.moveToTile(e);
    }
  }

  render() {
    let boardTiles = this.state.gameBoard.map((color, i) => (
      <Tile
        key={i}
        backgroundColor={color}
        borderC={TILE_BORDER}
        size={TILE_SIZE}
        onClick={this.handleClick} />
    ));
    let pieces = this.state.pieces.map((p, i) => (
      <Piece
        key={"piece" + i}
        name={p.name}
        xC={p.xC}
        yC={p.yC}
        absX={p.absX}
        absY={p.absY}
        pngPos={p.pngPos}
        clicked={p.clicked}
        onClick={this.handleClick}
        source={"url(" + require("./pieces.png") + ")"} />
    ));
    return (
      <div className="App">
        <div className="board-border">
          {boardTiles}
          {pieces}
        </div>

      </div>
    );
  }
}

export default App;

