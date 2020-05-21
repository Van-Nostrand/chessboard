//this unfinished class will build objects and arrays with which the governor will use to make decisions
class ChessBuilder {

  //this returns an object with a list of coordinates of each piece, the key being the coordinate and the value being the piece name
  //returns an object
  //DEPRECIATED - reimplemented inside TestBoard
  static buildPathGrid = (piecesObject) => {
    let grid = {};
    let piecenames = Object.keys(piecesObject);
    piecenames.forEach((piece, i) => {
      let str = `${piecesObject[piece].xC},${piecesObject[piece].yC}`;
      grid[str] = piece;
    }) ;
    return grid;
  }

  static buildAttackProfile = (piecesObject, pieceName) => {

    //rook, bishop, and queen all can have the same pathfinding methods
    //king, pawn, knight will all need their own special cases

    debugger;
    let pathsObject = {};
    let pathGrid = this.buildPathGrid(piecesObject);

    let piecenames = Object.keys(piecesObject);
    let subject = piecesObject[pieceName];

    //foreach path?
    let count = 1;
    subject.rules.paths.forEach((path, i) => {
      //chase down each path until it hits a piece

      let pathDone = false;
      let pathArr = [];
      do{
        let cellCheck = `${subject.xC + (path[0] * count)},${subject.yC + (path[1] * count)}`;

        //if the cell being checked does not show up in the list of occupied cells, it is a valid move so push that cell to the array 
        if (!pathGrid[cellCheck]){
          pathArr.push(cellCheck);
          count = count + 1;
        }else{
          pathDone = true;
          count = 1;
        }

      }while(!pathDone);
      pathsObject[path] = pathArr;
     
    })
    return pathsObject;
  }

  

  //this takes in all the piece data and returns an object that details for every piece which pieces it can attack
  //piecesObject = object
  //returns an object
  //TODO - it's still not 100%... clean this up
  //TODO - elminiate the hard-coded BOARDLIMIT somehow
  //TODO - rather than building two different grids, just build one grid that lists cells under attack
  //TODO - consider only building this grid for kings and whatever piece is selected each turn
  static buildAttackGrid = (piecesObject) => {
    const BOARDLIMIT = 8; //size of board is hardcoded. Phase this out
    let pathgrid = this.buildPathGrid(piecesObject);
    let newAttackGrid = {};
    let piecenames = Object.keys(piecesObject);
    let newPieceState = {...piecesObject};
    
    //for every piece
    piecenames.forEach((piece, i) => {
     
      let pieceX = newPieceState[piece].xC;
      let pieceY = newPieceState[piece].yC;
      newAttackGrid[piece] = new Array(newPieceState[piece].rules.paths);

      //for every piece's pathing array
      newAttackGrid[piece] = newAttackGrid[piece].map((pathArr, j) => {

        //return an array of paths that are valid for attacking
        return pathArr.map((path, n) => {
          let morePaths = true;
          let counter = 1;
          let newMoveArr = [];
          let newAttackArr = [];
          
          do{
            // Knights have different path rules
            if(newPieceState[piece].rules.jump){
              let testX = pieceX + path[0];
              let testY = pieceY + path[1];
              let str = `${testX},${testY}`;
              
              //if within boundaries of board
              if(testX >= 0 && testY >= 0 && testX < BOARDLIMIT && testY < BOARDLIMIT){
                //if an empty cell for movin'
                if(!pathgrid[str] && newPieceState[piece].rules.movelogic(path[0],path[1])){
                  newMoveArr.push(str);
                  morePaths = false;
                }
                //if an occupied cell for fight'un
                else if(pathgrid[str] && newPieceState[piece].rules.movelogic(testX,testY)){
                  newAttackArr.push(pathgrid[str]);
                  morePaths = false;
                }
                else{
                  morePaths = false;
                }
              }
              else {
                morePaths = false;
              }
            } 
            //for every other piece
            else {
              let testX = pieceX + (counter * path[0]);
              let testY = pieceY + (counter * path[1]);
              let str = `${testX},${testY}`;
             
              //if not within board boundaries
              if(testX < 0 || testY < 0 || testX > BOARDLIMIT - 1 || testY > BOARDLIMIT - 1){
                morePaths = false;
              } else {
                //if a piece exists on this cell
                if(pathgrid[str]) {
                  //if on same team
                  if(piece.charAt(0) === pathgrid[str].charAt(0)) {
                    morePaths = false;
                  //if not on the same team
                  } else {
                    //most pieces
                    if(!newPieceState[piece].rules.attacklogic && newPieceState[piece].rules.movelogic(testX,testY)){
                      newAttackArr.push(pathgrid[str]);
                    }
                    //special case for pawns
                    else if(newPieceState[piece].rules.attacklogic && newPieceState[piece].rules.attacklogic(testX,testY)){
                      newAttackArr.push(pathgrid[str]);
                    }
                  }
                //if no piece exists here 
                } else {
                  //if the piece can legally move here
                  if(newPieceState[piece].rules.movelogic(testX,testY)){
                    newMoveArr.push(str);
                  }
                  else{
                    morePaths = false;
                  }
                }
                //condition to catch endless loops during development
                if (counter > 10) {
                  console.log("runaway do-while loop");
                  morePaths = false;
                }
              }
            }
            ++counter;
          }while(morePaths);
          return newMoveArr;
        })
      })
    });
    return newAttackGrid;    
  }
}

export default ChessBuilder;