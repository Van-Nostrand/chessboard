/*
  Pieces are structured like this:
    pngPos - an array that describes where on the source png file their image is
    x, y - these refer to cell coordinates on the board
    path - this is an array of arrays; each sub-array describes a direction that piece can move in
    firstMove - only pawns, rooks, and kings have this property. This governs whether the piece can engage in castleing, two space moves, or trigger a pawns en passant flag.
    dead - self explanatory, but might be phased out as setting coordinates of -1,-1 could easily be substituted
    
    vision() - pieces are in charge of tracking their possible moves. They do this with their vision() method and view property
      view is an object that contains a series of arrays
      Each array is named after each path array they have 
      vision() checks all possible moves and attacks on the board and returns a new view
    
    movelogic() - used to determine if moves are legal. x and y delta values are given as arguments, and a boolean is returned indicating whether those values describe a legal move for the current piece
    
  ==== QUEENS ====

  ==== ROOKS ====

  ==== BISHOPS ====
    
  ==== KINGS ====
  inCheck - this will be used to signal whether the king is in check... not sure if I'll be using it this way
 
  ==== KNIGHTS ====
  jump - this allows them to jump other pieces. might be phased out by a simple class check
  note that because knights move in an "L" shape, their paths property and movelogic function and external legality checks work a bit differently than other pieces

  ==== PAWNS ====
  Pawns are complicated and fussy. I both love and hate them, but not in that order.
  attacklogic() - similar to movelogic(), this pawn-exclusive function determines if a pawn can attack
  direction - a property set by this.name.charAt(0) which determines the direction this pawn may move in
  promotion - an unimplemented property to determine if the piece has promoted or not, however this will likely not be used. 
  fifthRank - an integer which represents the pawns 5th rank. Used to track en passant attacks. 
  
*/
export class KingClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.paths = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    this.view = {};
    this.dead = false;
    this.clicked = false;
    this.inCheck = false;
    this.firstMove = false;
    this.pngPos = pngPos;
    this.dragging = false;
    this.castleing = true;
    this.name = name;
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

export class QueenClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.paths = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
    this.name = name;
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

export class BishopClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.paths = [[1,-1],[1,1],[-1,1],[-1,-1]];
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
    this.name = name;
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

export class KnightClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    this.jump = true;
    this.paths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]];
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
    this.name = name;
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

export class RookClass{
  constructor(name, x, y, pngPos){
    this.x = x;
    this.y = y;
    this.view = {};
    
    this.paths = [[0,-1],[1,0],[0,1],[-1,0]];
    this.castleing = true;
    this.firstMove = false;
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
    this.name = name;
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

export class PawnClass{
  constructor(name, x, y, pngPos, direction){
    this.name = name;
    this.x = x;
    this.y = y;
    this.view = {};
    this.firstMove = true;
    this.enPassant = false;
    this.promotion = false; 
    this.direction = direction;
    this.fifthRank = direction === -1 ? 3 : 4;
    this.paths = [[0,direction],[0,direction + direction],[-1,direction], [1,direction]];
    this.pngPos = pngPos;
    this.dragging = false;
    this.dead = false;
    this.clicked = false;
    this.name = name;
  }
  
  attacklogic = (x,y) => (x === 1 || x === -1) && (y === 1 * this.direction);

  movelogic = (x, y) => {
    if(this.firstMove) {
      return x === 0 && (y === 1 * this.direction || y === 2 * this.direction);
    } else if(!this.firstMove) {
      return x === 0 && y === 1 * this.direction ;
    }
  };

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  flagInPassing(){
    this.enPassant = !this.enPassant;
  }

  enpassantlogic = (x,y,targetcell,victim) => {
    return (
      targetcell[0] === victim[0] && 
      (targetcell[1] === victim[1] + 1 || 
        targetcell[1] === victim[1] - 1));
  };

  vision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let enpassantArr = [];
    
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

    //test attacking left
    let testX3 = this.x + this.paths[2][0];
    let testY3 = this.y + this.paths[2][1];
    let testAttack1 = `${testX3},${testY3}`;
    if(occupiedObject[testAttack1] && occupiedObject[testAttack1][0].charAt(0) !== this.name.charAt(0)) {

      pathsObject[`${this.paths[2]}`] = [testAttack1];
      
    } else if (this.y === this.fifthRank) {

      enpassantArr.push(testAttack1);
      
    }
      
    //test attacking right
    let testX4 = this.x + this.paths[3][0];
    let testY4 = this.y + this.paths[3][1];
    let testAttack2 = `${testX4},${testY4}`;
    if(occupiedObject[testAttack2] && occupiedObject[testAttack2][0].charAt(0) !== this.name.charAt(0)) {

      pathsObject[`${this.paths[3]}`] = [testAttack2];

    } else if (this.y === this.fifthRank) {

      enpassantArr.push(testAttack2);

    }

    //IMPLEMENTING EN PASSANT TEST HERE
    //if on 5th rank AND paths 2 and/or 3 returned nothing...
    if(this.y === this.fifthRank && enpassantArr.length > 0){
      // ... then check for pieces to left and right of current piece

      let keys = Object.keys(occupiedObject).filter(cell => 
        (parseInt(cell.charAt(0)) === this.x - 1 && parseInt(cell.charAt(2)) === this.y) || 
        (parseInt(cell.charAt(0)) === this.x + 1 && parseInt(cell.charAt(2)) === this.y)
      );
      console.log(occupiedObject);
      console.log(keys);


      // if there's pieces there...
      if(keys.length > 0){
        //... check if they're pawns
        let pawns = keys.map(cell => {
          if(occupiedObject[cell][0].charAt(0) !== this.name.charAt(0) && occupiedObject[cell][0].charAt(1) === "P"){
            return occupiedObject[cell];
          }
        });
        console.log("the pawns");
        console.log(pawns);

        // if they're pawns...
        if(pawns.length > 0){
          //... are they vulnerable to en passant?
          let vulnerable = pawns.filter(pawn => piecesObject[pawn].enPassant === true);

          console.log("paths object");
          console.log(pathsObject);
          //if they're vulnerable... 
          if(vulnerable.length > 0){
            console.log("ZE FRENCH, ZEY ARE ATTACKING");
            console.log(vulnerable);
            //...add path of empty cell behind enemy pawn to pathsObject
            vulnerable.forEach(noob => {
              let newCell = [`${piecesObject[noob[0]].x},${piecesObject[noob[0]].y + this.direction}`];
              let newPath = `${parseInt(newCell[0].charAt(0)) - this.x},${parseInt(newCell[0].charAt(2)) - this.y}`;
              newCell.push(noob[0]);
              pathsObject[newPath] = newCell;
            })
          }
        }
      }
    }

    return pathsObject;
  }
}