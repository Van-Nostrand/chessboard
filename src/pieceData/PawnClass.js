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
    
    this.view = {};
    this.firstMove = true;
    this.enPassant = false;
    this.promotion = false; 
    this.direction = direction;
    this.fifthRank = direction === -1 ? 3 : 4;
  }
  
  attacklogic = (x,y) => (x === 1 || x === -1) && (y === 1 * this.direction);

  movelogic = (x, y) => {
    if(this.firstMove) {
      return x === 0 && (y === 1 * this.direction || y === 2 * this.direction);
    } else if(!this.firstMove) {
      return x === 0 && y === 1 * this.direction ;
    }
  };

  enPassantOrMove = () => {

  }

  flagInPassing = () => {
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
          return;
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