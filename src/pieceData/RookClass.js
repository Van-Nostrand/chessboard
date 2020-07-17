/*
Rooks
*/

export default class RookClass extends PieceClass{

  movelogic = (x,y) => x === 0 ^ y === 0;

  castlelogic = (king, rook) => {
    return true;
  };
  vision = (cellMap, piecesObject, name) => {
    let {x, y, paths} = piecesObject[name];

    // get array of paths
    // create an object to store cells
    let pathsObject = {};
    const BOARDSIZE = 8;
    // for each path: iterate over all cells
    paths.forEach((path, i) => {

      //set variables for this path
      let startX = x + path[0];
      let startY = y + path[1];
      let blockedFlag = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        // debugger;
        let cellTest = `${i},${j}`;
        // if cell in path contains piece
        if (cellMap[cellTest]){
          // if piece is enemy
          if(cellMap[cellTest].charAt(0) !== this.name.charAt(0)){
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
    // this.newview = pathsObject;
    return pathsObject;
  }

}