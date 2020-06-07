//Re-desigining the pieces as classes
//TODO - rewrite vision methods within this new structure
export class KingClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.paths = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    this.attacklogic = null;
    this.castleing = true;
    this.inCheck = false;
    this.firstMove = false;
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
  }

  movelogic = (x,y) => x < 2 && x > -2 && y < 2 && y > -2;
  
  //not implemented yet
  castlelogic = (king, rook) => {
      return true;
  };

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  vision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let subject = piecesObject[pieceName];

    subject.paths.forEach((path, i) => {
      let testX = subject.xC + path[0];
      let testY = subject.yC + path[1];
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

export class QueenClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.paths = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    this.attacklogic = null;
    this.kingInCheck = false;
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
  } 

  movelogic = (x,y) => {
    let result = (x === 0 ^ y === 0) ^ x/y === 1 || x/y === -1 ;
    if (result === 1) return true;
    else if(result === 0) return false;
    else return result;
  };

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  vision = (piecesObject, occupiedObject, pieceName) => {
   
    let pathsObject = {};
    const BOARDSIZE = 8;

    let subject = piecesObject[pieceName];
  
    //investigate each path until it hits a piece or border
    subject.paths.forEach((path, i) => {
      let count = 1;
      let pathDone = false;
      let pathArr = [];
    
      do{
        let testX = subject.xC + (path[0] * count);
        let testY = subject.yC + (path[1] * count);
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

export class BishopClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.paths = [[1,-1],[1,1],[-1,1],[-1,-1]];
    this.attacklogic = null;
    this.kingInCheck = false;
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
  }

  movelogic = (x,y) => x !== 0 && y !== 0 && (x/y === 1 || x/y === -1);

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  vision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    let subject = piecesObject[pieceName];
  
    //investigate each path until it hits a piece or border
    subject.paths.forEach((path, i) => {
      let count = 1;
      let pathDone = false;
      let pathArr = [];
    
      do{
        let testX = subject.xC + (path[0] * count);
        let testY = subject.yC + (path[1] * count);
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

export class KnightClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.attacklogic = null;
    this.kingInCheck = false;
    this.jump = true;
    this.paths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]];
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
    
  }

  movelogic = (x,y) => 
      x !== 0 !== y && 
      x !== y &&
      x < 3 && x > -3 && 
      y < 3 && y > -3 && (
        x%2 === 0 ^ y%2 === 0 
      );

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  vision = (piecesObject, occupiedObject, pieceName) => {
 
    let pathsObject = {};
    const BOARDSIZE = 8;
    let subject = piecesObject[pieceName];

    subject.paths.forEach((path, i) => {
      let testX = subject.xC + path[0];
      let testY = subject.yC + path[1];
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

export class RookClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    
    this.paths = [[0,-1],[1,0],[0,1],[-1,0]];
    this.attacklogic = null;
    this.kingInCheck = false;
    this.castleing = true;
    this.firstMove = false;
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;

  }

  movelogic = (x,y) => x === 0 ^ y === 0;

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  castlelogic = (king, rook) => {
    return true;
  };

  vision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    let subject = piecesObject[pieceName];
  
    //investigate each path until it hits a piece or border
    subject.paths.forEach((path, i) => {
      let count = 1;
      let pathDone = false;
      let pathArr = [];
    
      do{
        let testX = subject.xC + (path[0] * count);
        let testY = subject.yC + (path[1] * count);
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

export class PawnClass{
  constructor(name, x, y, pngPos, direction){
    this.name = name;
    this.x = x;
    this.y = y;
    this.view = {};
    this.firstMove = true;
    this.castleing = false;
    this.enPassant = false;
    this.promotion = false; 
    this.kingInCheck = false;
    this.direction = direction;
    this.fifthRank = direction === -1 ? 3 : 4;
    this.paths = [[0,direction],[0,direction + direction],[-1,direction], [1,direction]];
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
  }
  
  attacklogic = (x,y) => (x === 1 || x === -1) && (y === 1 * this.direction);

  movelogic = (x, y) => {
    if(this.firstMove) return x === 0 && (y === 1 * this.direction || y === 2 * this.direction);
    else if(!this.firstMove) return x === 0 && y === 1 * this.direction ;
  };

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  enpassantlogic = (x,y,targetcell,victim) => {
    return (
      targetcell[0] === victim[0] && 
      (targetcell[1] === victim[1] + 1 || 
        targetcell[1] === victim[1] - 1));
  };

  //TODO - this is the old pawnvision from PieceRules.js
  //refactor so it refers to itself rather than a piecesObject state
  vision = (occupiedObject) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    
    //test moving one space
    let testX1 = this.x + this.paths[0][0];
    let testY1 = this.y + this.paths[0][1];
    let testMove1 = `${testX1},${testY1}`;
    if(!occupiedObject[testMove1] && testX1 < BOARDSIZE && testX1 >= 0 && testY1 < BOARDSIZE && testY1 >=0 ) pathsObject[`${this.paths[0]}`] = [testMove1];

    //test moving two spaces
    if(this.firstMove){
      let testX2 = this.x + this.paths[1][0];
      let testY2 = this.y + this.paths[1][1];
      let testMove2 = `${testX2},${testY2}`;

      if(!occupiedObject[testMove2] && 
        testX1 < BOARDSIZE && testX1 >= 0 && 
        testY1 < BOARDSIZE && testY1 >=0){
        
        pathsObject[`${this.paths[0]}`].push(testMove2);
      }
    }

    //test attacks
    let testX3 = this.x + this.paths[2][0];
    let testY3 = this.y + this.paths[2][1];
    let testAttack1 = `${testX3},${testY3}`;
    if(occupiedObject[testAttack1] && 
      occupiedObject[testAttack1][0].charAt(0) !== this.name.charAt(0)
      ) pathsObject[`${this.paths[2]}`] = [testAttack1];

    let testX4 = this.x + this.paths[3][0];
    let testY4 = this.y + this.paths[3][1];
    let testAttack2 = `${testX4},${testY4}`;
    if(occupiedObject[testAttack2] &&
      occupiedObject[testAttack2][0].charAt(0) !== this.name.charAt(0)) pathsObject[`${this.paths[3]}`] = [testAttack2];

    //TODO - if on 5th rank, test en passant
    //if( on 5th rank )
    if(this.y === this.fifthRank){
      //check for pieces beside pawn
      let keys = Object.keys(occupiedObject).filter(cell => 
        (parseInt(cell.charAt(0)) === this.x - 1 && parseInt(cell.charAt(1)) === this.y) || 
        (parseInt(cell.charAt(0)) === this.x + 1 && parseInt(cell.charAt(1)) === this.y)
      ).call(this);

      //check if those cells actually contain pawns
      if(keys.length > 0){
        let pawns = keys.map(cell => {
          if(occupiedObject[cell].charAt(0) !== this.name.charAt(0) && occupiedObject[cell].charAt(1) === "P"){
            return occupiedObject[cell];
          }
        });

        if(pawns.length > 0){
          let vulnerable = pawns.filter(pawn => pawn.enPassant);
          if(vulnerable.length > 0){
            console.log("ZE FRENCH, ZEY ARE ATTACKING");
          }
        }
      }

    }

    return pathsObject;
  }
}