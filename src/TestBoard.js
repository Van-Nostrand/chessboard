import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./TestBoard.css";

const BOARDDIMENSIONS = [8,8];
const TILESIZE = 50;
const TILEBORDERSIZE = 1;
const NUMBER_OF_PIECES = 16;
const INIT_SETUP = [
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

  const piecesObject = {
    "wR1": {pngPos: "-247px 0px", clicked: false, xC: 0, yC: 7},
    "wR2": {pngPos: "-247px 0px", clicked: false, xC: 7, yC: 7},
    "wN1": {pngPos: "-184px 0px", clicked: false, xC: 1, yC: 7},
    "wN2": {pngPos: "-184px 0px", clicked: false, xC: 6, yC: 7},
    "wB1": {pngPos: "-122px 0px", clicked: false, xC: 2, yC: 7},
    "wB2": {pngPos: "-122px 0px", clicked: false, xC: 5, yC: 7},
    "wK": {pngPos: "0px 0px", clicked: false, xC: 4, yC: 7},
    "wQ": {pngPos: "-61px 0px", clicked: false, xC: 3, yC: 7},
    "wP1": {pngPos: "-308px 0px", clicked: false, xC: 0, yC: 6},
    "wP2": {pngPos: "-308px 0px", clicked: false, xC: 1, yC: 6},
    "wP3": {pngPos: "-308px 0px", clicked: false, xC: 2, yC: 6},
    "wP4": {pngPos: "-308px 0px", clicked: false, xC: 3, yC: 6},
    "wP5": {pngPos: "-308px 0px", clicked: false, xC: 4, yC: 6},
    "wP6": {pngPos: "-308px 0px", clicked: false, xC: 5, yC: 6},
    "wP7": {pngPos: "-308px 0px", clicked: false, xC: 6, yC: 6},
    "wP8": {pngPos: "-308px 0px", clicked: false, xC: 7, yC: 6},
    "bR1": {pngPos: "-247px -63px", clicked: false, xC: 0, yC: 0},
    "bR2": {pngPos: "-247px -63px", clicked: false, xC: 7, yC: 0},
    "bN1": {pngPos: "-184px -63px", clicked: false, xC: 1, yC: 0},
    "bN2": {pngPos: "-184px -63px", clicked: false, xC: 6, yC: 0},
    "bB1": {pngPos: "-122px -63px", clicked: false, xC: 2, yC: 0},
    "bB2": {pngPos: "-122px -63px", clicked: false, xC: 5, yC: 0},
    "bK": {pngPos: "0px -63px", clicked: false, xC: 4, yC: 0},
    "bQ": {pngPos: "-61px -63px", clicked: false, xC: 3, yC: 0},
    "bP1": {pngPos: "-308px -63px", clicked: false, xC: 0, yC: 1},
    "bP2": {pngPos: "-308px -63px", clicked: false, xC: 1, yC: 1},
    "bP3": {pngPos: "-308px -63px", clicked: false, xC: 2, yC: 1},
    "bP4": {pngPos: "-308px -63px", clicked: false, xC: 3, yC: 1},
    "bP5": {pngPos: "-308px -63px", clicked: false, xC: 4, yC: 1},
    "bP6": {pngPos: "-308px -63px", clicked: false, xC: 5, yC: 1},
    "bP7": {pngPos: "-308px -63px", clicked: false, xC: 6, yC: 1},
    "bP8": {pngPos: "-308px -63px", clicked: false, xC: 7, yC: 1}
  }

class TestBoard extends Component{
    constructor(props){
        super(props);

        let tileBool = true;
        let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
            return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
                tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
                return tileBool? "#f98f39" : "#603d0b";
            })
        })

        this.state = {
            boardDimensions: BOARDDIMENSIONS,
            tileSize: TILESIZE,
            tileBorderSize: TILEBORDERSIZE,
            pieces: INIT_SETUP,
            tileArr
        }
    }

    tileClick = () => {
        console.log("tile has been clicked");
    }

    pieceClick = (name) => {
        console.log(`${name} has been clicked`);
    }

    render(){
        
        //TILES
        let boardTiles = new Array(this.state.boardDimensions[0]).fill().map((column, i) => {
            return column = new Array(this.state.boardDimensions[1]).fill().map((tile,j) => {
                return tile = <Tile 
                                key={`tile-${i}-${j}`} 
                                size={this.state.tileSize} 
                                borderColour="red" 
                                backgroundColor={this.state.tileArr[i][j]}
                                borderSize={this.state.tileBorderSize} 
                                onClick={this.tileClick} />
            });
        });

        //PIECES
        let pieces = this.state.pieces.map((piece, i) => 
            <Piece 
                key={piece.name}
                data={piece}
                size={TILESIZE}
                onClick={this.pieceClick} />
        )

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
            position: "absolute"
        }

        return(
            <div style={outerStyle}>
                <div id="tile-container" style={tileContainerStyle}>
                    {boardTiles}
                </div>
                <div id="pieces-container" style={piecesContainerStyle}>
                    {pieces}
                </div>
            </div>
          
        )
    }
}

export default TestBoard;