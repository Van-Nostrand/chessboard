/*
Rooks
*/
import PieceClass from "./PieceClass";

export default class RookClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[0,-1],[1,0],[0,1],[-1,0]], true);
    
    // this.view = {};
    this.castleing = true;
    this.firstMove = false;
  }

  movelogic = (x,y) => x === 0 ^ y === 0;

  castlelogic = (king, rook) => {
    return true;
  };
  pseudovision = (occupiedObject) => {
    // get array of paths
    // create an object to store cells
    let pathsObject = {};
    const BOARDSIZE = 8;
    console.log(this.name);
    // for each path: iterate over all cells
    this.paths.forEach((path, i) => {

      //set variables for this path
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

  vision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    //TODO - REFACTOR USING "THIS"
    let subject = piecesObject[pieceName];
  
    //investigate each path until it hits a piece or border
    subject.paths.forEach((path, i) => {
      let count = 1;
      let pathDone = false;
      let pathArr = [];
    
      do{
        let testX = subject.x + (path[0] * count);
        let testY = subject.y + (path[1] * count);
        let cellCheck = `${testX},${testY}`;

        //if the cell being checked does not show up in the list of occupied cells and is within valid board space, it is a valid move so push that cell to the array 
        if (testX >= 0 && testX < BOARDSIZE && testY >= 0 && testY < BOARDSIZE && !occupiedObject[cellCheck]){
          pathArr.push(cellCheck);
          count = count + 1;
        }
        //implemented a check to see if filled space is a capturable enemy piece
        else if(occupiedObject[cellCheck] && occupiedObject[cellCheck].charAt(0) !== subject.name.charAt(0)){
          pathArr.push(cellCheck);
          pathDone = true;
        }
        else{
          pathDone = true;
        }

      }while(!pathDone);
      if(pathArr.length > 0) pathsObject[path] = pathArr;
      
    });

    this.view = pathsObject;
    return pathsObject;
  }
}