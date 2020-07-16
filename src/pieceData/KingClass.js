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


  vision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let subject = piecesObject[pieceName];

    subject.paths.forEach((path, i) => {
      let testX = subject.x + path[0];
      let testY = subject.y + path[1];
      let cellCheck = `${testX},${testY}`;

      if (
        !occupiedObject[cellCheck] && 
        testX >= 0 && testX < BOARDSIZE && 
        testY >= 0 && testY < BOARDSIZE
      ){
        pathsObject[path] = [cellCheck];
      }else if(occupiedObject[cellCheck] && occupiedObject[cellCheck].charAt(0) !== subject.name.charAt(0)){
        pathsObject[path] = [cellCheck]
      }
    });
    return pathsObject;
  }
}