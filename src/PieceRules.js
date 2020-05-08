export default function rules(piece){
  
  
  const knightRules = function(){
    const rules = {
      movecondition: (x,y) => x%2 === 0 && y%1 === 0 ^ y%2 === 0 && x%1 === 0,
      move: [[2,1], [2,-1], [1,2], [-1,2], [-2,1], [-2,-1], [1,-2], [-1,-2]],
      capture: "same",
      jump: true,
      castleing: false
    }
    return rules;
  }
  const rookRules = function(){
    const rules = {
      movecondition: (x,y) => x === 0 ^ y === 0,
      move: [[7,0], [0,7], [-7,0], [0,-7]],
      capture: "same",
      jump: false,
      castleing: true,
      firstMove: false
    }
    return rules;
  }
  const bishopRules = function(){
    const rules = {
      movecondition: (x,y) => x%y === 0,
      move: [[7,7], [-7,7], [7,-7], [-7,-7]],
      capture: "same",
      jump: false,
      castleing: false
    }
    return rules; 
  }
  const queenRules = function(){
    const rules = {
      movecondition: (x,y) => x%y === 0 || (x === 0 ^ y === 0),
      move: [[7,0], [0,7], [7,7], [-7,0], [0,-7], [-7,-7], [-7,7], [7,-7]],
      capture: "same",
      jump: false,
      castleing: false
    }
    return rules; 
  }
  const kingRules = function(){
    const rules = {
      movecondition: (x,y) => x < 2 && x > -2 && y < 2 && y > -2,
      move: [[0,1], [1,1], [1,0], [-1,0], [-1,-1], [0,-1], [1,-1], [-1,1]],
      capture: "same",
      jump: false,
      castleing: true,
      inCheck: false,
      firstMove: false
    }
    return rules;
  }
  const pawnRules = function(name){
    //RULES FOR EN PASSANT
    // the capturing pawn must be on its fifth rank;
    // the captured pawn must be on an adjacent file and must have just moved two squares in a single move (i.e. a double-step move);
    // the capture can only be made on the move immediately after the enemy pawn makes the double-step move; otherwise, the right to capture it en passant is lost.
  
    //array describing valid moves
    let colour = /^w/.test(name) ? 0 : 1;
    const rules = {
      firstMove: true,
      colour: colour,
      jump: false,
      castleing: false,
      enPassant: true,
      capture: colour === 0 ? [[1,-1], [-1,-1]] : [[1,1], [-1,1]],
      move: colour === 0 ? [[0,-1], [0,-2]] : [[0,1], [0,2]],
    }   
    return rules;
  }
  class RookGovernor{
    constructor(){
      this.movecondition = (x,y) => x === 0 ^ y === 0;
      this.move = [[7,0], [0,7], [-7,0], [0,-7]];
      this.capture = "same";
      this.jump = false;
      this.castleing = true;
      this.firstMove = false;
    }
  }
  class KnightGovernor{
    constructor(){
      this.movecondition = (x,y) => x%2 === 0 && y%1 === 0 ^ y%2 === 0 && x%1 === 0;
      this.move = [[2,1], [2,-1], [1,2], [-1,2], [-2,1], [-2,-1], [1,-2], [-1,-2]];
      this.capture = "same";
      this.jump = true;
      this.castleing = false;
    }
  }
  class BishopGovernor{
    constructor(){
      this.movecondition = (x,y) => x%y === 0;
      this.move = [[7,7], [-7,7], [7,-7], [-7,-7]];
      this.capture = "same";
      this.jump = false;
      this.castleing = false;
    }
  }
  class QueenGovernor{
    constructor(){
      this.movecondition = (x,y) => x%y === 0 || (x === 0 ^ y === 0);
      this.move = [[7,0], [0,7], [7,7], [-7,0], [0,-7], [-7,-7], [-7,7], [7,-7]];
      this.capture = "same";
      this.jump = false;
      this.castleing = false;
    }
  }
  class KingGovernor {
    constructor(){
      this.movecondition = (x,y) => x < 2 && x > -2 && y < 2 && y > -2;
      this.move = [[0,1], [1,1], [1,0], [-1,0], [-1,-1], [0,-1], [1,-1], [-1,1]];
      this.capture = "same";
      this.jump = false;
      this.castleing = true;
      this.inCheck = false;
      this.firstMove = false;
    }
  }
  class PawnGovernor {
    constructor(colour){
      this.firstMove = true;
      this.jump = false;
      this.castleing = false;
      this.enPassant = true;
      this.capture = colour === 0 ? [[1,-1], [-1,-1]] : [[1,1], [-1,1]];
      this.move = colour === 0 ? [[0,-1], [0,-2]] : [[0,1], [0,2]];
      this.movecondition = (x,y) => colour === 0 ?
        x === 0 && y === (!this.firstMove ? -1 : -1 || -2):
        x === 0 && y === (!this.firstMove ? 1 : 1 || 2);
    }
  }
  
  switch(true){
    case /^.R/.test(piece): return new RookGovernor();
    case /^.N/.test(piece): return new KnightGovernor();
    case /^.B/.test(piece): return new BishopGovernor();
    case /^.Q/.test(piece): return new QueenGovernor();
    case /^.K/.test(piece): return new KingGovernor();
    case /^.P/.test(piece): return new PawnGovernor(/^w/.test(piece) ? 0 : 1);
    default: console.log(`error getting rules. piece is ${piece}`);
  }
}