//TODO - reimplement BOARDSIZE constants so that it is dynamic and not hard-coded
export default function rulesets(piece){

  //TODO - implement a rook/castling test
  //rook bishop and queen will all be checking their paths until they run out of room, so they get the same method
  const rookBishopQueenVision = (piecesObject, occupiedObject, pieceName) => {
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

  const knightVision = (piecesObject, occupiedObject, pieceName) => {
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

  const kingVision = (piecesObject, occupiedObject, pieceName) => {
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

  //pawns have more complicated rules for attacking and moving, so they get their own method
  const pawnVision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let subject = piecesObject[pieceName];
    
    let testX1 = subject.xC + subject.paths[0][0];
    let testY1 = subject.yC + subject.paths[0][1];
    let testMove1 = `${testX1},${testY1}`;
    if(!occupiedObject[testMove1] && testX1 < BOARDSIZE && testX1 >= 0 && testY1 < BOARDSIZE && testY1 >=0 ) pathsObject[`${subject.paths[0]}`] = [testMove1];

    if(subject.firstMove){
      let testX2 = subject.xC + subject.paths[1][0];
      let testY2 = subject.yC + subject.paths[1][1];
      let testMove2 = `${testX2},${testY2}`;

      if(!occupiedObject[testMove2] && 
        testX1 < BOARDSIZE && testX1 >= 0 && 
        testY1 < BOARDSIZE && testY1 >=0){
        
        pathsObject[`${subject.paths[0]}`].push(testMove2);
      }
    }

    //test attacks
    let testX3 = subject.xC + subject.paths[2][0];
    let testY3 = subject.yC + subject.paths[2][1];
    let testAttack1 = `${testX3},${testY3}`;
    if(occupiedObject[testAttack1] && 
      occupiedObject[testAttack1][0].charAt(0) !== subject.name.charAt(0)
      ) pathsObject[`${subject.paths[2]}`] = [testAttack1];

    let testX4 = subject.xC + subject.paths[3][0];
    let testY4 = subject.yC + subject.paths[3][1];
    let testAttack2 = `${testX4},${testY4}`;
    if(occupiedObject[testAttack2] &&
      occupiedObject[testAttack2][0].charAt(0) !== subject.name.charAt(0)) pathsObject[`${subject.paths[3]}`] = [testAttack2];

    
    //if on 5th rank and enemy has en passant flag, test en passant

    return pathsObject;
  }
  
  const knightRules = () => {
    const rules = {
      attacklogic: null,
      kingInCheck: false,
      capture: "same",
      jump: true,
      castleing: false,
      paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]],
      vision: knightVision,
      movelogic: (x,y) => 
        x !== 0 !== y && 
        x !== y &&
        x < 3 && x > -3 && 
        y < 3 && y > -3 && (
          x%2 === 0 ^ y%2 === 0 
        )
    }
    return rules;
  }

  //TODO - implement castlelogic
  const rookRules = () => {
    const rules = {
      movelogic: (x,y) => x === 0 ^ y === 0,
      castlelogic: (king, rook) => {
        return true;
      },
      paths: [[0,-1],[1,0],[0,1],[-1,0]],
      attacklogic: null,
      kingInCheck: false,
      capture: "same",
      jump: false,
      castleing: true,
      firstMove: false,
      vision: rookBishopQueenVision
    }
    return rules;
  }
  const bishopRules = () => {
    const rules = {
      movelogic: (x,y) => x !== 0 && y !== 0 && (x/y === 1 || x/y === -1),
      paths: [[1,-1],[1,1],[-1,1],[-1,-1]],
      attacklogic: null,
      kingInCheck: false,
      capture: "same",
      jump: false,
      castleing: false,
      vision: rookBishopQueenVision
    }
    return rules; 
  }

  //TODO - clean up movelogic
  //maybe XOR operator is a bad idea, maybe there's another way around it. combine OR and AND NOT statements? 
  const queenRules = () => {
    const rules = {
      movelogic: (x,y) => {
        let result = (x === 0 ^ y === 0) ^ x/y === 1 || x/y === -1 ;
        if (result === 1) return true;
        else if(result === 0) return false;
        else return result;
      } 
      ,
      paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
      attacklogic: null,
      kingInCheck: false,
      capture: "same",
      jump: false,
      castleing: false,
      vision: rookBishopQueenVision
    }
    return rules; 
  }
  //TODO - implement castlelogic
  const kingRules = () => {
    const rules = {
      movelogic: (x,y) => x < 2 && x > -2 && y < 2 && y > -2,
      castlelogic: (king, rook) => {
        return true;
      },
      paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
      attacklogic: null,
      capture: "same",
      jump: false,
      castleing: true,
      inCheck: false,
      firstMove: false,
      vision: kingVision
    }
    return rules;
  }

  //TODO - implement pawn promotion
  //TODO - implement en passant
  //rules.enpassantlogic(x = int, y = int, targetcell = [int, int], victim = [int, int])
  const pawnRules = function(name){
    //RULES FOR EN PASSANT
    // the capturing pawn must be on its fifth rank;
    // the captured pawn must be on an adjacent file and must have just moved two squares in a single move (i.e. a double-step move);
    // the capture can only be made on the move immediately after the enemy pawn makes the double-step move; otherwise, the right to capture it en passant is lost.
    let direction = /^w/.test(name) ? -1 : 1;
    const rules = {
      firstMove: true,
      jump: false,
      castleing: false,
      enPassant: false,
      promotion: false, 
      kingInCheck: false,
      vision: pawnVision,
      movelogic: (x, y) => {
        if(rules.firstMove) return x === 0 && (y === 1 * direction || y === 2 * direction);
        else if(!rules.firstMove) return x === 0 && y === 1 * direction ;
      },
      attacklogic: (x,y) => (x === 1 || x === -1) && (y === 1 * direction),
      enpassantlogic: (x,y,targetcell,victim) => {
        
        return (
          targetcell[0] === victim[0] && 
          (targetcell[1] === victim[1] + 1 || 
            targetcell[1] === victim[1] - 1));
      },
      paths: [[0,direction],[0,direction + direction],[-1,direction], [1,direction]]
    }
    return rules;
  }
  
  switch(true){
    case /^.R/.test(piece): return rookRules();
    case /^.N/.test(piece): return knightRules();
    case /^.B/.test(piece): return bishopRules();
    case /^.Q/.test(piece): return queenRules();
    case /^.K/.test(piece): return kingRules();
    case /^.P/.test(piece): return pawnRules(piece);
    default: console.log(`error getting rules. piece is ${piece}`);
  }

}

/* 
the piece knows where it is on the board, and also whether it has spent its first move. pawns therefore need to know if they've spent their second move, and also need to know if their first move was a double move. 
*/