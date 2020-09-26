import React, {useState, useEffect, useReducer} from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import ChessGraveyard from "./ChessGraveyard";
import {PromotionMenu} from "./PromotionMenu";

import {
  BOARDDIMENSIONS, 
  PIECEPATHS,
  PIECE_PROTOTYPES
} from "./CONSTANTS";

import "./ChessGame.css";
import "./PromotionMenu.css";

import { gameSetup } from "./functions/gameSetup";
import { updatePieceVision } from  "./functions/updatePieceVision";
import { buildNewCellMap } from "./functions/buildNewCellMap";

const [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ] = gameSetup();

const initialState = {
  boardDimensions: BOARDDIMENSIONS,
  tileArr: initTileArr,
  cellMap: initialCellMap,
  piecesObject: initialPiecesObject,
  wGraveyard: {},
  bGraveyard: {},
  turn: true,
  selectedPiece: "",
  enPassantPiece: "",
  messageBoard: "CHESS!",
  pawnPromotionFlag: false,
  pieceNumbering: initialPieceNumbers,
  windowSize: "",
  screenType: ""
}

function reducer(state, action){
  switch(action.type){
    case "illegal":
      return {
        ...state,
        selectedPiece: "",
        messageBoard: action.message
      };
    case "selected":
      return {
        ...state,
        selectedPiece: action.name, 
        messageBoard: `piece ${action.name} is selected`
      };
    case "deselected":
      return {
        ...state,
        selectedPiece: "", 
        messageBoard: "no piece selected"
      };
    case "promoted":
      return {
        ...state,
        piecesObject: action.piecesObject, 
        cellMap: action.cellMap,
        messageBoard: action.messageBoard,
        pieceNumbering: action.pieceNumbering,
        selectedPiece: "",
        pawnPromotionFlag: false,
        turn: !state.turn
      };
    case "promoting":
      return {
        ...state,
        piecesObject: action.piecesObject,
        cellMap: action.cellMap,
        pawnPromotionFlag: true,
        messageBoard: `${state.selectedPiece} is being promoted`
      };
    case "maintenance":
      return {
        ...state,
        piecesObject: action.piecesObject, 
        cellMap: action.cellMap, 
        messageBoard: action.messageBoard, 
        enPassantPiece: action.enPassantPiece, 
        wGraveyard: action.wGraveyard, 
        bGraveyard: action.bGraveyard,
        selectedPiece: "",
        turn: !state.turn
      };
    case "windowWidthChange":
      return {
        ...state,
        windowSize: action.windowSize
      };
    case "screenBreakpoint":
      return {
        ...state,
        screenType: action.screenType,
        windowSize: action.windowSize
      };
    default:
      throw new Error("3RR0RZ");  
  }
}

