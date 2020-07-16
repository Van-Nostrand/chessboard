/*==== KNIGHTS ====
  jump - this allows them to jump other pieces. might be phased out by a simple class check
  note that because knights move in an "L" shape, their paths property and movelogic function and external legality checks work a bit differently than other pieces
*/
import PieceClass from "./PieceClass";

export default class KnightClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], false);
    
    // this.view = {};
    this.jump = true;
  }

  movelogic = (x,y) => 
      x !== 0 !== y && 
      x !== y &&
      x < 3 && x > -3 && 
      y < 3 && y > -3 && (
        x%2 === 0 ^ y%2 === 0 
      );

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
      else if (occupiedObject[cellCheck] && occupiedObject[cellCheck].charAt(0) === this.name.charAt(0)){
        pathsObject[cellCheck] = "b";
      }
    });
    this.newview = pathsObject;
    return pathsObject;
  }
  
}