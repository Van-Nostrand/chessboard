/*==== PAWNS ====
attacklogic() - similar to movelogic(), this pawn-exclusive function determines if a pawn can attack
direction - a property set by this.name.charAt(0) which determines the direction this pawn may move in
promotion - an unimplemented property to determine if the piece has promoted or not, however this will likely not be used. 
fifthRank - an integer which represents the pawns 5th rank. Used to track en passant checks. 
*/
export default class PawnClass{
  
  static attacklogic = (x,y, direction) => (x === 1 || x === -1) && (y === 1 * this.direction);

  static movelogic = (x, y, direction, firstMove, justHadFirstMove) => {
    let success = false;
    let enPassant;
    if(firstMove) {
      success = x === 0 && (y === 1 * direction || y === 2 * direction);
    } else if(!firstMove) {
      success = x === 0 && y === 1 * direction ;
    }
    //if the move is ok and it's a double move, flag for enpassant and "just had first move"
    if(success && (y === 2 || y === -2)){
      enPassant = true;
      justHadFirstMove = true;
      return [success, enPassant, justHadFirstMove];
    }
    //if the move is ok and the "just had first move" flag is set, it needs to be cleared
    else if (success && justHadFirstMove){
      justHadFirstMove = false;
      enPassant = false;
      return [success, enPassant, justHadFirstMove];
    }
    else{
      return [success, enPassant, justHadFirstMove];
    }
  };

  //not needed?
  static enpassantlogic = (x,y,targetcell,victim) => {
    return (
      targetcell[0] === victim[0] && 
      (targetcell[1] === victim[1] + 1 || 
        targetcell[1] === victim[1] - 1));
  };

  static vision = (cellMap, piecesObject, name) => {
    let {x, y, fifthRank, paths} = piecesObject[name];
   
    // create an empty object that will store potential moves
    let pathsObject = {};
    let direction = name.charAt(0) === "w" ? -1 : 1;

    // for each path
    paths.forEach((path, i) => {

      // refer to coordinates in game ledger to determine if cell(s) are occupied
      let cellString = `${path[0] + x},${path[1] + y}`;
      if(cellMap[cellString]){
        let testedCell = cellMap[cellString];

        // if enemy in cell
        if(testedCell.charAt(0) !== name.charAt(0)){

          // if residing in attack path, create key/value "cell,coordinates": [x,y,"a"]
          if(PawnClass.attacklogic(path[0],path[1])){
            pathsObject[cellString] = "a";
            
          }
        }
      }

      // cell is empty and in move path
      else if (!cellMap[cellString] && PawnClass.movelogic(path[0],path[1])){
        pathsObject[cellString] = "m";
      }
      
      // cell is empty and in attack path and piece on 5th rank 
      // EN PASSANT
      else if (!cellMap[cellString] && PawnClass.attacklogic(path[0],path[1]) && fifthRank === y){
        
        // if enemy pawn in cell "behind" empty cell
        let EPTest = `${cellString.charAt(0)},${parseInt(cellString.charAt(2)) - direction}`;
        if(cellMap[EPTest].charAt(0) !== name.charAt(0) && cellMap[EPTest].charAt(1) === "P"){
          
          // if piece just moved two spaces
          let EPEnemy = piecesObject[cellMap[EPTest]];
          if(EPEnemy.enPassant){

            // create key/value "cell,coordinates": [x,y,"e"] to denote empty attack cell
            pathsObject[cellString] = "e";
            return;
          }
        }
      }
    });
    return pathsObject;

  }

}