import PieceClass from "./PieceClass";

export default class QueenClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], true);
    
    // this.view = {};
  } 

  movelogic = (x,y) => {
    let result = (x === 0 ^ y === 0) ^ x/y === 1 || x/y === -1 ;
    if (result === 1) return true;
    else if(result === 0) return false;
    else return result;
  };

  pseudovision = (occupiedObject) => {
    // get array of paths
    // create an object to store cells
    let pathsObject = {};
    const BOARDSIZE = 8;
    console.log(this.name);
    // for each path: iterate over all cells
    this.paths.forEach((path, i) => {

      //set boundaries for this path
      let startX = this.x + path[0];
      let startY = this.y + path[1];
      let blockedFlag = false;
      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        // debugger;
        let cellTest = `${i},${j}`;
        // if cell in path contains piece
        if (occupiedObject[cellTest]){
          // if piece is enemy
          if(occupiedObject[cellTest].charAt(0) !== this.name.charAt(0)){
            // if enemy has not been found in this path yet
            if(!blockedFlag){
              // create key/value "coordinates": "a"
              // set blockedFlag to true
              pathsObject[cellTest] = "a";
              blockedFlag = true;
            }
            // else, enemy has been found in path
            else {
              // create key/value "coordinates": "b" (for blocked)
              pathsObject[cellTest] = "b";
            }
          }
          // else piece must be ally
          else {
            // create key/value "coordinates": "b"
            // set blockedFlag to true
            pathsObject[cellTest] = "b";
            blockedFlag = true;
          }
        }
        // else cell is empty
        else {
          // if blockedFlag is false
          if(!blockedFlag){
            // create key/value "coordinates": "m"
            pathsObject[cellTest] = "m";
          }
          // else this cell must be blocked by something
          else {
            // create key/value "coordinates": "b"
            pathsObject[cellTest] = "b";
          }
  
        }
        
      }

    })
    // return object
    this.newview = pathsObject;
    return pathsObject;
  }

}