export default function ChessGame() {

  const [ state, dispatch ] = useReducer(reducer, initialState);

  // this function decides why a user clicked a tile and then calls the appropriate function
  // reasons a user would click a tile:
  // - accidentally
  // - to move a selected piece
  // - - normal move
  // - - Castling
  // - - En Passant
  // - illegal move attempt
  const tileClick = (e) => {

    // Accidental, or clicking a tile while no piece selected
    if(state.selectedPiece.length === 0){
      return;
    }

    // a piece is already selected, user wants to move here
    if(state.selectedPiece.length > 0){
      
      let rect = document.getElementById("pieces-container").getBoundingClientRect();

      // In order for this game to dynamically scale, Tilesize needs to be dynamic
      // getTileSize checks the current window width and returns a dynamic tilesize
      let cell = [ Math.floor((e.clientX - rect.left) / getTileSize()) , Math.floor((e.clientY - rect.top) / getTileSize()) ];
      let cellString = `${cell[0]},${cell[1]}`;
      
      //MOVING
      if(state.piecesObject[state.selectedPiece].view[cellString] && state.piecesObject[state.selectedPiece].view[cellString] === "m"){
        tryMoving(cell);
      }
      //CASTLING
      else if(state.piecesObject[state.selectedPiece].view[cellString] && state.piecesObject[state.selectedPiece].view[cellString] === "c"){
        processCastling(cell);
      }
      //ENPASSANT
      else if(state.piecesObject[state.selectedPiece].view[cellString] && state.piecesObject[state.selectedPiece].view[cellString] === "e"){
        processEnPassant(cell);
      }
      //ILLEGAL MOVE
      else{
        illegalMove("Illegal Move");
      } 
    } 
  }


  // determines why the user clicked a piece and then calls the appropriate function
  // reasons to click a piece:
  // - accidental
  // - to select
  // - to deselect
  // - to attack
  const pieceClick = (e, name) => {

    //if selecting a piece
    if(state.selectedPiece.length === 0){

      //check turn, then confirm selection and update piece.view
      if((state.turn && (/^w/.test(name))) || (!state.turn && (/^b/.test(name)))){

        dispatch({type: "selected", name});
        
      }
      //failed selection
      else {
        illegalMove("Illegal selection, try again")
      }
    }
    //if deselecting a piece
    else if(state.selectedPiece === name){
      dispatch({type: "deselected"});
    }
    //if attacking a piece
    else if(state.selectedPiece.length > 0 && name.charAt(0) !== state.selectedPiece.charAt(0)){
      let targetCell = [state.piecesObject[name].x, state.piecesObject[name].y];

      //if the selected piece can see this cell, and the cell is verified for attacks...
      if(state.piecesObject[state.selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] && state.piecesObject[state.selectedPiece].view[`${targetCell[0]},${targetCell[1]}`] === "a"){ 

        tryAttacking(targetCell, name);
      }
      //failed
      else {
        illegalMove("Illegal attack");
      }
    } 
    //error
    else {
      console.log("something is wrong in pieceClick");
    }
  }


  //tests and completes attacks
  const tryAttacking = (targetCell, targetPieceName) => {
    
    let newWGraveyard = recursiveStateCopy(state.wGraveyard);
    let newBGraveyard = recursiveStateCopy(state.bGraveyard);

    //make a copy of state and carry out the attack
    let newPiecesObject = recursiveStateCopy(state.piecesObject);
    
    [ newPiecesObject[state.selectedPiece].x, newPiecesObject[state.selectedPiece].y ]  = targetCell;
    let targetPiece = state.cellMap[`${targetCell[0]},${targetCell[1]}`];
    
    if(targetPiece.charAt(0) === "w"){
      newWGraveyard[targetPiece] = {...newPiecesObject[targetPiece]};
      newWGraveyard[targetPiece].dead = true;
    }
    else if(targetPiece.charAt(0) === "b"){
      newBGraveyard[targetPiece] = {...newPiecesObject[targetPiece]};
      newBGraveyard[targetPiece].dead = true;
    }

    delete newPiecesObject[targetPiece];
    let newCellMap = buildNewCellMap(newPiecesObject);
    let isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap );

    if(!isKingInCheck){
      // SUCCESSFUL ATTACK!
      let message = `${state.selectedPiece} attacked ${targetPieceName}`;

      turnMaintenance(newPiecesObject, newCellMap, message, state.selectedPiece, newWGraveyard, newBGraveyard);
    }

    else{
      console.log("that attack puts your king in check...");
    }
  }


  // tests and completes moves
  const tryMoving = (cell) => {
    let newPiecesObject = recursiveStateCopy(state.piecesObject);

    [newPiecesObject[state.selectedPiece].x, newPiecesObject[state.selectedPiece].y] = cell;
    
    //test whether move puts own king in check
    let newCellMap = buildNewCellMap(newPiecesObject);
    let isKingInCheck = isMyKingInCheck( newPiecesObject, newCellMap );

    if(!isKingInCheck){
    
      //test for pawn promotion
      if((/^wP/.test(state.selectedPiece) && newPiecesObject[state.selectedPiece].y === 0 ) || (/^bP/.test(state.selectedPiece) && newPiecesObject[state.selectedPiece].y === 7)){

        pawnBeingPromoted(newPiecesObject, newCellMap);
        return;
      }
    
      let message = `${state.selectedPiece} moved to ${cell[0]},${cell[1]}`;
      
      turnMaintenance(newPiecesObject, newCellMap, message, state.selectedPiece);
    }

    else{
      illegalMove("you're endangering your king...");
    }
  }

  // swaps a pawn with a piece of the users choice
  const promotePawn = ( newPieceType ) => {
    let newPieceNumbering = recursiveStateCopy(state.pieceNumbering);
    
    let newPieceTeam = state.selectedPiece.charAt(0);
    let newPiecesObject = recursiveStateCopy(state.piecesObject);

    newPieceNumbering[`${newPieceTeam}${newPieceType}`] += 1;

    // a pieces name is made up of team, type, and number, to differentiate them in state
    let newPiece = createPiece(
                    newPieceType,
                    newPieceTeam,
                    newPiecesObject[state.selectedPiece].x,
                    newPiecesObject[state.selectedPiece].y,
                    newPieceNumbering
                  );

    delete newPiecesObject[state.selectedPiece];
    newPiecesObject[newPiece.name] = newPiece;

    let newCellMap = buildNewCellMap(newPiecesObject);
    let newMessageBoard = `${state.selectedPiece} has been promoted to ${newPiece.name}`;

    newPiecesObject = updatePieceVision(newPiecesObject, newCellMap);
    
    dispatch({
      type: "promoted",
      piecesObject: newPiecesObject,
      cellMap: newCellMap,
      messageBoard: newMessageBoard,
      pieceNumbering: newPieceNumbering
    });

  }


  // creates a new piece with given arguments
  const createPiece = (type, team, x, y, newPieceNumbering) => {

    let newPiece = {...PIECE_PROTOTYPES[type]};
    newPiece.pngPos = team === "w" ? PIECE_PROTOTYPES[type].WpngPos : PIECE_PROTOTYPES[type].BpngPos;
    delete newPiece.WpngPos;
    delete newPiece.BpngPos;

    if(type === "pawn"){
      newPiece.fifthRank = team === "w" ? WfifthRank : BfifthRank;
    }

    let unitNumber = newPieceNumbering[`${team}${type}`] + 1;
    newPiece.x = x;
    newPiece.y = y;
    newPiece.name = `${team}${type}${unitNumber}`;
    newPiece.paths = PIECEPATHS[type];

    return newPiece;
  }


  // called when a pawn reaches their 8th rank
  // flags the pawn promotion menu to appear
  const pawnBeingPromoted = (newPiecesObject, newCellMap) => {
    
    dispatch({
      type: "promoting",
      piecesObject: newPiecesObject,
      cellMap: newCellMap
    });
  }


  //this will be hard coded so that I don't go insane thinking about it. Make it dynamic later
  //KingClass.vision performs it's own "amIChecked" calls... does it make sense for that to happen in KingClass AND in ChessGame? 
  const processCastling = (cell) => {
    let rookName;
    let newPiecesObject = recursiveStateCopy(state.piecesObject);

    //shortside castling
    if(cell[0] === 2){
      rookName = state.selectedPiece.charAt(0) + "R1";
      newPiecesObject[rookName].x = 3;
      newPiecesObject[rookName].firstMove = false;
      newPiecesObject[state.selectedPiece].x = 2;
      newPiecesObject[state.selectedPiece].firstMove = false;
    }
    //longside castling
    else if(cell[0] === 6){
      rookName = state.selectedPiece.charAt(0) + "R2";
      newPiecesObject[rookName].x = 5;
      newPiecesObject[rookName].firstMove = false;
      newPiecesObject[state.selectedPiece].x = 6;
      newPiecesObject[state.selectedPiece].firstMove = false;
    }
    let newCellMap = buildNewCellMap(newPiecesObject);
    let newMessageBoard = `${state.selectedPiece} has castled with ${rookName}`;

    turnMaintenance(newPiecesObject, newCellMap, newMessageBoard, state.selectedPiece);
  }


  const processEnPassant = (cell) => {
    
    let newWGraveyard = recursiveStateCopy(state.wGraveyard);
    let newBGraveyard = recursiveStateCopy(state.bGraveyard);
    
    let newMessageBoard = `${state.selectedPiece} just attacked ${state.enPassantPiece} in passing`;
    let newPiecesObject = recursiveStateCopy(state.piecesObject);

    newPiecesObject[state.selectedPiece].x = cell[0];
    newPiecesObject[state.selectedPiece].y = cell[1];

    if(state.enPassantPiece.charAt(0) === "w"){
      newWGraveyard[state.enPassantPiece] = {...newPiecesObject[state.enPassantPiece]};
      newWGraveyard[state.enPassantPiece].dead = true;
    }
    else if(state.enPassantPiece.charAt(0) === "b"){
      newBGraveyard[state.enPassantPiece] = {...newPiecesObject[state.enPassantPiece]};
      newBGraveyard[state.enPassantPiece].dead = true;
    }

    let newCellMap = buildNewCellMap(newPiecesObject);

    turnMaintenance(newPiecesObject, newCellMap, newMessageBoard, state.selectedPiece, newWGraveyard, newBGraveyard);
  }

  const isMyKingInCheck = ( newPiecesObject, newCellMap ) => {

    const kingName = state.turn ? "wK" : "bK";
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

    let kingX = newPiecesObject[kingName].x;
    let kingY = newPiecesObject[kingName].y;
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
        if(newCellMap[`${i},${j}`] && (queenReg.test(newCellMap[`${i},${j}`]) || bishReg.test(newCellMap[`${i},${j}`]))){
          pathDone = true;
          inCheckFlag = true;
          return;
        }
        //if the tested cell is occupied, but not by an enemy queen or bishop, this path is done but continue checking other paths
        else if(newCellMap[`${i},${j}`]){
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
            
            if(newCellMap[`${i},${j}`] && (queenReg.test(newCellMap[`${i},${j}`]) || rookReg.test(newCellMap[`${i},${j}`]))){
              pathDone = true;
              inCheckFlag = true;
              return;
            }
            else if(newCellMap[`${i},${j}`]){
              pathDone = true;
            }
          }
      });
    }

    //test for enemy pawn attacks
    if(!inCheckFlag){
      pawnPaths.forEach(path => {
        let cellTest = `${kingX - path[0]},${kingY - path[1]}`;
  
        if(newCellMap[cellTest] && pawnReg.test(newCellMap[cellTest])){
          inCheckFlag = true;
          return;
        }
      });
    }

    //test for knight attacks
    if(!inCheckFlag){
      knightPaths.forEach(path => {
        let cellTest = `${kingX + path[0]},${kingY + path[1]}`;
  
        if(newCellMap[cellTest] && knightReg.test(newCellMap[cellTest])){
          inCheckFlag = true;
          return;
        }
      });
    }
    return inCheckFlag;
  }

  // triggered after most turns
  // selectedpiece gets a namechange here to avoid redeclaring and confusion of variables. again, strike against this function
  const turnMaintenance = ( newPiecesObject, newCellMap, newMessageBoard, currentPiece, newWGraveyard = state.wGraveyard, newBGraveyard = state.bGraveyard ) => {

    let newEnPassantPiece = "";

    //if the piece has a firstMove prop, flip it
    if(newPiecesObject[currentPiece].firstMove){
      newPiecesObject[currentPiece].firstMove = false;

      //if it's a pawn and it just had a double move, flag for enpassant attacks
      if(/^(w|b)P/.test(currentPiece) && (newPiecesObject[currentPiece].y === 4 || newPiecesObject[currentPiece].y === 3)){
        newEnPassantPiece = currentPiece;
      }
    }

    //update piece views
    //not sure I'm handling this properly
    newPiecesObject = updatePieceVision(newPiecesObject, newCellMap, newEnPassantPiece);

    dispatch({
      type: "maintenance",
      piecesObject: newPiecesObject, 
      cellMap: newCellMap, 
      messageBoard: newMessageBoard, 
      enPassantPiece: newEnPassantPiece, 
      wGraveyard: newWGraveyard, 
      bGraveyard: newBGraveyard
    });
  }

  const checkResize = () => {
    let currentWidth = window.innerWidth;
    let newScreenType;
    console.log(currentWidth);
    switch(true){
      case currentWidth > 1800: newScreenType = "big"; break;
      case currentWidth <= 1800 && currentWidth > 1200: newScreenType = "desktop"; break;
      case currentWidth <= 1200 && currentWidth > 900: newScreenType = "tab-land"; break;
      case currentWidth <= 900 && currentWidth > 600: newScreenType = "tab-port"; break;
      case currentWidth <= 600: newScreenType = "phone"; break;
      default: console.log("ERROR IN HANDLE RESIZE");
    }
    if(newScreenType !== state.screenType){
      dispatch({
        type: "screenBreakpoint", 
        screenType: newScreenType, 
        windowSize: currentWidth
      });
    } 
    else {
      dispatch({
        type: "windowWidthChange", 
        windowSize: currentWidth
      });
    }
  }


  // erases selection, sets messageboard text
  const illegalMove = (newMessageBoard) => {

    dispatch({
      type: "illegal",
      messageBoard: newMessageBoard
    });
    
  }


  //makes board tiles 
  const makeTiles = (tileSize) => {
    
    // return new Array(state.boardDimensions[0]).fill().map((column, i) => {
    //   return new Array(state.boardDimensions[1]).fill().map((tile,j) => {
    //     return <Tile
    //               key={`tile-${i}-${j}`} 
    //               size={tileSize} 
    //               borderColour="red" 
    //               classString={state.tileArr[i][j]}
                  
    //               onClick={tileClick} />
    //   });
    // });
    return new Array(8).fill().map((column, i) => {
      return new Array(8).fill().map((tile,j) => {
        return <Tile
                  key={`tile-${i}-${j}`} 
                  size={tileSize} 
                  borderColour="red" 
                  classString={state.tileArr[i][j]}
                  
                  onClick={tileClick} />
      });
    });
  }

  //makes pieces for the render method
  const makeLivePieces = (tileSize, backgroundSize) => {
    let livePieces = [];
    
    Object.keys(state.piecesObject).forEach((name, i) => {
      livePieces.push(
        <Piece 
          x={state.piecesObject[name].x}
          y={state.piecesObject[name].y}
          dead={state.piecesObject[name].dead}
          key={name}
          name={name}
          size={tileSize}
          backgroundSize={backgroundSize}
          border={state.selectedPiece}
          onClick={pieceClick} />
      );
    });
    return livePieces;
  }


  const makeDeadPieces = (tileSize, backgroundSize) => {
    
    let wPieces = [];
    let bPieces = [];
    let wGraveyardKeys = Object.keys(state.wGraveyard);
    let bGraveyardKeys = Object.keys(state.bGraveyard);

    if(wGraveyardKeys.length > 0){
      wGraveyardKeys.forEach(name => {
        wPieces.push(
          <Piece
            x={state.wGraveyard[name].x}
            y={state.wGraveyard[name].y}
            dead={state.wGraveyard[name].dead}
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
            x={state.bGraveyard[name].x}
            y={state.bGraveyard[name].y}
            dead={state.bGraveyard[name].dead}
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
  const recursiveStateCopy = (oldstate) => {
    let newState = {};
    Object.keys(oldstate).forEach(key => {
      if(typeof(oldstate[key]) === "object" && !Array.isArray(oldstate[key])){
        newState[key] = recursiveStateCopy(oldstate[key]);
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
  
  const getTileSize = () => {
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

  const getBackgroundSize = () => {
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

  useEffect(() => {
    window.addEventListener('resize', checkResize);

    return function removeWindowListener(){
      window.removeEventListener('resize', checkResize);
    };
  }, [state.screenType]);

 
  // =======================
  // START PROCESSING RENDER
  // ======================= 

  //GENERATE SCALING 
  let backgroundSize = getBackgroundSize();
  let tileSize = getTileSize();
  
  //GENERATE TILES
  let boardTiles = makeTiles(tileSize);

  //GENERATE PIECES
  let pieceObjects = makeLivePieces(tileSize, backgroundSize);
  let [ wGraveyardPieces, bGraveyardPieces ] = makeDeadPieces(tileSize, backgroundSize);

  let theMenu = state.pawnPromotionFlag ? <PromotionMenu selectPiece={promotePawn} team={state.selectedPiece.charAt(0)} /> : "";

  //STYLES
  let tileContainerStyle = {
    width: `${state.boardDimensions[0] * tileSize}px`,
    height: `${state.boardDimensions[1] * tileSize}px`,
  }
  
  let piecesContainerStyle = {
    width: `${state.boardDimensions[0] * tileSize}px`,
    height: `${state.boardDimensions[1] * tileSize}px`,
  }  

  return(
    <div id="game-container" >
      {theMenu}
      <h2 id="turn-board" >{state.turn ? "White turn" : "Black turn"}</h2>
      <div id="tile-container" style={tileContainerStyle}>
        {boardTiles}
      </div>
      <div id="pieces-container" style={piecesContainerStyle} >
        {pieceObjects}
      </div>
      <h3 id="message-board" >{state.messageBoard}</h3>
      <ChessGraveyard pieces={wGraveyardPieces} idString="wGraveyard" />
      <ChessGraveyard pieces={bGraveyardPieces} idString="bGraveyard" />
    </div>
  )
}