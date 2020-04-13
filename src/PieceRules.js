export function rules(piece){
    switch(piece.name){
        case /^.R/: return rookRules;
        case /^.N/: return knightRules;
        case /^.B/: return bishopRules;
        case /^.Q/: return queenRules;
        case /^.K/: return kingRules;
        case /^.P/: return pawnRules;
    }
}

const rookRules = function(){
    
}

let pieceRegex = {
    rook: /^.R/,
    knight: /^.N/,
    queen: /^.Q/,
    king: /^.K/,
    bishop: /^.B/,
    pawn: /^.P/
};