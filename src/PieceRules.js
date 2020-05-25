export default function rulesets(piece){

  //TODO - reimplement BOARDSIZE so that it is dynamic and not a hard-coded variable
  //TODO - implement a rook/castling test
  //rook bishop and queen will all be checking their paths until they run out of room, so they get the same method
  const rookBishopQueenVision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    let subject = piecesObject[pieceName];
    
    //investigate each path until it hits a piece or border
    subject.rules.paths.forEach((path, i) => {
      debugger;
      let count = 1;
      let pathDone = false;
      let pathArr = [];
     
      do{
        let testX = subject.xC + (path[0] * count);
        let testY = subject.yC + (path[1] * count);
        let cellCheck = `${testX},${testY}`;

        //if the cell being checked does not show up in the list of occupied cells and is within valid board space, it is a valid move so push that cell to the array 
        if(occupiedObject[cellCheck]){
          console.log("success!");
        }
        
        if (testX >= 0 && testX < BOARDSIZE && testY >= 0 && testY < BOARDSIZE && !(occupiedObject.hasOwnProperty(`${testX},${testY}`))){
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
        console.log(`testing ${testX},${testY} against ${occupiedObject}`);

      }while(!pathDone);
      if(pathArr.length > 0) pathsObject[path] = pathArr;
     
    });
    return pathsObject;
  }

  //TODO - implement a King/castling check
  //TODO - consider implementing an "in-check" check here
  //knight and king can only have one move per path, so they get their own method
  const knightKingVision = (piecesObject, occupiedObject, pieceName) => {
    let pathsObject = {};
    const BOARDSIZE = 8;
    let subject = piecesObject[pieceName];

    subject.rules.paths.forEach((path, i) => {
      let testX = subject.xC + path[0];
      let testY = subject.yC + path[1];
      let cellCheck = `${testX},${testY}`;

      if (
        !occupiedObject[cellCheck] && 
        testX >= 0 && testX < BOARDSIZE && 
        testY >= 0 && testY < BOARDSIZE
      ){
        pathsObject[path] = [testX, testY];
      }
    });
    return pathsObject;
    
  }

  //pawns have more complicated rules for attacking and moving, so they get their own method
  const pawnVision = (piecesObject, occupiedObject, pieceName) => {

  }
  
  const knightRules = () => {
    const rules = {
      attacklogic: null,
      capture: "same",
      jump: true,
      castleing: false,
      paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]],
      vision: knightKingVision,
      movelogic: (x,y) => 
        x !== 0 !== y && 
        // y !== 0 && 
        x !== y &&
        x < 3 && x > -3 && 
        y < 3 && y > -3 && (
          x%2 === 0 ^ y%2 === 0 
        )
    }
    return rules;
  }
  const rookRules = () => {
    const rules = {
      movelogic: (x,y) => x === 0 ^ y === 0,
      castlelogic: (king, rook) => {
        return true;
      },
      paths: [[0,-1],[1,0],[0,1],[-1,0]],
      attacklogic: null,
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
      capture: "same",
      jump: false,
      castleing: false,
      vision: rookBishopQueenVision
    }
    return rules; 
  }
  const queenRules = () => {
    const rules = {
      movelogic: (x,y) => (
        x !== 0 && y !== 0 && 
          (x/y === 1 || x/y === -1)
        ) ^ (x === 0 ^ y === 0),
      paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
      attacklogic: null,
      capture: "same",
      jump: false,
      castleing: false,
      vision: rookBishopQueenVision
    }
    return rules; 
  }
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
      vision: knightKingVision
    }
    return rules;
  }
  const pawnRules = function(name){
    //RULES FOR EN PASSANT
    // the capturing pawn must be on its fifth rank;
    // the captured pawn must be on an adjacent file and must have just moved two squares in a single move (i.e. a double-step move);
    // the capture can only be made on the move immediately after the enemy pawn makes the double-step move; otherwise, the right to capture it en passant is lost.
    let colour = /^w/.test(name) ? 0 : 1;
    let direction = colour === 0 ? -1 : 1;
    const rules = {
      firstMove: true,
      colour: colour,
      jump: false,
      castleing: false,
      enPassant: true,
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
      paths: [[-1,direction], [1,direction]]
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