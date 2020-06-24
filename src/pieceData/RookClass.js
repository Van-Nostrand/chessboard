import PieceClass from "./PieceClass";

export default class RookClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos);
    this.view = {};
    
    this.paths = [[0,-1],[1,0],[0,1],[-1,0]];
    this.castleing = true;
    this.firstMove = false;
  }

  movelogic = (x,y) => x === 0 ^ y === 0;

  castlelogic = (king, rook) => {
    return true;
  };

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
        else if(occupiedObject[cellCheck] && occupiedObject[cellCheck][0].charAt(0) !== subject.name.charAt(0)){
          pathArr.push(cellCheck);
          pathDone = true;
        }
        else{
          pathDone = true;
        }

      }while(!pathDone);
      if(pathArr.length > 0) pathsObject[path] = pathArr;
      
    });
    return pathsObject;
    
  }
}