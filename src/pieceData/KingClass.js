/*
==== KINGS ====
amIChecked() - this looks for attackers and reports them back
*/
import PieceClass from "./PieceClass";

export default class KingClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], false);
    
    // this.view = {};
    this.inCheck = false;
    this.firstMove = false;
    this.castleing = true;
    this.amIChecked = this.amIChecked.bind(this);
    this.checkView = {};
  }

  movelogic = (x,y) => x < 2 && x > -2 && y < 2 && y > -2;
  
  //not implemented yet
  castlelogic = (king, rook) => {
      return true;
  };

  vision = (cellMap, piecesObject, name) => {
    let {x, y, paths} = piecesObject[name];
    
    let pathsObject = {};
    const BOARDSIZE = 8;

    paths.forEach((path, i) => {
      let testX = x + path[0];
      let testY = y + path[1];
      let cellCheck = `${testX},${testY}`;

      if (
        !cellMap[cellCheck] && 
        testX >= 0 && testX < BOARDSIZE && 
        testY >= 0 && testY < BOARDSIZE
      ){
        pathsObject[cellCheck] = "m";
      }
      else if(cellMap[cellCheck] && cellMap[cellCheck].charAt(0) !== name.charAt(0)){
        pathsObject[cellCheck] = "a";
      }
      else if(cellMap[cellCheck] && cellMap[cellCheck].charAt(0) === name.charAt(0)){
        pathsObject[cellCheck] = "b";
      }
    });

    // this.newview = pathsObject;
    return pathsObject;
  }

  amIChecked = (cellMap, arr) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let enemyChar = this.name.charAt(0) === "w" ? "b" : "w";
    
    let bishopPaths = [[1,-1], [1,1], [-1,1], [-1,-1]];
    let rookPaths = [[0,-1], [1,0], [0,1], [-1,0]];
    let pawnPaths = [[-1,enemyChar === "w" ? -1 : 1], [1,enemyChar === "w" ? -1 : 1]];
    let knightPaths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2]];

    let queenReg = new RegExp("^" + enemyChar + "Q");
    let rookReg = new RegExp("^" + enemyChar + "R");
    let bishReg = new RegExp("^" + enemyChar + "B");
    let pawnRegex = new RegExp("^" + enemyChar + "P");
    let knightRegex = new RegExp("^" + enemyChar + "N");

    let testX, testY;
    if(arr && arr.length === 2){
      testX = arr[0];
      testY = arr[1];
    }
    else{
      testX = this.x;
      testY = this.y;
    }
    
    console.log(`${this.name} cellmap`);
    console.log(cellMap);

    // test queen bishop attacks
    bishopPaths.forEach((path, i) => {

      let startX = testX + path[0];
      let startY = testY + path[1];
      let pathDone = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        if(!pathDone){
          let cellTest = `${i},${j}`;
          // if cell in path contains enemy
          if (cellMap[cellTest] && (queenReg.test(cellMap[cellTest]) || bishReg.test(cellMap[cellTest]))){
            pathsObject[cellTest] = cellMap[cellTest];
            pathDone = true;
          }
          // else it's some other piece that can't attack. 
          else if (cellMap[cellTest]){
            pathDone = true;
          }
        }
      }
    });

    // test queen rook attacks
    rookPaths.forEach((path, i) => {

      let startX = testX + path[0];
      let startY = testY + path[1];
      let pathDone = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        if(!pathDone){
          let cellTest = `${i},${j}`;
          // if cell in path contains enemy
          if (cellMap[cellTest] && (queenReg.test(cellMap[cellTest]) || rookReg.test(cellMap[cellTest]))){
            pathsObject[cellTest] = cellMap[cellTest];
            pathDone = true;
          }
          // else it's some other piece that can't attack. 
          else if (cellMap[cellTest] ){
            pathDone = true;
          }
        }
      }
    });

    pawnPaths.forEach((path, i) => {
      let cellTest = `${testX + path[0]},${testY + path[1]}`;
      
      //test position
      if(cellMap[cellTest] && pawnRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    });

    knightPaths.forEach(path => {
      let cellTest = `${testX + path[0]},${testY + path[1]}`;

      if(cellMap[cellTest] && knightRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    });

    // return object
    // this.checkView = pathsObject;
    console.log(`${this.name.charAt(0)} king check test`);
    console.log(pathsObject);
    // console.log(this.checkView);
    return pathsObject;
    // debugger;
  }

}