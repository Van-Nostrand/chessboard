import PieceClass from "./PieceClass";

export default class KnightClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos);
    this.view = {};
    this.jump = true;
    this.paths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]];
  }

  movelogic = (x,y) => 
      x !== 0 !== y && 
      x !== y &&
      x < 3 && x > -3 && 
      y < 3 && y > -3 && (
        x%2 === 0 ^ y%2 === 0 
      );

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