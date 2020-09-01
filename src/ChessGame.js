import React, {Component} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import ChessGraveyard from "./ChessGraveyard";
import {PromotionMenu} from "./PromotionMenu";
import {
  BOARDDIMENSIONS, 
  TILESIZE, 
  TILEBORDERSIZE, 
  PIECE_OBJECTS,
  PIECEPATHS,
  PIECE_PROTOTYPES
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

    let [ piecesObject, cellMap, tileArr, pieceNumbering ] = this.gameSetup();

    this.state = {
      boardDimensions: BOARDDIMENSIONS,
      tileSize: TILESIZE, // unused
      tileBorderSize: TILEBORDERSIZE, // unused
      tileArr,
      cellMap,
      piecesObject,
      wGraveyard: {},
      bGraveyard: {},
      turn: true,
      selectedPiece: "",
      enPassantPiece: "",
      messageBoard: "CHESS!",
      pawnPromotionFlag: false,
      pieceNumbering,
      prevTurn: {},
      windowSize: ""
    }
  }


  // this function decides why a user clicked a tile and then calls the appropriate function
  // reasons a user would click a tile:
  // - accidentally
  // - to move a selected piece
  // - - normal move
  // - - Castling
  // - - En Passant
  // - illegal move attempt
  tileClick = (e) => {
    let { selectedPiece, piecesObject } = this.state;

    // Accidental, or clicking a tile while no piece selected
    if(selectedPiece.length === 0){
      return;
    }

    // a piece is already selected, user wants to move here
    if(selectedPiece.length > 0){
      
      let rect = document.getElementById("pieces-container").getBoundingClientRect();

      // In order for this game to dynamically scale, Tilesize needs to be dynamic
      // getTileSize checks the current window width and returns a dynamic tilesize
      let cell = [ Math.floor((e.clientX - rect.left) / this.getTileSize()) , Math.floor((e.clientY - rect.top) / this.getTileSize()) ];
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
  // reasons to click a piece:
  // - accidental
  // - to select
  // - to deselect
  // - to attack
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


  //tests and completes attacks
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


    let isKingInCheck = this.isMyKingInCheck( newPiecesObject, newCellMap );
    if(!isKingInCheck){
      let message = `${selectedPiece} attacked ${targetPieceName}`;

      this.turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece, wGraveyard, bGraveyard);
    }

    else{
      console.log("that attack puts your king in check...");
    }
  }


  // tests and completes moves
  tryMoving = (cell) => {
    let {selectedPiece, piecesObject} = this.state;
    let newPiecesObject = this.recursiveStateCopy(piecesObject);

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

  // swaps a pawn with a piece of the users choice
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


  // creates a new piece with given arguments
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
    newPiece.paths = PIECEPATHS[type];

    return newPiece;
  }


  // cellMap is used to lookup pieces by occupied cell coordinates rather than their name
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


  //this calls a function on each piece that updates their own view property
  updatePieceVision = (piecesObject, cellMap, enPassantPiece = "") => {
    
    let pieceNames = Object.keys(piecesObject);

    for(let i = 0; i < pieceNames.length; i++){
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


  // called when a pawn reaches their 8th rank
  // flags the pawn promotion menu to appear
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


  //this will be hard coded so that I don't go insane thinking about it. Make it dynamic later
  //KingClass.vision performs it's own "amIChecked" calls... does it make sense for that to happen in KingClass AND in ChessGame? 
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


  processEnPassant = (cell) => {
    let {piecesObject, selectedPiece, enPassantPiece} = this.state;
    let wGraveyard = {...this.state.wGraveyard};
    let bGraveyard = {...this.state.bGraveyard};
    
    let message = `${selectedPiece} just attacked ${enPassantPiece} in passing`;
    let newPiecesObject = this.recursiveStateCopy(piecesObject);

    newPiecesObject[selectedPiece].x = cell[0];
    newPiecesObject[selectedPiece].y = cell[1];

    if(enPassantPiece.charAt(0) === "w"){
      wGraveyard[enPassantPiece] = {...newPiecesObject[enPassantPiece]};
      wGraveyard[enPassantPiece].dead = true;
    }
    else if(enPassantPiece.charAt(0) === "b"){
      bGraveyard[enPassantPiece] = {...newPiecesObject[enPassantPiece]};
      bGraveyard[enPassantPiece].dead = true;
    }

    let newCellMap = this.buildCellMap(newPiecesObject);

    this.turnMaintenance(newPiecesObject, newCellMap, message, selectedPiece, wGraveyard, bGraveyard);
  }

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

      //test for linear queen and rook attacks
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


    if(!inCheckFlag){

      //test for enemy pawn attacks
      pawnPaths.forEach(path => {
        let cellTest = `${kingX - path[0]},${kingY - path[1]}`;
  
        if(cellMap[cellTest] && pawnReg.test(cellMap[cellTest])){
          inCheckFlag = true;
          return;
        }
      });

    }

    if(!inCheckFlag){

      //test for knight attacks
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


  // it might not be necessary for this to exist...
  // sets firstmove and enpassant flags, initiates vision update
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
    //not sure I'm handling this properly
    newPiecesObject = this.updatePieceVision(newPiecesObject, newCellMap, enPassantPiece);

    this.customSetState(newPiecesObject, newCellMap, "", message, enPassantPiece, wGraveyard, bGraveyard);
  }


  //separated this preemptively, might not be necessary
  customSetState = (piecesObject, cellMap, selectedPiece, messageBoard, enPassantPiece, wGraveyard, bGraveyard) => {
    
    this.setState({
      piecesObject,
      cellMap,
      turn: !this.state.turn,
      selectedPiece,
      messageBoard,
      enPassantPiece,
      wGraveyard,
      bGraveyard
    });
  }

  checkResize = () => {
    let currentWidth = window.innerWidth;
    let screenType;
    console.log(currentWidth);
    switch(true){
      case currentWidth > 1800: screenType = "big"; break;
      case currentWidth <= 1800 && currentWidth > 1200: screenType = "desktop"; break;
      case currentWidth <= 1200 && currentWidth > 900: screenType = "tab-land"; break;
      case currentWidth <= 900 && currentWidth > 600: screenType = "tab-port"; break;
      case currentWidth <= 600: screenType = "phone"; break;
      default: console.log("ERROR IN HANDLE RESIZE");
    }
    if(screenType !== this.state.windowSize){
      this.setState({windowSize: screenType});
    }
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.checkResize);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize');
  }

  render(){

    let { boardDimensions, messageBoard, turn, selectedPiece } = this.state;

    //GENERATE SCALING 
    let backgroundSize = this.getBackgroundSize();
    let tileSize = this.getTileSize();
    
    //GENERATE TILES
    let boardTiles = this.makeTiles(tileSize);

    //GENERATE PIECES
    let pieceObjects = this.makeLivePieces(tileSize, backgroundSize);
    let [ wGraveyard, bGraveyard ] = this.makeDeadPieces(tileSize, backgroundSize);

    let theMenu = this.state.pawnPromotionFlag ? <PromotionMenu selectPiece={this.promotePawn} team={selectedPiece.charAt(0)} /> : "";

    //STYLES
    let tileContainerStyle = {
      width: `${boardDimensions[0] * tileSize}px`,
      height: `${boardDimensions[1] * tileSize}px`,
    }
   
    let piecesContainerStyle = {
      width: `${boardDimensions[0] * tileSize}px`,
      height: `${boardDimensions[1] * tileSize}px`,
    }   

    return(
      <div id="game-container" >
        {theMenu}
        <h2 id="turn-board" >{turn ? "White turn" : "Black turn"}</h2>
        <div id="tile-container" style={tileContainerStyle}>
          {boardTiles}
        </div>
        <div id="pieces-container" style={piecesContainerStyle} >
          {pieceObjects}
        </div>
        <h3 id="message-board" >{messageBoard}</h3>
        <ChessGraveyard pieces={wGraveyard} idString="wGraveyard" />
        <ChessGraveyard pieces={bGraveyard} idString="bGraveyard" />
      </div>
    )
  }


  // erases selection, sets messageboard text
  illegalMove = (messageBoard) => {
    this.setState({
      messageBoard,
      selectedPiece: ""
    });
  }


  //makes board tiles 
  makeTiles = (tileSize) => {
    
    return new Array(this.state.boardDimensions[0]).fill().map((column, i) => {
      return new Array(this.state.boardDimensions[1]).fill().map((tile,j) => {
        return <Tile
                  key={`tile-${i}-${j}`} 
                  size={tileSize} 
                  borderColour="red" 
                  classString={this.state.tileArr[i][j]}
                  borderSize={this.state.tileBorderSize} 
                  onClick={this.tileClick} />
      });
    });
  }


  //makes pieces for the render method
  makeLivePieces = (tileSize, backgroundSize) => {
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
          size={tileSize}
          backgroundSize={backgroundSize}
          border={selectedPiece}
          onClick={this.pieceClick} />
      );
    });
    return livePieces;
  }


  makeDeadPieces = (tileSize, backgroundSize) => {
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
            backgroundSize={backgroundSize}
            size={tileSize} />
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
            backgroundSize={backgroundSize}
            size={tileSize} />
        )
      });
    }

    return [wPieces, bPieces];

  }


  // deep copies state, gets all recursive about it
  // specifically only works with my current structure
  // if an array filled with objects is ever used in future versions of this app, I'll have to modify this
  recursiveStateCopy = (oldstate) => {
    let newState = {};
    Object.keys(oldstate).forEach(key => {
      if(typeof(oldstate[key]) === "object" && !Array.isArray(oldstate[key])){
        newState[key] = this.recursiveStateCopy(oldstate[key]);
      }
      else if(typeof(oldstate[key]) === "object" && Array.isArray(oldstate[key])){
        newState[key] = oldstate[key].map(value => {
          if(Array.isArray(value)){
            return value.map(subvalue => subvalue);
          }
          else return value;
        });
      }
      else if(typeof(oldstate[key]) === "string"){
        newState[key] = `${oldstate[key]}`;
      }
      else {
        newState[key] = oldstate[key];
      }
    });
    return newState;
  }


  //initial game setup
  gameSetup = () => {
    //create checkerboard
    let tileBool = true;
    let tileArr = new Array(BOARDDIMENSIONS[0]).fill().map((column, i) => {
      return column = new Array(BOARDDIMENSIONS[1]).fill().map((tile,j) => {
        tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool;
        // return tileBool? LIGHT_TILE : DARK_TILE;
        return tileBool? "light-tile tile" : "dark-tile tile";
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
    //will eventually phase this out
    let newPiecesObject = PIECE_OBJECTS;
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

    //cellMap is used for piece name lookup by cell
    let cellMap = this.buildCellMap(newPiecesObject);

    //build the view properties of each piece
    newPiecesObject = this.updatePieceVision(newPiecesObject, cellMap);

    return [ newPiecesObject, cellMap, tileArr, pieceNumbering ];
  }

  
  getTileSize = () => {
    /*
    ASSUMPTIONS: 
    - browser fontsize is set to default - 16px
    - dynamic scale styling is set up:
    - - html element font-size is set to 62.5% 
    - - 1rem therefore equals 10px, a nice round number 
    - I built the game with a TILESIZE of 60px
    - if the tilesize is 60 at 62.5%, then it would be 96 at 100%
    */

    const BASETILESIZE = 96;
    
    //big desktop
    if(window.innerWidth > 1800){
      return BASETILESIZE * 0.75;
    }
    //desktop
    else if(window.innerWidth > 1200 && window.innerWidth <= 1800){
      return BASETILESIZE * 0.625;
    }
    //tablet landscape
    else if(window.innerWidth <= 1200 && window.innerWidth > 900){
      return BASETILESIZE * 0.5625;
    }
    //tablet portrait
    else if(window.innerWidth <= 900 && window.innerWidth > 600){
      return BASETILESIZE * 0.5;
    }
    //phone
    else if(window.innerWidth <= 600){
      return BASETILESIZE * 0.4;
    }
  }

  getBackgroundSize = () => {
    /* 
    ASSUMPTIONS:
    - same assumptions as in getTileSize()
    - exception being that BACKGROUNDSIZE in each <Piece /> was set at 400 through development
    - at html font-size: 100%, BACKGROUNDSIZE would be 640
    */

    const BASEBACKGROUNDSIZE = 640;
    
    //big desktop
    if(window.innerWidth > 1800){
      return BASEBACKGROUNDSIZE * 0.75;
    }
    //desktop
    else if(window.innerWidth > 1200 && window.innerWidth <= 1800){
      return BASEBACKGROUNDSIZE * 0.625;
    }
    //tablet landscape
    if(window.innerWidth <= 1200 && window.innerWidth > 900){
      return BASEBACKGROUNDSIZE * 0.5625;
    }
    //tablet portrait
    else if(window.innerWidth <= 900 && window.innerWidth > 600){
      return BASEBACKGROUNDSIZE * 0.5;
    }
    //phone
    else if(window.innerWidth <= 600){
      return BASEBACKGROUNDSIZE * 0.4;
    }
  }
}

export default ChessGame;
