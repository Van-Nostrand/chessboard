/*==== PAWNS ====
attacklogic() - similar to movelogic(), this pawn-exclusive function determines if a pawn can attack
direction - a property set by this.name.charAt(0) which determines the direction this pawn may move in
promotion - an unimplemented property to determine if the piece has promoted or not, however this will likely not be used. 
fifthRank - an integer which represents the pawns 5th rank. Used to track en passant checks. 
*/
import PieceClass from "./PieceClass";

export default class PawnClass extends PieceClass{
  constructor(name, x, y, pngPos, direction){
    super(name, x, y, pngPos, [[0,direction],[0,direction + direction],[-1,direction], [1,direction]], false);
    
    this.firstMove = true;
    this.justHadFirstMove = false;
    this.enPassant = false;
    this.enPassantTurn = 0;
    this.promotion = false; 
    this.direction = direction;
    this.fifthRank = direction === -1 ? 3 : 4;
  }
  
  attacklogic = (x,y) => (x === 1 || x === -1) && (y === 1 * this.direction);

  movelogic = (x, y) => {
    let success = false;
    if(this.firstMove) {

      success = x === 0 && (y === 1 * this.direction || y === 2 * this.direction);
    } else if(!this.firstMove) {
      success = x === 0 && y === 1 * this.direction ;
    }
    //if the move is ok and it's a double move, flag for enpassant and "just had first move"
    if(success && (y === 2 || y === -2)){
      this.enPassant = true;
      this.justHadFirstMove = true;
      return success;
    }
    //if the move is ok and the "just had first move" flag is set, it needs to be cleared
    else if (success && this.justHadFirstMove){
      this.justHadFirstMove = false;
      this.enPassant = false;
      return success;
    }
    else{
      return success;
    }
  };

  flagInPassing = (turnNumber) => {
    this.enPassant = true;
    this.enPassantTurn = turnNumber;
  }

  //not needed?
  enpassantlogic = (x,y,targetcell,victim) => {
    return (
      targetcell[0] === victim[0] && 
      (targetcell[1] === victim[1] + 1 || 
        targetcell[1] === victim[1] - 1));
  };

  vision = (cellMap, piecesObject) => {
   
    // create an empty object that will store potential moves
    let pathsObject = {};

    // for each path
    this.paths.forEach((path, i) => {

      // refer to coordinates in game ledger to determine if cell(s) are occupied
      let cellString = `${path[0] + this.x},${path[1] + this.y}`;
      if(cellMap[cellString]){
        let testedCell = cellMap[cellString];

        // if enemy in cell
        if(testedCell.charAt(0) !== this.name.charAt(0)){

          // if residing in attack path, create key/value "cell,coordinates": [x,y,"a"]
          if(this.attacklogic(path[0],path[1])){
            pathsObject[cellString] = "a";
            
          }
        }
      }

      // cell is empty and in move path
      else if (!cellMap[cellString] && this.movelogic(path[0],path[1])){
        pathsObject[cellString] = "m";
      }
      
      // cell is empty and in attack path and piece on 5th rank 
      // EN PASSANT
      else if (!cellMap[cellString] && this.attacklogic(path[0],path[1]) && this.fifthRank === this.y){
        
        // if enemy pawn in cell "behind" empty cell
        let EPTest = `${cellString.charAt(0)},${parseInt(cellString.charAt(2)) - this.direction}`;
        if(cellMap[EPTest].charAt(0) !== this.name.charAt(0) && cellMap[EPTest].charAt(1) === "P"){
          
          // if piece just moved two spaces
          let EPEnemy = piecesObject[cellMap[EPTest]];
          if(EPEnemy.enPassant){

            // create key/value "cell,coordinates": [x,y,"e"] to denote empty attack cell
            pathsObject[cellString] = "e";
            return;
          }
        }
      }
    })
    // return "moves" object
    this.newview = pathsObject;
    return pathsObject;

  }

}