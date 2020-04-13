import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./TestBoard.css";
import {INIT_SETUP, BOARDDIMENSIONS, TILESIZE, TILEBORDERSIZE, LIGHT_TILE, DARK_TILE} from "./CONSTANTS";

class TestBoard extends Component{
    constructor(props){
        super(props);

        //create checkerboard
        let tileBool = true;
        let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
            return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
                tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
                return tileBool? LIGHT_TILE : DARK_TILE;
            })
        })

        this.state = {
            boardDimensions: BOARDDIMENSIONS,
            tileSize: TILESIZE,
            tileBorderSize: TILEBORDERSIZE,
            pieces: INIT_SETUP,
            tileArr,
            selectedPiece: ""
        }
    }

    //TODO - CHECK FOR LEGAL MOVES
    tileClick = (e) => {
        //IF ACCIDENTALLY CLICKING A TILE
        if(this.state.selectedPiece.length === 0){
            return;
        }
        //IF MOVING A PIECE
        if(this.state.selectedPiece.length > 0){
            //get tile coordinates
            let rect = document.getElementById("pieces-container").getBoundingClientRect();
            let cell = [Math.floor((e.clientX - rect.left) / TILESIZE),Math.floor((e.clientY - rect.top) / TILESIZE)];
            //check if the move is legal
            //if legal, get piece
            let newPieces = [...this.state.pieces].map((piece, i) => {
                //change selected piece coordinates to tile coordinates
                if(piece.name === this.state.selectedPiece){
                    piece.xC = cell[0];
                    piece.yC = cell[1];
                }
                return piece;
            });
            this.setState({pieces: newPieces, selectedPiece: ""});
            
            //TODO - if illegal, handle it
        } 
    }

    //TODO - implement attacks
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
        // else if(this.state.selectedPiece.length > 0 && name !== this.state.selectedPiece){

        // }
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
        let pieces = this.state.pieces.map((piece, i) => {
            // console.log(piece);
            return <Piece 
                key={piece.name}
                data={piece}
                size={TILESIZE}
                border={piece.name === this.state.selectedPiece ? "1px solid yellow" : ""}
                onClick={this.pieceClick} />
        })

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
                    {pieces}
                </div>
            </div>
          
        )
    }
}

export default TestBoard;