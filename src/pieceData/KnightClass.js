/*
==== KNIGHTS ====
*/

export default class KnightClass{
  
  static movelogic = (x,y) => 
      x !== 0 !== y && 
      x !== y &&
      x < 3 && x > -3 && 
      y < 3 && y > -3 && (
        x%2 === 0 ^ y%2 === 0 
      );


  static getPaths = () => {
    return [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  }


  static vision = (cellMap, piecesObject, name) => {
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
      else if (cellMap[cellCheck] && cellMap[cellCheck].charAt(0) === name.charAt(0)){
        pathsObject[cellCheck] = "b";
      }
    });
    return pathsObject;
  }
  
}