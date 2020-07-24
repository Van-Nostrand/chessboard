/*==== PAWNS ====
attacklogic() - similar to movelogic(), this pawn-exclusive function determines if a pawn can attack
direction - a property set by this.name.charAt(0) which determines the direction this pawn may move in
promotion - an unimplemented property to determine if the piece has promoted or not, however this will likely not be used. 
fifthRank - an integer which represents the pawns 5th rank. Used to track en passant checks. 
*/
export default class PawnClass{
  
  static attacklogic = (x,y, direction) => (x === 1 || x === -1) && (y === 1 * direction);

  
  static movelogic = (x, y, direction, firstMove) => {

    let success = false;
    if(direction > 0){
      if(firstMove) {
        success = x === 0 && (y === 1 || y === 2);
      } 
      else if(!firstMove) {
        success = x === 0 && y === 1;
      }
    }
    else if(direction < 0){
      if(firstMove) {
        success = x === 0 && (y === -1 || y === -2);
      } 
      else if(!firstMove) {
        success = x === 0 && y === -1;
      }
    }
    return success;
  };

  //not needed?
  static enpassantlogic = (x,y,targetcell,victim) => {
    return (
      targetcell[0] === victim[0] && 
      (targetcell[1] === victim[1] + 1 || 
        targetcell[1] === victim[1] - 1));
  };

  static vision = (cellMap, piecesObject, name, enPassantPiece) => {
    let {x, y, fifthRank, paths, firstMove} = piecesObject[name];
    let BOARDSIZE = 8;
   
    // create an empty object that will store potential moves
    let pathsObject = {};
    let direction = name.charAt(0) === "w" ? -1 : 1;

    // for each path
    paths.forEach((path, i) => {

      let checkX = path[0] + x;
      let checkY = path[1] + y;

      // if the cell is within the board
      if(checkX >= 0 && checkX < BOARDSIZE && checkY >= 0 && checkY < BOARDSIZE){

        let cellString = `${path[0] + x},${path[1] + y}`;

        //cell contains a piece
        if(cellMap[cellString]){
          let testedCell = cellMap[cellString];
  
          // piece is an enemy
          if(testedCell.charAt(0) !== name.charAt(0)){
  
            // if residing in attack path, create key/value "cell,coordinates": [x,y,"a"]
            if(PawnClass.attacklogic(path[0],path[1])){
              pathsObject[cellString] = "a";
              
            }
          }
        }
        // cell is empty
        else {
          //cell in move path
          if (checkX === x){
            if(firstMove){
              pathsObject[cellString] = "m";

            }
            else if(!firstMove && Math.abs(path[1]) === 1){
              pathsObject[cellString] = "m";
            }
          }
          else if (fifthRank === y ){
            debugger;
            // if enemy pawn in cell "behind" empty cell
            let EPTest = `${cellString.charAt(0)},${parseInt(cellString.charAt(2)) - direction}`;
            if(cellMap[EPTest] && cellMap[EPTest].charAt(0) !== name.charAt(0) && cellMap[EPTest].charAt(1) === "P"){
            
              // if piece just moved two spaces
              let EPEnemy = piecesObject[cellMap[EPTest]];
              if(EPEnemy.name === enPassantPiece){ 
    
                // create key/value "cell,coordinates": [x,y,"e"] to denote empty attack cell
                pathsObject[cellString] = "e";
                return;
              }
            }
          }
        }
        
        // cell is empty and in attack path and piece on 5th rank 
        // EN PASSANT
        // else if (fifthRank === y && !cellMap[cellString] && PawnClass.attacklogic(path[0],path[1])){
          
          // if enemy pawn in cell "behind" empty cell
          // let EPTest = `${cellString.charAt(0)},${parseInt(cellString.charAt(2)) - direction}`;
          // if(cellMap[EPTest].charAt(0) !== name.charAt(0) && cellMap[EPTest].charAt(1) === "P"){
            
          //   // if piece just moved two spaces
          //   let EPEnemy = piecesObject[cellMap[EPTest]];
          //   if(EPEnemy === this.state.enPassantPiece){ 
  
          //     // create key/value "cell,coordinates": [x,y,"e"] to denote empty attack cell
          //     pathsObject[cellString] = "e";
          //     return;
          //   }
          // }
      }

    });
    return pathsObject;

  }

}