/*
==== KINGS ====
amIChecked() - this looks for attackers and reports them back

TODO - make amIChecked a function that returns bool instead of a list of cells. not important now to know every cell that can attack, just need to know if one can
*/
export default class KingClass{
  

  static movelogic = (x,y) => x < 2 && x > -2 && y < 2 && y > -2;
  
  //not implemented yet
  static castlelogic = (king, rook) => {
      return true;
  };

  static getPaths = () => {
    return [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  }

  //add in an option for castleing
  //spaces will be labelled "c" if castling possible
  static vision = (cellMap, piecesObject, name) => {
    let {x, y, paths, firstMove} = piecesObject[name];
    
    let pathsObject = {};
    const BOARDSIZE = 8;
    const TEAMCOLOUR = /^w/.test(name) ? "w" : "b";

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
      else if(cellMap[cellCheck] && cellMap[cellCheck].charAt(0) === name.charAt(0)){
        pathsObject[cellCheck] = "b";
      }
    });
    let rook1 = new RegExp("^" + TEAMCOLOUR + "R1");
    let rook2 = new RegExp("^" + TEAMCOLOUR + "R2");
    //CASTLING VIEW
    //has king taken first move?
    if(firstMove){
      //is R1 at 0,y and has it moved yet?
      if(cellMap[`0,${y}`] && rook1.test(cellMap[`0,${y}`]) && piecesObject[cellMap[`0,${y}`]].firstMove){
        //are [1,y] [2,y] and [3,y] empty?
        if(!cellMap[`2,${y}`] && !cellMap[`1,${y}`] && !cellMap[`3,${y}`]){
          // checkmate check at [2,y] and [3,y]
          let longPieces2y = this.amIChecked(cellMap, {...piecesObject, [name]: {...piecesObject[name], x: 2, y}}, name);
          let longPieces3y = this.amIChecked(cellMap, {...piecesObject, [name]: {...piecesObject[name], x:3, y}}, name);
          if(Object.keys(longPieces2y).length === 0 && Object.keys(longPieces3y).length === 0){
            pathsObject[`2,${y}`] = "c";
          }
        }
      }
      //is R2 at 7,y and has it moved yet?
      if(cellMap[`7,${y}`] && rook2.test(cellMap[`7,${y}`]) && piecesObject[cellMap[`7,${y}`]].firstMove){
        //are [5,y] and [6,y] empty?
        if(!cellMap[`6,${y}`] && !cellMap[`5,${y}`]){
  
          // checkmate check at [5,y] and [6,y]
          let shortPieces5y = this.amIChecked(cellMap, {...piecesObject, [name]: {...piecesObject[name], x: 5, y}}, name);
          let shortPieces6y = this.amIChecked(cellMap, {...piecesObject, [name]: {...piecesObject[name], x: 6, y}}, name);
          if(Object.keys(shortPieces5y).length === 0 && Object.keys(shortPieces6y).length === 0){
            pathsObject[`6,${y}`] = "c";
          }
        }
      }
    }
    return pathsObject;
  }

  static amIChecked = (cellMap, piecesObject, name) => {
    
    let pathsObject = {};
    const BOARDSIZE = 8;
    let enemyChar = name.charAt(0) === "w" ? "b" : "w";
    
    let bishopPaths = [[1,-1], [1,1], [-1,1], [-1,-1]];
    let rookPaths = [[0,-1], [1,0], [0,1], [-1,0]];
    let pawnPaths = [[-1,enemyChar === "w" ? -1 : 1], [1,enemyChar === "w" ? -1 : 1]];
    let knightPaths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2]];

    let queenReg = new RegExp("^" + enemyChar + "Q");
    let rookReg = new RegExp("^" + enemyChar + "R");
    let bishReg = new RegExp("^" + enemyChar + "B");
    let pawnRegex = new RegExp("^" + enemyChar + "P");
    let knightRegex = new RegExp("^" + enemyChar + "N");

    let testX = piecesObject[name].x;
    let testY = piecesObject[name].y;
    
    // test queen bishop attacks
    // for(let n = 0; n < bishopPaths.length; n++){
    bishopPaths.forEach((path, i) => {

      let startX = testX + path[0];
      let startY = testY + path[1];
      let pathDone = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        if(!pathDone){
          let cellTest = `${i},${j}`;
          // if cell in path contains enemy
          if (cellMap[cellTest] && (queenReg.test(cellMap[cellTest]) || bishReg.test(cellMap[cellTest]))){
            pathsObject[cellTest] = cellMap[cellTest];
            pathDone = true;
          }
          // else it's some other piece that can't attack. 
          else if (cellMap[cellTest]){
            pathDone = true;
          }
        }
      }
    });
    // }

    // test queen rook attacks
    rookPaths.forEach((path, i) => {

      let startX = testX + path[0];
      let startY = testY + path[1];
      let pathDone = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        if(!pathDone){
          let cellTest = `${i},${j}`;
          // if cell in path contains enemy
          if (cellMap[cellTest] && (queenReg.test(cellMap[cellTest]) || rookReg.test(cellMap[cellTest]))){
            pathsObject[cellTest] = cellMap[cellTest];
            pathDone = true;
          }
          // else it's some other piece that can't attack. 
          else if (cellMap[cellTest] ){
            pathDone = true;
          }
        }
      }
    });

    pawnPaths.forEach((path, i) => {
      let cellTest = `${testX + path[0]},${testY + path[1]}`;
      
      //test position
      if(cellMap[cellTest] && pawnRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    });

    knightPaths.forEach(path => {
      let cellTest = `${testX + path[0]},${testY + path[1]}`;

      if(cellMap[cellTest] && knightRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    });

    return pathsObject;
  }

  static amICheckedBool = (cellMap, piecesObject, name) => {
    
    let pathsObject = {};
    const BOARDSIZE = 8;
    let enemyChar = name.charAt(0) === "w" ? "b" : "w";
    
    let bishopPaths = [[1,-1], [1,1], [-1,1], [-1,-1]];
    let rookPaths = [[0,-1], [1,0], [0,1], [-1,0]];
    let pawnPaths = [[-1,enemyChar === "w" ? -1 : 1], [1,enemyChar === "w" ? -1 : 1]];
    let knightPaths = [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2]];

    let queenReg = new RegExp("^" + enemyChar + "Q");
    let rookReg = new RegExp("^" + enemyChar + "R");
    let bishReg = new RegExp("^" + enemyChar + "B");
    let pawnRegex = new RegExp("^" + enemyChar + "P");
    let knightRegex = new RegExp("^" + enemyChar + "N");

    let testX = piecesObject[name].x;
    let testY = piecesObject[name].y;
    
    // test queen bishop attacks
    for(let n = 0; n < bishopPaths.length; n++){

      let startX = testX + bishopPaths[n][0];
      let startY = testY + bishopPaths[n][1];

      for(let i = startX, j = startY, pathDone = false; !pathDone && i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += bishopPaths[n][0], j += bishopPaths[n][1]){
        let cellTest = `${i},${j}`;
        // if cell in path contains enemy
        if (cellMap[cellTest] && (queenReg.test(cellMap[cellTest]) || bishReg.test(cellMap[cellTest]))){
          return true;
        }
        // else it's some other piece that can't attack. 
        else if (cellMap[cellTest]){
          pathDone = true;
        }
      }
    }

    // test queen rook attacks
    for(let n = 0; n < rookPaths.length; n++){

    
      let startX = testX + rookPaths[n][0];
      let startY = testY + rookPaths[n][1];
      let pathDone = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += rookPaths[n][0], j += rookPaths[n][1]){
        if(!pathDone){
          let cellTest = `${i},${j}`;
          // if cell in path contains enemy
          if (cellMap[cellTest] && (queenReg.test(cellMap[cellTest]) || rookReg.test(cellMap[cellTest]))){
            pathsObject[cellTest] = cellMap[cellTest];
            pathDone = true;
          }
          // else it's some other piece that can't attack. 
          else if (cellMap[cellTest] ){
            pathDone = true;
          }
        }
      }
    }

    for(let n = 0; n < pawnPaths.length; n++){
      let cellTest = `${testX + pawnPaths[n][0]},${testY + pawnPaths[n][1]}`;
      
      //test position
      if(cellMap[cellTest] && pawnRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    }

    for(let n = 0; n < knightPaths.length; n++){
      let cellTest = `${testX + knightPaths[n][0]},${testY + knightPaths[n][1]}`;

      if(cellMap[cellTest] && knightRegex.test(cellMap[cellTest])){
        pathsObject[cellTest] = cellMap[cellTest];
      }
    }

    return pathsObject;
  }

}