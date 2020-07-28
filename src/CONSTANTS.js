export const BOARDDIMENSIONS = [8,8];
export const TILESIZE = 60;
export const TILEBORDERSIZE = 1;
export const LIGHT_TILE = "#f98f39";
export const DARK_TILE = "#603d0b";
// export const PIECE_OBJECTS = {
//   "wR1": {pngPos: "130px -3px", firstMove: true, dead: false, paths: [], name: "wR1", view: {}, x: 0, y: 7},
//   "wR2": {pngPos: "130px -3px", firstMove: true, dead: false, paths: [], name: "wR2", view: {}, x: 7, y: 7},
//   "wN1": {pngPos: "197px -3px", dead: false, paths: [], name: "wN1", view: {}, x: 1, y: 7},
//   "wN2": {pngPos: "197px -3px", dead: false, paths: [], name: "wN2", view: {}, x: 6, y: 7},
//   "wB1": {pngPos: "-136px -3px", dead: false, paths: [], name: "wB1", view: {}, x: 2, y: 7},
//   "wB2": {pngPos: "-136px -3px", dead: false, paths: [], name: "wB2", view: {}, x: 5, y: 7},
//   "wK": {checkView: {}, firstMove: true, pngPos: "-4px -3px", dead: false, paths: [], name: "wK", view: {}, x: 4, y: 7},
//   "wQ": {pngPos: "-70px -3px", dead: false, paths: [], name: "wQ", view: {}, x: 3, y: 7},
//   "wP1": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP1", view: {}, x: 0, y: 6},
//   "wP2": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP2", view: {}, x: 1, y: 6},
//   "wP3": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP3", view: {}, x: 2, y: 6},
//   "wP4": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP4", view: {}, x: 3, y: 6},
//   "wP5": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP5", view: {}, x: 4, y: 6},
//   "wP6": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP6", view: {}, x: 5, y: 6},
//   "wP7": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP7", view: {}, x: 6, y: 6},
//   "wP8": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP8", view: {}, x: 7, y: 6},
//   "bR1": {pngPos: "130px 63px", firstMove: true, dead: false, paths: [], name: "bR1", view: {}, x: 0, y: 0},
//   "bR2": {pngPos: "130px 63px", firstMove: true, dead: false, paths: [], name: "bR2", view: {}, x: 7, y: 0},
//   "bN1": {pngPos: "197px 63px", dead: false, paths: [], name: "bN1", view: {}, x: 1, y: 0},
//   "bN2": {pngPos: "197px 63px", dead: false, paths: [], name: "bN2", view: {}, x: 6, y: 0},
//   "bB1": {pngPos: "-136px 63px", dead: false, paths: [], name: "bB1", view: {}, x: 2, y: 0},
//   "bB2": {pngPos: "-136px 63px", dead: false, paths: [], name: "bB2", view: {}, x: 5, y: 0},
//   "bK": {checkView: {}, pngPos: "-4px 63px", firstMove: true, dead: false, paths: [], name: "bK", view: {}, x: 4, y: 0},
//   "bQ": {pngPos: "-70px 63px", dead: false, paths: [], name: "bQ", view: {}, x: 3, y: 0},
//   "bP1": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP1", view: {}, x: 0, y: 1},
//   "bP2": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP2", view: {}, x: 1, y: 1},
//   "bP3": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP3", view: {}, x: 2, y: 1},
//   "bP4": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP4", view: {}, x: 3, y: 1},
//   "bP5": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP5", view: {}, x: 4, y: 1},
//   "bP6": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP6", view: {}, x: 5, y: 1},
//   "bP7": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP7", view: {}, x: 6, y: 1},
//   "bP8": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP8", view: {}, x: 7, y: 1},
// };
//PAWN PROMOTION TEST
export const PIECE_OBJECTS = {
  "wK": {checkView: {}, firstMove: true, pngPos: "-4px -3px", dead: false, paths: [], name: "wK", view: {}, x: 4, y: 7},
  "bK": {checkView: {}, pngPos: "-4px 63px", firstMove: true, dead: false, paths: [], name: "bK", view: {}, x: 4, y: 0},
  "wP1": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [], name: "wP1", view: {}, x: 0, y: 2},
  "bP8": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [], name: "bP8", view: {}, x: 7, y: 6},
};
export const PIECE_PROTOTYPES = {
  "R": {WpngPos: "130px -3px", BpngPos: "130px 63px", firstMove: true, dead: false, paths: [], name: "", view: {}, x: 0, y: 0},
  "Q": {WpngPos: "-70px -3px", BpngPos: "-70px 63px", dead: false, paths: [], name: "", view: {}, x: 0, y: 0},
  "K": {WpngPos: "-4px -3px", BpngPos: "-4px 63px", firstMove: true, dead: false, paths: [], name: "", view: {}, checkView: {}, x: 0, y: 0},
  "P": {enPassant: false, firstMove: true, BfifthRank: 4, WfifthRank: 3, BpngPos: "65px 63px", WpngPos: "65px -3px", dead: false, paths: [], name: "", view: {}, x: 0, y: 0},
  "N": {WpngPos: "197px -3px",BpngPos: "197px 63px", dead: false, paths: [], name: "", view: {}, x: 0, y: 0},
  "B": {WpngPos: "-136px -3px", BpngPos: "-136px 63px", dead: false, paths: [], name: "", view: {}, x: 0, y: 0}
}
export const PIECEPATHS = {
  "Q": [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
  "K": [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
  "B": [[1,-1],[1,1],[-1,1],[-1,-1]],
  "N": [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]],
  "bP": [[0,1],[0,2],[-1,1], [1,1]],
  "wP": [[0,-1],[0,-2],[-1,-1], [1,-1]],
  "R": [[0,-1],[1,0],[0,1],[-1,0]]
}