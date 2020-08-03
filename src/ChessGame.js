//TODO - rename piecesObject to piecesLedger or something similar
//TODO - Explore updating just an individual piece rather than the whole pieceLedger
import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import ChessGraveyard from "./ChessGraveyard";
import {PromotionMenu} from "./PromotionMenu";
import {
  BOARDDIMENSIONS, 
  TILESIZE, 
  TILEBORDERSIZE, 
  LIGHT_TILE, 
  DARK_TILE,
  PIECE_OBJECTS,
  PIECEPATHS,
  PIECE_PROTOTYPES,
  PP_TEST,
  EN_PASSANT_TEST
} from "./CONSTANTS";

import "./ChessGame.css";
import "./PromotionMenu.css";


import KingClass from "./pieceData/KingClass";
import QueenClass from "./pieceData/QueenClass";
import RookClass from "./pieceData/RookClass";
import PawnClass from "./pieceData/PawnClass";
import BishopClass from "./pieceData/BishopClass";
import KnightClass from "./pieceData/KnightClass";

class ChessGame extends Component{
  constructor(props){
    super(props);

    let [tileArr, cellMap, piecesObject, pieceNumbering] = this.gameSetup();

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      tileArr,
      cellMap,
      piecesObject,
      turn: true,
      selectedPiece: "",
      enPassantPiece: "",
      messageBoard: "no piece selected",
      pawnPromotionFlag: false,
      pieceNumbering
    }
  }

  promotePawn = (newPieceType) => {
    let newPieceTeam = this.state.selectedPiece.charAt(0);
    let newPiecesObject = this.properCopyState(this.state.piecesObject);
    let {selectedPiece} = this.state;
    let pieceNumbering = {...this.state.pieceNumbering};
    pieceNumbering[`${newPieceTeam}${newPieceType}`] += 1;

    let newPiece = this.createPiece(
                    newPieceType,
                    newPieceTeam,
                    newPiecesObject[selectedPiece].x,
                    newPiecesObject[selectedPiece].y
                  );
    delete newPiecesObject[selectedPiece];
    newPiecesObject[newPiece.name] = newPiece;
    let cellMap = this.buildCellMap(newPiecesObject);
    let messageBoard = `${selectedPiece} has been promoted to ${newPiece.name}`;

    newPiecesObject = this.updatePieceVision(newPiecesObject, cellMap);
    

    this.setState({
      piecesObject: newPiecesObject,
      cellMap,
      selectedPiece: "",
      pawnPromotionFlag: false,
      messageBoard,
      pieceNumbering,
      turn: !this.state.turn
    });
    
  }

  createPiece = (type, team, x, y) => {
    
    let newPiece = {...PIECE_PROTOTYPES[type]};
    newPiece.pngPos = team === "w" ? PIECE_PROTOTYPES[type].WpngPos : PIECE_PROTOTYPES[type].BpngPos;
    if(type === "pawn"){
      newPiece.fifthRank = team === "w" ? WfifthRank : BfifthRank;
    }
    let unitNumber = this.state.pieceNumbering[`${team}${type}`] + 1;
    newPiece.x = x;
    newPiece.y = y;
    newPiece.name = `${team}${type}${unitNumber}`;
    newPiece.paths = PIECEPATHS[type];

    return newPiece;
  }


  buildCellMap = (piecesObject) => {
    let cellMap = {};
    let piecenames = Object.keys(piecesObject);
    piecenames.forEach((piece, i) => {
      if(!piecesObject[piece].dead){

        let coordinates = `${piecesObject[piece].x},${piecesObject[piece].y}`;
        cellMap[coordinates] = piece;
      }
    }) ;
    return cellMap;
  }


  properCopyState = (oldstate) => {
    let newState = {};
    let oldstateKeys = Object.keys(oldstate);
    oldstateKeys.forEach(key => {
      let secondLevelKeys = Object.keys(oldstate[key]);
      let subState = {};
      secondLevelKeys.forEach(property => {
        subState[property] = oldstate[key][property];
      });
      newState[key] = subState;
    });

    return newState;
  }


  //this calls a function on each piece that updates their own view property
  updatePieceVision = (piecesObject, cellMap, enPassantPiece = "") => {
    
    let pieceNames = Object.keys(piecesObject);

    for(let i = 0; i < pieceNames.length; i++){
      if(pieceNames[i].charAt(1) === "R"){
      }
      if(!piecesObject[pieceNames[i]].dead){
        switch(true){
          case /^(w|b)Q/.test(pieceNames[i]): piecesObject[pieceNames[i]].view = QueenClass.vision(cellMap, piecesObject, pieceNames[i]);
            break;
          case /^(w|b)K/.test(pieceNames[i]): piecesObject[pieceNames[i]].view = KingClass.vision(cellMap, piecesObject, pieceNames[i]);
            break;
          case /^(w|b)B/.test(pieceNames[i]): piecesObject[pieceNames[i]].view = BishopClass.vision(cellMap, piecesObject, pieceNames[i]);
            break;
          case /^(w|b)N/.test(pieceNames[i]): piecesObject[pieceNames[i]].view = KnightClass.vision(cellMap, piecesObject, pieceNames[i]);
            break;
          case /^(w|b)R/.test(pieceNames[i]): piecesObject[pieceNames[i]].view = RookClass.vision(cellMap, piecesObject, pieceNames[i]);
            break;
          case /^(w|b)P/.test(pieceNames[i]): piecesObject[pieceNames[i]].view = PawnClass.vision(cellMap, piecesObject, pieceNames[i], enPassantPiece);
            break;
          default: console.log("something went wrong in updatepiecevision");
        }
      }
    }
    return piecesObject;
  }


  //reasons to click an empty tile
  // - accidentally
  // - to move a selected piece
  // - - normal move
  // - - Castling
  // - - En Passant
  // - illegal move attempt
  tileClick = (e) => {
    let {selectedPiece, piecesObject} = this.state;
    //Clicking a tile while no piece selected
    if(selectedPiece.length === 0){
      return;
    }

    //Piece is selected, user wants to move here
    if(selectedPiece.length > 0){
      
      let rect = document.getElementById("pieces-container").getBoundingClientRect();
      let cell = [Math.floor((e.clientX - rect.left) / TILESIZE), Math.floor((e.clientY - rect.top) / TILESIZE)];
      let cellString = `${cell[0]},${cell[1]}`;
      
      //MOVING HERE
      if(piecesObject[selectedPiece].view[cellString] && piecesObject[selectedPiece].view[cellString] === "m"){
        this.tryMoving(cell);
      }
      //CASTLING HERE
      else if(piecesObject[selectedPiece].view[cellString] && piecesObject[selectedPiece].view[cellString] === "c"){
        this.processCastling(cell);
      }
      //ENPASSANT HERE
      else if(piecesObject[selectedPiece].view[cellString] && piecesObject[selectedPiece].view[cellString] === "e"){
        this.processEnPassant(cell);
      }
      else{
        console.log("Illegal Move");
        this.setState({selectedPiece: "", messageBoard: "illegal move"});
      } 
    } 
  }


  //reasons to click a piece:
  // - accidental
  // - to select
  // - to deselect
  // - to attack
  pieceClick = (e, name) => {
    let {selectedPiece, piecesObject, turn} = this.state;

    //if selecting a piece
    if(selectedPiece.length === 0){

      //check turn, then confirm selection and update piece.view
      if((turn && (/^w/.test(name))) || (!turn && (/^b/.test(name)))){

        this.setState({
          selectedPiece: name, 
          messageBoard: `piece ${name} is selected`
        });
      }
      //failed selection
      else {
        this.setState({messageBoard: "Illegal selection, try again"});
      }
    }
    //if deselecting a piece
    else if(selectedPiece === name){
      this.setState({
        selectedPiece: "", 
        messageBoard: "no piece selected"
      });
    }
    //if attacking a piece
    else if(selectedPiece.length > 0 && name.charAt(0) !== selectedPiece.charAt(0)){
      let targetCell = [piecesObject[name].x, piecesObject[name].y];

      //if the selected piece can see this cell, and the cell is verified for attacks...
      if(piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] && piecesObject[selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] === "a"){ 

        this.tryAttacking(targetCell, name);
      }
      //failed
      else {
        this.setState({
          selectedPiece: "", 
          messageBoard: "illegal attack"
        });
      }
    } 
    //error
    else {
      console.log("something is wrong in pieceClick");
    }
  }


  pawnBeingPromoted = (piecesObject, cellMap) => {
    let {selectedPiece} = this.state;
    let messageBoard = `${selectedPiece} is being promoted`;
    this.setState({
      piecesObject,
      cellMap,
      messageBoard,
      pawnPromotionFlag: true
    });
  }


  tryAttacking = (targetCell, targetPieceName) => {
    let {selectedPiece, piecesObject, cellMap} = this.state;
    //make a copy of state and carry out the attack
    let newPiecesObject = this.properCopyState(piecesObject);
    
    [newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y]  = targetCell;
    let targetPiece = cellMap[`${targetCell[0]},${targetCell[1]}`];
    newPiecesObject[targetPiece].dead = true;

    let newCellMap = this.buildCellMap(newPiecesObject);
    let isKingInCheck = this.ownKingNotInCheckBool(newPiecesObject, newCellMap, `${selectedPiece.charAt(0)}K`);
    if(!isKingInCheck){
      let message = `${selectedPiece} has successfully attacked ${targetPieceName}`;
      this.turnMaintenance(newPiecesObject, newCellMap, targetCell, message, selectedPiece, false);
    }

    else{
      console.log("that attack puts your king in check...");
    }
  }


  tryMoving = (cell) => {
    //setup new state
    let {selectedPiece, piecesObject} = this.state;
    let newPiecesObject = this.properCopyState(piecesObject);
    [newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y] = cell;
    
    //test whether move puts own king in check
    let newCellMap = this.buildCellMap(newPiecesObject);
    let isKingInCheck = this.ownKingNotInCheckBool(newPiecesObject, newCellMap, `${selectedPiece.charAt(0)}K`);
    if(!isKingInCheck){
      console.log("king not in check");
    
      //test for pawn promotion
      if((/^wP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 0 ) || (/^bP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 7)){

        return this.pawnBeingPromoted(newPiecesObject, newCellMap);
        
      }
    
      let message = `${selectedPiece} has successfully moved to ${cell[0]},${cell[1]}`;
      
      return this.turnMaintenance(newPiecesObject, newCellMap, cell, message, selectedPiece);
    }

    else{
      console.log("else condition reached!");
      this.setState({messageBoard: "that puts your king in check, try again"});
    }
  }


  //this will be hard coded so that I don't go insane thinking about it. Make it dynamic later
  //KingClass.vision performs it's own "amIChecked" calls... does it make sense for that to happen in KingClass AND in ChessGame? 
  processCastling = (cell) => {
    let {selectedPiece, piecesObject} = this.state;
    let rookName;
    let newPiecesObject = this.properCopyState(piecesObject);

    //shortside castling
    if(cell[0] === 2){
      rookName = selectedPiece.charAt(0) + "R1";
      newPiecesObject[rookName].x = 3;
      newPiecesObject[selectedPiece].x = 2;
      newPiecesObject[rookName].firstMove = false;
      newPiecesObject[selectedPiece].firstMove = false;
    }
    //longside castling
    else if(cell[0] === 6){
      rookName = selectedPiece.charAt(0) + "R2";
      newPiecesObject[rookName].x = 5;
      newPiecesObject[selectedPiece].x = 6;
      newPiecesObject[selectedPiece].firstMove = false;
      newPiecesObject[rookName].firstMove = false;
    }
    let newCellMap = this.buildCellMap(newPiecesObject);
    let message = `${selectedPiece} has castled with ${rookName}`;

    this.turnMaintenance(newPiecesObject, newCellMap, cell, message, selectedPiece, false);
  }


  processEnPassant = (cell) => {
    let {piecesObject, selectedPiece, enPassantPiece} = this.state;
    
    let message = `${selectedPiece} just attacked ${enPassantPiece} in passing`;
    let newPiecesObject = this.properCopyState(piecesObject);
    newPiecesObject[selectedPiece].x = cell[0];
    newPiecesObject[selectedPiece].y = cell[1];
    newPiecesObject[enPassantPiece].dead = true;
    let newCellMap = this.buildCellMap(newPiecesObject);

    this.turnMaintenance(newPiecesObject, newCellMap, cell, message, selectedPiece, false);

  }

  ownKingNotInCheckBool = (piecesObject, cellMap, kingName) => {

    const BOARDSIZE = 8;
    const enemyChar = kingName.charAt(0) === "w" ? "b" : "w";
    
    const bishopPaths = [[1,-1], [1,1], [-1,1], [-1,-1]];
    const rookPaths = [[0,-1], [1,0], [0,1], [-1,0]];
    const pawnPaths = [[-1,enemyChar === "w" ? -1 : 1], [1,enemyChar === "w" ? -1 : 1]];
    const knightPaths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2]];

    const queenReg = new RegExp("^" + enemyChar + "Q");
    const rookReg = new RegExp("^" + enemyChar + "R");
    const bishReg = new RegExp("^" + enemyChar + "B");
    const pawnReg = new RegExp("^" + enemyChar + "P");
    const knightReg = new RegExp("^" + enemyChar + "N");

    let kingX = piecesObject[kingName].x;
    let kingY = piecesObject[kingName].y;
    let inCheckFlag = false;

    bishopPaths.forEach(path => {
      let startX = kingX + path[0];
      let startY = kingY + path[1];

      for(
        let i = startX, j = startY, pathDone = false; 
        !pathDone && 
        i < BOARDSIZE && j < BOARDSIZE && 
        i >= 0 && j >= 0;
        i += path[0], j += path[1]){

        if(cellMap[`${i},${j}`] && (queenReg.test(cellMap[`${i},${j}`]) || bishReg.test(cellMap[`${i},${j}`]))){
          inCheckFlag = true;
          return;
        }
        else if(cellMap[`${i},${j}`]){
          pathDone = true;
        }
      }
    });

    if(!inCheckFlag){
      rookPaths.forEach(path => {
        let startX = kingX + path[0];
        let startY = kingY + path[1];
  
        for(
          let i = startX, j = startY, pathDone = false; 
          !pathDone && 
          i < BOARDSIZE && j < BOARDSIZE && 
          i >= 0 && j >= 0;
          i += path[0], j += path[1]){
            
            if(cellMap[`${i},${j}`] && (queenReg.test(cellMap[`${i},${j}`]) || rookReg.test(cellMap[`${i},${j}`]))){
              inCheckFlag = true;
              return;
            }
            else if(cellMap[`${i},${j}`]){
              pathDone = true;
            }
  
          }
      });

    }


    if(!inCheckFlag){
      pawnPaths.forEach(path => {
        let cellTest = `${kingX - path[0]},${kingY - path[1]}`;
  
        if(cellMap[cellTest] && pawnReg.test(cellMap[cellTest])){
          inCheckFlag = true;
          return;
        }
      });

    }

    if(!inCheckFlag){
      knightPaths.forEach(path => {
        let cellTest = `${kingX + path[0]},${kingY + path[1]}`;
  
        if(cellMap[cellTest] && knightReg.test(cellMap[cellTest])){
          inCheckFlag = true;
          return;
        }
      });
    }

    return inCheckFlag;
  }


  //might not be necessary for this to exist
  turnMaintenance = (newPiecesObject, newCellMap, cell, message, selectedPiece) => {

    let enPassantPiece = "";
    //if the piece has a firstMove prop, flip it
    if(newPiecesObject[selectedPiece].firstMove){
      newPiecesObject[selectedPiece].firstMove = false;
      //if it's a pawn and it just had a double move, flag for enpassant attacks
      if(/^(w|b)P/.test(selectedPiece) && (newPiecesObject[selectedPiece].y === 4 || newPiecesObject[selectedPiece].y === 3)){
        console.log("passed EP test, piece should be flagged now");
        enPassantPiece = selectedPiece;
      }
    }

    //update piece views
    newPiecesObject = this.updatePieceVision(newPiecesObject, newCellMap, enPassantPiece);

    this.customSetState(newPiecesObject, newCellMap, "", message, enPassantPiece);

  }


  //separated this preemptively, might not be necessary
  customSetState = (piecesObject, cellMap, selectedPiece, messageBoard, enPassantPiece) => {
    
    this.setState({
      piecesObject,
      cellMap,
      turn: !this.state.turn,
      selectedPiece,
      messageBoard,
      enPassantPiece
    });
  }

  
  render(){
    
    //GENERATE TILES
    let boardTiles = this.makeTiles();

    //GENERATE PIECES
    let [pieceObjects, graveyardPieces] = this.makePieces();
    let wGraveyard, bGraveyard;
    if(graveyardPieces.length > 0){
      wGraveyard = graveyardPieces.filter(piece => piece.props.name.charAt(0) === "w");
      bGraveyard = graveyardPieces.filter(piece => piece.props.name.charAt(0) === "b");
    }

    let theMenu = this.state.pawnPromotionFlag ? <PromotionMenu selectPiece={this.promotePawn} /> : <div>NO MENU</div>;

    //STYLES
    let tileContainerStyle = {
      width: `${this.state.boardDimensions[0] * this.state.tileSize}px`,
      height: `${this.state.boardDimensions[1] * this.state.tileSize}px`,
    }
   
    let piecesContainerStyle = {
      width: `${this.state.boardDimensions[0] * this.state.tileSize}px`,
      height: `${this.state.boardDimensions[1] * this.state.tileSize}px`,
    }   

    return(
      <div id="game-container" >
        {theMenu}
        <h2 id="turn-board" >{this.state.turn ? "White turn" : "Black turn"}</h2>
        <div id="middle-container">
          
        </div>
        <div id="tile-container" style={tileContainerStyle}>
          {boardTiles}
        </div>
        <div id="pieces-container" style={piecesContainerStyle} >
          {pieceObjects}
        </div>
        <h3 id="message-board" >{this.state.messageBoard}</h3>
        <ChessGraveyard pieces={wGraveyard} />
        <ChessGraveyard pieces={bGraveyard} />
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
    let {piecesObject, selectedPiece} = this.state;
    let livePieces = [];
    let deadPieces = [];
    Object.keys(piecesObject).forEach((name, i) => {
      if(!piecesObject[name].dead){
        livePieces.push(
          <Piece 
            x={piecesObject[name].x}
            y={piecesObject[name].y}
            dead={piecesObject[name].dead}
            pngPos={piecesObject[name].pngPos}
            key={name}
            name={name}
            size={TILESIZE}
            border={selectedPiece}
            onClick={this.pieceClick} />
        );
      }
      else {
        deadPieces.push(
          <Piece
            x={piecesObject[name].x}
            y={piecesObject[name].y}
            dead={piecesObject[name].dead}
            pngPos={piecesObject[name].pngPos}
            key={name}
            name={name}
            size={TILESIZE}
            border={selectedPiece}
            onClick={this.pieceClick} />
        )
      }
    });
    return [livePieces, deadPieces];
  }

  gameSetup = () => {
    //create checkerboard
    let tileBool = true;
    let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
      return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
        tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
        return tileBool? LIGHT_TILE : DARK_TILE;
      });
    });

    let pieceNumbering = {
      "wP": 0,
      "wR": 0,
      "wN": 0,
      "wB": 0,
      "wQ": 0,
      "bP": 0,
      "bR": 0,
      "bN": 0,
      "bB": 0,
      "bQ": 0
    };

    //declare pieces, give them their paths
    // let newPiecesObject = PIECE_OBJECTS;
    let newPiecesObject = EN_PASSANT_TEST;
    Object.keys(newPiecesObject).forEach((piece, i) => {

      switch(true){
        case /^(w|b)Q/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["Q"]; pieceNumbering[`${piece.charAt(0)}Q`] += 1;
          break;
        case /^(w|b)K/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["K"]; 
          break;
        case /^(w|b)B/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["B"]; pieceNumbering[`${piece.charAt(0)}B`] += 1;
          break;
        case /^(w|b)R/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["R"]; pieceNumbering[`${piece.charAt(0)}R`] += 1;
          break;
        case /^wP/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["wP"]; pieceNumbering[`${piece.charAt(0)}P`] += 1;
          break;
        case /^bP/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["bP"]; pieceNumbering[`${piece.charAt(0)}P`] += 1;
          break; 
        case /^(w|b)N/.test(piece): newPiecesObject[piece].paths = PIECEPATHS["N"]; pieceNumbering[`${piece.charAt(0)}N`] += 1;
          break;
        default: console.log("something went wrong while assigning paths");
      }
    });

    console.log("gamesetup, here's piece numbering");
    console.log(pieceNumbering);

    //cellMap is used for piece name lookup by cell
    let cellMap = this.buildCellMap(newPiecesObject);

    //build the view properties of each piece
    newPiecesObject = this.updatePieceVision(newPiecesObject, cellMap);

    return [tileArr, cellMap, newPiecesObject, pieceNumbering];
  }
}

export default ChessGame;
