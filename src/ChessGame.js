import React, {Component} from "react";
import Piece from "./Piece";
import CanvasChessBoard from "./CanvasChessBoard";
import ChessGraveyard from "./ChessGraveyard";
import {PromotionMenu} from "./PromotionMenu";
import {
  BOARDDIMENSIONS,
  TILESIZE,
  TILEBORDERSIZE, 
  PIECE_OBJECTS,
  PIECE_PATHS,
  PIECE_PROTOTYPES,
  PIECE_SVG,
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

    let [ piecesObject, cellMap, pieceNumbering ] = this.gameSetup();

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE,
      tileBorderSize: TILEBORDERSIZE,
      cellMap,
      piecesObject,
      wGraveyard: {},
      bGraveyard: {},
      turn: true,
      selectedPiece: "",
      enPassantPiece: "",
      messageBoard: "no piece selected",
      pawnPromotionFlag: false,
      pieceNumbering,
      prevTurn: {}
    }
  }

  // ===================================================
  // ================ EVENT HANDLERS ===================

  // this function decides why a user clicked a tile and then calls the appropriate function
  // calls tryMoving, processCastling, processEnPassant, illegalMove
  tileClick = (e) => {
    // console.log("tileclick");
    let { selectedPiece, piecesObject } = this.state;

    // Accidental, or clicking a tile while no piece selected
    if(selectedPiece.length === 0){
      return;
    }

    // a piece is already selected, user wants to move here
    if(selectedPiece.length > 0){
      
      //!!!!!!!!!!!!
      // this is referencing the abstract pieces container rather than the board
      // it works, but i can see this causing problems later... 
      let rect = document.getElementById("pieces-container").getBoundingClientRect();
      let cell = [ Math.floor((e.clientX - rect.left) / TILESIZE) , Math.floor((e.clientY - rect.top) / TILESIZE) ];
      let cellString = `${cell[0]},${cell[1]}`;
      
      //MOVING
      if(piecesObject[selectedPiece].view[cellString] && piecesObject[selectedPiece].view[cellString] === "m"){
        this.tryMoving(cell);
      }
      //CASTLING
      else if(piecesObject[selectedPiece].view[cellString] && piecesObject[selectedPiece].view[cellString] === "c"){
        this.processCastling(cell);
      }
      //ENPASSANT
      else if(piecesObject[selectedPiece].view[cellString] && piecesObject[selectedPiece].view[cellString] === "e"){
        this.processEnPassant(cell);
      }
      //ILLEGAL MOVE
      else{
        this.illegalMove("Illegal Move");
      } 
    } 
  }


  // determines why the user clicked a piece and then calls the appropriate function
  // calls setState (*2), illegalMove (*2), tryAttacking
  pieceClick = (e, name) => {
    let { selectedPiece, piecesObject, turn } = this.state;

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
        this.illegalMove("Illegal selection, try again")
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
        this.illegalMove("Illegal attack");
      }
    } 
    //error
    else {
      console.log("something is wrong in pieceClick");
    }
  }


  

  // ===================================================
  // =================== TESTERS =======================

  // tests and completes attacks
  // calls recursiveStateCopy, buildCellMap, isMyKingInCheck, turnMaintenance, illegalMove
  tryAttacking = (targetCell, targetPieceName) => {
    let {selectedPiece, piecesObject, cellMap} = this.state;
    let wGraveyard = {...this.state.wGraveyard};
    let bGraveyard = {...this.state.bGraveyard};

    //make a copy of state and carry out the attack
    let newPiecesObject = this.recursiveStateCopy(piecesObject);
    
    [newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y]  = targetCell;
    let targetPiece = cellMap[`${targetCell[0]},${targetCell[1]}`];
    
    if(targetPiece.charAt(0) === "w"){
      wGraveyard[targetPiece] = {...newPiecesObject[targetPiece]};
      wGraveyard[targetPiece].dead = true;
    }
    else if(targetPiece.charAt(0) === "b"){
      bGraveyard[targetPiece] = {...newPiecesObject[targetPiece]};
      bGraveyard[targetPiece].dead = true;
    }
    delete newPiecesObject[targetPiece];
    let newCellMap = this.buildCellMap(newPiecesObject);

    if(!this.isMyKingInCheck( newPiecesObject, newCellMap )){
      let message = `${selectedPiece} attacked ${targetPieceName}`;

      this.turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece, wGraveyard, bGraveyard);
    }

    else{
      this.illegalMove("that attack puts your king in check");
    }
  }


  // tests and completes moves
  // calls recursiveStateCopy, buildCellMap, isMyKingInCheck, pawnBeingPromoted, turnMaintenance, illegalMove
  tryMoving = (cell) => {
    let {selectedPiece, piecesObject} = this.state;
    let newPiecesObject = this.recursiveStateCopy(piecesObject);
    // let newPiecesObject = JSON.parse(JSON.stringify(piecesObject));
    [newPiecesObject[selectedPiece].x, newPiecesObject[selectedPiece].y] = cell;
    
    //test whether move puts own king in check
    let newCellMap = this.buildCellMap(newPiecesObject);
    let isKingInCheck = this.isMyKingInCheck( newPiecesObject, newCellMap );
    if(!isKingInCheck){
    
      //test for pawn promotion
      if((/^wP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 0 ) || (/^bP/.test(selectedPiece) && newPiecesObject[selectedPiece].y === 7)){

        this.pawnBeingPromoted(newPiecesObject, newCellMap);
        return;
      }
    
      let message = `${selectedPiece} moved to ${cell[0]},${cell[1]}`;
      
      this.turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece);
    }

    else{
      this.illegalMove("you're endangering your king...");
    }
  }


  // tests if the king on the team of the currently selected piece is in check
  // used to test if a move or attack is safe
  // returns boolean
  isMyKingInCheck = ( piecesObject, cellMap ) => {

    const kingName = this.state.turn ? "wK" : "bK";
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

    //test bishop and diagonal queen attacks
    bishopPaths.forEach(path => {
      let startX = kingX + path[0];
      let startY = kingY + path[1];

      for(
        let i = startX, j = startY, pathDone = false; 
        !pathDone && 
        i < BOARDSIZE && j < BOARDSIZE && 
        i >= 0 && j >= 0;
        i += path[0], j += path[1]){

        //if the tested cell is occupied by either an enemy queen or bishop, stop checking
        if(cellMap[`${i},${j}`] && (queenReg.test(cellMap[`${i},${j}`]) || bishReg.test(cellMap[`${i},${j}`]))){
          pathDone = true;
          inCheckFlag = true;
          return;
        }
        //if the tested cell is occupied, but not by an enemy queen or bishop, this path is done but continue checking other paths
        else if(cellMap[`${i},${j}`]){
          pathDone = true;
        }
      }
    });

    //if it's proven that the king is being attacked, then no need to continue checking
    if(!inCheckFlag){

      //test for rook and horizontal/vertical queen attacks
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
              pathDone = true;
              inCheckFlag = true;
              return;
            }
            else if(cellMap[`${i},${j}`]){
              pathDone = true;
            }
  
          }
      });

    }

    //test for enemy pawn attacks
    if(!inCheckFlag){
      pawnPaths.forEach(path => {
        let cellTest = `${kingX - path[0]},${kingY - path[1]}`;
  
        if(cellMap[cellTest] && pawnReg.test(cellMap[cellTest])){
          inCheckFlag = true;
          return;
        }
      });

    }

    //test for knight attacks
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


  // ===================================================
  // ================== STATE SETTERS ==================

  // called when a pawn reaches their 8th rank; flags the pawn promotion menu to appear
  // calls setState
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


  // swaps a pawn with a piece of the users choice
  // calls recursiveStateCopy, createPiece, buildCellMap, updatePieceVision, setState
  promotePawn = ( newPieceType ) => {
    let pieceNumbering = { ...this.state.pieceNumbering };
    let { selectedPiece, piecesObject } = this.state;

    let newPieceTeam = selectedPiece.charAt(0);
    let newPiecesObject = this.recursiveStateCopy(piecesObject);

    pieceNumbering[`${newPieceTeam}${newPieceType}`] += 1;

    // a pieces name is made up of team, type, and number, to differentiate them in state
    let newPiece = this.createPiece(
                    newPieceType,
                    newPieceTeam,
                    newPiecesObject[selectedPiece].x,
                    newPiecesObject[selectedPiece].y,
                    pieceNumbering
                  );

    delete newPiecesObject[selectedPiece];
    newPiecesObject[newPiece.name] = newPiece;

    let newCellMap = this.buildCellMap(newPiecesObject);
    let messageBoard = `${selectedPiece} has been promoted to ${newPiece.name}`;

    // newPiecesObject = this.updatePieceVision(newPiecesObject, cellMap);
    for(const piece in newPiecesObject){
      newPiecesObject[piece].view = this.pieceVisionSwitch(newPiecesObject, newCellMap, piece);
    };
    
    this.setState({
      piecesObject: newPiecesObject,
      cellMap: newCellMap,
      selectedPiece: "",
      pawnPromotionFlag: false,
      messageBoard,
      pieceNumbering,
      turn: !this.state.turn
    });
  }

  // sets firstmove and enpassant flags, initiates vision update
  // calls updatePieceVision, pieceVisionSwitch, setState
  turnMaintenance = ( newPiecesObject, newCellMap, message, selectedPiece, wGraveyard = this.state.wGraveyard, bGraveyard = this.state.bGraveyard ) => {

    let enPassantPiece = "";

    //if the piece has a firstMove prop, flip it
    if(newPiecesObject[selectedPiece].firstMove){
      newPiecesObject[selectedPiece].firstMove = false;

      //if it's a pawn and it just had a double move, flag for enpassant attacks
      if(/^(w|b)P/.test(selectedPiece) && (newPiecesObject[selectedPiece].y === 4 || newPiecesObject[selectedPiece].y === 3)){
        enPassantPiece = selectedPiece;
      }
    }

    //update piece views
    // newPiecesObject = this.updatePieceVision(newPiecesObject, newCellMap, enPassantPiece);
    for(const piece in newPiecesObject){
      newPiecesObject[piece].view = this.pieceVisionSwitch(newPiecesObject, newCellMap, piece, enPassantPiece);
    }

    this.setState({
      piecesObject: newPiecesObject, 
      cellMap: newCellMap, 
      selectedPiece: "", 
      messageBoard: message, 
      enPassantPiece, 
      wGraveyard, 
      bGraveyard
    });
  }


  // called when a move or attack is illegal
  // erases selection, sets messageboard text
  // calls setState
  illegalMove = (messageBoard) => {
    this.setState({
      messageBoard,
      selectedPiece: ""
    });
  }


  // ===================================================
  // =================== MUTATORS ======================

  // KingClass.vision performs it's own "amIChecked" calls... does it make sense for that to happen in KingClass AND in ChessGame? 
  // calls recursiveStateCopy, buildCellMap, turnMaintenance
  processCastling = (cell) => {
    let {selectedPiece, piecesObject} = this.state;
    let rookName;
    let newPiecesObject = this.recursiveStateCopy(piecesObject);

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

    this.turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece);
  }


  // processes enPassant
  // calls recursiveStateCopy, buildCellMap, turnMaintenance
  processEnPassant = (cell) => {
    let {piecesObject, selectedPiece, enPassantPiece} = this.state;
    
    let message = `${selectedPiece} just attacked ${enPassantPiece} in passing`;
    let newPiecesObject = this.recursiveStateCopy(piecesObject);

    newPiecesObject[selectedPiece].x = cell[0];
    newPiecesObject[selectedPiece].y = cell[1];
    newPiecesObject[enPassantPiece].dead = true;

    let newCellMap = this.buildCellMap(newPiecesObject);

    this.turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece);

  }

  
  // calls makeLivePieces, makeDeadPieces
  render(){

    let { boardDimensions, tileSize, messageBoard, turn, selectedPiece } = this.state;

    //GENERATE PIECES
    let pieceObjects = this.makeLivePieces();
    let [ wGraveyard, bGraveyard ] = this.makeDeadPieces();

    let theMenu = this.state.pawnPromotionFlag ? <PromotionMenu selectPiece={this.promotePawn} team={selectedPiece.charAt(0)} /> : "";

    //STYLES
    let piecesContainerStyle = {
      width: `${boardDimensions[0] * tileSize}px`,
      height: `${boardDimensions[1] * tileSize}px`,
    }

    return(
      <div id="game-container" >
        {theMenu}
        <h2 id="turn-board" >
          {turn ? "White turn" : "Black turn"}
        </h2>
        <CanvasChessBoard onClick={this.tileClick} />
        <div id="pieces-container" style={piecesContainerStyle} >
          {pieceObjects}
        </div>
        <h3 id="message-board" >{messageBoard}</h3>
        <ChessGraveyard pieces={wGraveyard} idString="wGraveyard" />
        <ChessGraveyard pieces={bGraveyard} idString="bGraveyard" />
      </div>
    )
  } 
  
  
  // ===================================================
  // ==================== CREATORS =====================

  // creates a new piece with given arguments
  // returns object representing a piece
  createPiece = (type, team, x, y, pieceNumbering) => {

    let newPiece = {...PIECE_PROTOTYPES[type]};
    newPiece.pngPos = team === "w" ? PIECE_PROTOTYPES[type].WpngPos : PIECE_PROTOTYPES[type].BpngPos;
    delete newPiece.WpngPos;
    delete newPiece.BpngPos;

    if(type === "pawn"){
      newPiece.fifthRank = team === "w" ? WfifthRank : BfifthRank;
    }

    let unitNumber = pieceNumbering[`${team}${type}`] + 1;
    newPiece.x = x;
    newPiece.y = y;
    newPiece.name = `${team}${type}${unitNumber}`;
    newPiece.paths = PIECE_PATHS[type];

    return newPiece;
  }


  // cellMap is used to lookup pieces by occupied cell coordinates rather than their name
  // returns new cellMap object
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


  // initial game setup
  // calls buildCellMap and updatePieceVision
  // returns an array of three objects which make up initial game state
  gameSetup = () => {
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
    //will eventually phase this out
    let newPiecesObject = PIECE_OBJECTS;
    Object.keys(newPiecesObject).forEach((piece, i) => {

      switch(true){
        case /^(w|b)Q/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["Q"]; pieceNumbering[`${piece.charAt(0)}Q`] += 1;
          break;
        case /^(w|b)K/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["K"]; 
          break;
        case /^(w|b)B/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["B"]; pieceNumbering[`${piece.charAt(0)}B`] += 1;
          break;
        case /^(w|b)R/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["R"]; pieceNumbering[`${piece.charAt(0)}R`] += 1;
          break;
        case /^wP/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["wP"]; pieceNumbering[`${piece.charAt(0)}P`] += 1;
          break;
        case /^bP/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["bP"]; pieceNumbering[`${piece.charAt(0)}P`] += 1;
          break; 
        case /^(w|b)N/.test(piece): newPiecesObject[piece].paths = PIECE_PATHS["N"]; pieceNumbering[`${piece.charAt(0)}N`] += 1;
          break;
        default: console.log("something went wrong while assigning paths");
      }
    });

    //cellMap is used for piece name lookup by cell
    let newCellMap = this.buildCellMap(newPiecesObject);

    //build the view properties of each piece
    // newPiecesObject = this.updatePieceVision(newPiecesObject, cellMap);
    for(const piece in newPiecesObject){
      newPiecesObject[piece].view = this.pieceVisionSwitch(newPiecesObject, newCellMap, piece);
    };

    return [ newPiecesObject, newCellMap, pieceNumbering ];
  }


  // makes pieces for the render method
  // returns an array of piece components
  makeLivePieces = () => {
    let { piecesObject, selectedPiece } = this.state;
    let livePieces = [];

    Object.keys(piecesObject).forEach((name, i) => {
      livePieces.push(
        <Piece 
          x={piecesObject[name].x}
          y={piecesObject[name].y}
          dead={piecesObject[name].dead}
          key={name}
          name={name}
          size={TILESIZE}
          border={selectedPiece}
          onClick={this.pieceClick} />
      );
    });
    return livePieces;
  }


  // makes pieces for the white and black graveyards
  // returns an array, contains two arrays, each made of piece components
  makeDeadPieces = () => {
    let { wGraveyard, bGraveyard } = this.state;
    let wPieces = [];
    let bPieces = [];
    let wGraveyardKeys = Object.keys(wGraveyard);
    let bGraveyardKeys = Object.keys(bGraveyard);

    if(wGraveyardKeys.length > 0){
      wGraveyardKeys.forEach(name => {
        wPieces.push(
          <Piece
            x={wGraveyard[name].x}
            y={wGraveyard[name].y}
            dead={wGraveyard[name].dead}
            key={name}
            name={name}
            size={TILESIZE} />
        );
      });
    }

    if(bGraveyardKeys.length > 0){
      bGraveyardKeys.forEach(name => {
        bPieces.push(
          <Piece
            x={bGraveyard[name].x}
            y={bGraveyard[name].y}
            dead={bGraveyard[name].dead}
            key={name}
            name={name}
            size={TILESIZE} />
        )
      });
    }
    return [wPieces, bPieces];
  }

  // deep copies state, gets all recursive about it
  // may need modifying if state structure is altered in the future
  // calls recursiveStateCopy
  // returns object representing piece state
  recursiveStateCopy = (oldstate) => {
    let newState = {};
    let oldstateKeys = Object.keys(oldstate);

    if(oldstateKeys.length > 0){
      oldstateKeys.forEach(key => {
        // recursive copy objects 
        if(typeof(oldstate[key]) === "object" && !Array.isArray(oldstate[key])){
          newState[key] = this.recursiveStateCopy(oldstate[key]);
        }
        // copy up to 2d arrays with map
        else if(typeof(oldstate[key]) === "object" && Array.isArray(oldstate[key])){
          newState[key] = oldstate[key].map(value => {
            if(Array.isArray(value)){
              return value.map(subvalue => subvalue);
            }
            else return value;
          });
        }
        // copy strings
        else if(typeof(oldstate[key]) === "string"){
          newState[key] = `${oldstate[key]}`;
        }
        // copy primitives
        else {
          newState[key] = oldstate[key];
        }
      });
    }
    // i dont think this is necessary...
    else{
      newState = {...oldstate};
    }
    return newState;
  }


  // switch statement wrapper
  // returns an object representing a pieces view
  pieceVisionSwitch = (piecesObject, cellMap, pieceName, enPassantPiece = "") => {
    switch(true){
      case /^(w|b)Q/.test(pieceName): return QueenClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)K/.test(pieceName): return KingClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)B/.test(pieceName): return BishopClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)N/.test(pieceName): return KnightClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)R/.test(pieceName): return RookClass.vision(cellMap, piecesObject, pieceName);
      case /^(w|b)P/.test(pieceName): return PawnClass.vision(cellMap, piecesObject, pieceName, enPassantPiece);
      default: console.log("something went wrong in updatepiecevision");
    }
  }
}

export default ChessGame;
