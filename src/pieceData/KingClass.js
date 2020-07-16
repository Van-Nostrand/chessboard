/*==== KINGS ====
inCheck - this will be used to signal whether the king is in check... not sure if I'll be using it this way
*/
import PieceClass from "./PieceClass";

export default class KingClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], false);
    
    this.view = {};
    this.inCheck = false;
    this.firstMove = false;
    this.castleing = true;
    this.checkView = {};
  }

  movelogic = (x,y) => x < 2 && x > -2 && y < 2 && y > -2;
  
  //not implemented yet
  castlelogic = (king, rook) => {
      return true;
  };

  pseudovision = (occupiedObject) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    this.paths.forEach((path, i) => {
      let testX = this.x + path[0];
      let testY = this.y + path[1];
      let cellCheck = `${testX},${testY}`;

      if (
        !occupiedObject[cellCheck] && 
        testX >= 0 && testX < BOARDSIZE && 
        testY >= 0 && testY < BOARDSIZE
      ){
        pathsObject[cellCheck] = "m";
      }
      else if(occupiedObject[cellCheck] && occupiedObject[cellCheck].charAt(0) !== this.name.charAt(0)){
        pathsObject[cellCheck] = "a";
      }
      else if(occupiedObject[cellCheck] && occupiedObject[cellCheck].charAt(0) === this.name.charAt(0)){
        pathsObject[cellCheck] = "b";
      }
    });

    this.newview = pathsObject;
    return pathsObject;
  }

  amIChecked = (cellMap) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let enemyChar = this.name.charAt(0) === "w" ? "b" : "w";
    let qbrPaths = [
      [1,-1],
      [1,1],
      [-1,1],
      [-1,-1],
      [0,-1],
      [1,0],
      [0,1],
      [-1,0]
    ];
    let pawnPaths = [
      [-1,enemyChar === "w" ? -1 : 1],
      [1,enemyChar === "w" ? -1 : 1]
    ];
    let knightPaths = [
      [1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]
    ]
    // test queen bishop rook attacks
    qbrPaths.forEach((path, i) => {

      let startX = this.x + path[0];
      let startY = this.y + path[1];
      let pathDone = false;
      let queenReg = new RegExp("^" + enemyChar + "Q");
      let rookReg = new RegExp("^" + enemyChar + "R");
      let bishReg = new RegExp("^" + enemyChar + "B");

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        if(!pathDone){
          let cellTest = `${i},${j}`;
          // if cell in path contains enemy
          if (cellMap[cellTest] && (
            queenReg.test(cellMap[cellTest]) ||
            rookReg.test(cellMap[cellTest]) ||
            bishReg.test(cellMap[cellTest])
          )){
            pathsObject[cellTest] = cellMap[cellTest];
            pathDone = true;
          }
          // else piece must be ally
          else if (cellMap[cellTest] && cellMap[cellTest].charAt(0) !== enemyChar){
            pathDone = true;
          }
        }
      }
    });

    pawnPaths.forEach((path, i) => {
      // let testX1 = this.x + path[0];
      // let testY1 = this.y + path[0];
      let cellTest = `${this.x + path[0]},${this.y + path[1]}`;
      let pawnRegex = new RegExp("^" + enemyChar + "P");

      //test position
      if(cellMap[cellTest] && pawnRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    });

    knightPaths.forEach(path => {
      let cellTest = `${this.x + path[0]},${this.y + path[1]}`;
      let knightRegex = new RegExp("^" + enemyChar + "P");

      if(cellMap[cellTest] && knightRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    });

    // return object
    this.checkView = pathsObject;
    console.log("this is the kings check view");
    console.log(pathsObject);
  }

}