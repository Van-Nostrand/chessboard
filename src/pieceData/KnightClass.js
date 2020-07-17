/*
==== KNIGHTS ====
*/
import PieceClass from "./PieceClass";

export default class KnightClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], false);
    
    this.jump = true; //likely won't be using this property much longer...
  }

  movelogic = (x,y) => 
      x !== 0 !== y && 
      x !== y &&
      x < 3 && x > -3 && 
      y < 3 && y > -3 && (
        x%2 === 0 ^ y%2 === 0 
      );

  vision = (cellMap) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    this.paths.forEach((path, i) => {
      let testX = this.x + path[0];
      let testY = this.y + path[1];
      let cellCheck = `${testX},${testY}`;

      if (
        !cellMap[cellCheck] && 
        testX >= 0 && testX < BOARDSIZE && 
        testY >= 0 && testY < BOARDSIZE
      ){
        pathsObject[cellCheck] = "m";
      }
      else if(cellMap[cellCheck] && cellMap[cellCheck].charAt(0) !== this.name.charAt(0)){
        pathsObject[cellCheck] = "a";
      }
      else if (cellMap[cellCheck] && cellMap[cellCheck].charAt(0) === this.name.charAt(0)){
        pathsObject[cellCheck] = "b";
      }
    });
    this.newview = pathsObject;
    return pathsObject;
  }
  
}