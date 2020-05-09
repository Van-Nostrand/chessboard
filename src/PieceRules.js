export default function rulesets(piece){
  
  const knightRules = function(){
    const rules = {
      attacklogic: null,
      capture: "same",
      jump: true,
      castleing: false,
      movelogic: (x,y) => x !== 0 && y !== 0 && x < 3 && x > -3 && y < 3 && y > -3 && ((x%2 === 0 && y%1 === 0) ^ (y%2 === 0 && x%1 === 0))
    }
    return rules;
  }
  const rookRules = function(){
    const rules = {
      movelogic: (x,y) => x === 0 ^ y === 0,
      attacklogic: null,
      capture: "same",
      jump: false,
      castleing: true,
      firstMove: false
    }
    return rules;
  }
  const bishopRules = function(){
    const rules = {
      movelogic: (x,y) => x !== 0 && y !== 0 && (x/y === 1 || x/y === -1),
      attacklogic: null,
      capture: "same",
      jump: false,
      castleing: false
    }
    return rules; 
  }
  const queenRules = function(){
    const rules = {
      movelogic: (x,y) => (
        x !== 0 && y !== 0 && 
          (x/y === 1 || x/y === -1)
        ) ^ (x === 0 ^ y === 0),
      attacklogic: null,
      capture: "same",
      jump: false,
      castleing: false
    }
    return rules; 
  }
  const kingRules = function(){
    const rules = {
      movelogic: (x,y) => x < 2 && x > -2 && y < 2 && y > -2,
      attacklogic: null,
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
    let colour = /^w/.test(name) ? 0 : 1;
    let direction = colour === 0 ? -1 : 1;
    const rules = {
      firstMove: true,
      colour: colour,
      jump: false,
      castleing: false,
      enPassant: true,
      movelogic: (x, y) => x === 0 && (!rules.firstMove? y === 1 * direction : y === 1 * direction || y === 2 * direction),
      attacklogic: (x,y) => (x === 1 || x === -1) && (y === 1 * direction)
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