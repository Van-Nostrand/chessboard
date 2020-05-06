export default function rules(piece){
  
  const rookRules = function(){
    const rules = {
      move: [[7,0], [0,7], [-7,0], [0,-7]],
      capture: "same",
      jump: false,
      castleing: true,
      firstMove: false
    }
    return rules;
  }
  
  const knightRules = function(){
    const rules = {
      move: [[2,1], [2,-1], [1,2], [-1,2], [-2,1], [-2,-1], [1,-2], [-1,-2]],
      capture: "same",
      jump: true,
      castleing: false
    }
    return rules;
  }
  
  const bishopRules = function(){
    const rules = {
      move: [[7,7], [-7,7], [7,-7], [-7,-7]],
      capture: "same",
      jump: false,
      castleing: false
    }
    return rules; 
  }
  
  const queenRules = function(){
    const rules = {
      move: [[7,0], [0,7], [7,7], [-7,0], [0,-7], [-7,-7], [-7,7], [7,-7]],
      capture: "same",
      jump: false,
      castleing: false
    }
    return rules; 
  }
  
  const kingRules = function(){
    const rules = {
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
      move:  colour === 0 ? [[0,-1], [0,-2]] : [[0,1], [0,2]],
      capture: colour === 0 ? [[1,-1], [-1,-1]] : [[1,1], [-1,1]],
      jump: false,
      castleing: false,
      enPassant: true,
      firstMove: false
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

// const pieceRegex = {
//   rook: /^.R/,
//   knight: /^.N/,
//   queen: /^.Q/,
//   king: /^.K/,
//   bishop: /^.B/,
//   pawn: /^.P/
// };