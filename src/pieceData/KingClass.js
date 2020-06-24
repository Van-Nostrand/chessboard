import PieceClass from "./PieceClass";

export default class KingClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos);
    this.paths = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
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
      }else if(occupiedObject[cellCheck] && occupiedObject[cellCheck][0].charAt(0) !== subject.name.charAt(0)){
        pathsObject[path] = [cellCheck]
      }
    });
    return pathsObject;
  }
}