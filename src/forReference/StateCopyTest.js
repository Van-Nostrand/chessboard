import React, {Component} from "react";


// used this to test a recursive state copy method, and compare it to json.parse(json.stringify())
class StateCopyTest extends Component{
  constructor(props){
    super(props);

    this.state = {
      piecesObject: {
        "wR1": {pngPos: "130px -3px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "wR1", view: {}, x: 0, y: 7},
        "wR2": {pngPos: "130px -3px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "wR2", view: {}, x: 7, y: 7},
        "wN1": {pngPos: "197px -3px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "wN1", view: {}, x: 1, y: 7},
        "wN2": {pngPos: "197px -3px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "wN2", view: {}, x: 6, y: 7},
        "wB1": {pngPos: "-136px -3px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "wB1", view: {}, x: 2, y: 7},
        "wB2": {pngPos: "-136px -3px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "wB2", view: {}, x: 5, y: 7},
        "wK": {checkView: {}, firstMove: true, pngPos: "-4px -3px", dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "wK", view: {}, x: 4, y: 7},
        "wQ": {pngPos: "-70px -3px", dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "wQ", view: {}, x: 3, y: 7},
        "wP1": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP1", view: {}, x: 0, y: 6},
        "wP2": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP2", view: {}, x: 1, y: 6},
        "wP3": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP3", view: {}, x: 2, y: 6},
        "wP4": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP4", view: {}, x: 3, y: 6},
        "wP5": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP5", view: {}, x: 4, y: 6},
        "wP6": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP6", view: {}, x: 5, y: 6},
        "wP7": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP7", view: {}, x: 6, y: 6},
        "wP8": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP8", view: {}, x: 7, y: 6},
        "bR1": {pngPos: "130px 63px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "bR1", view: {}, x: 0, y: 0},
        "bR2": {pngPos: "130px 63px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "bR2", view: {}, x: 7, y: 0},
        "bN1": {pngPos: "197px 63px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "bN1", view: {}, x: 1, y: 0},
        "bN2": {pngPos: "197px 63px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "bN2", view: {}, x: 6, y: 0},
        "bB1": {pngPos: "-136px 63px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "bB1", view: {}, x: 2, y: 0},
        "bB2": {pngPos: "-136px 63px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "bB2", view: {}, x: 5, y: 0},
        "bK": {checkView: {}, pngPos: "-4px 63px", firstMove: true, dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "bK", view: {}, x: 4, y: 0},
        "bQ": {pngPos: "-70px 63px", dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "bQ", view: {}, x: 3, y: 0},
        "bP1": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP1", view: {}, x: 0, y: 1},
        "bP2": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP2", view: {}, x: 1, y: 1},
        "bP3": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP3", view: {}, x: 2, y: 1},
        "bP4": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP4", view: {}, x: 3, y: 1},
        "bP5": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP5", view: {}, x: 4, y: 1},
        "bP6": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP6", view: {}, x: 5, y: 1},
        "bP7": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP7", view: {}, x: 6, y: 1},
        "bP8": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP8", view: {}, x: 7, y: 1},
      }
    };
  }


  recursiveStateCopy = (oldstate) => {
    let newState = {};
    Object.keys(oldstate).forEach(key => {
      // debugger;
      if(typeof(oldstate[key]) === "object" && !Array.isArray(oldstate[key])){
        newState[key] = this.recursiveStateCopy(oldstate[key]);
      }
      else if(typeof(oldstate[key]) === "object" && Array.isArray(oldstate[key])){
        newState[key] = oldstate[key].map(value => {
          if(Array.isArray(value)){
            return value.map(subvalue => subvalue);
          }
          else return value;
        });
      }
      else if(typeof(oldstate[key]) === "string"){
        newState[key] = new String(oldstate[key]);
      }
      else {
        newState[key] = oldstate[key];
      }
    });
    return newState;
  }


  jsonParseCopy = (oldstate) => {
    return JSON.parse(JSON.stringify(oldstate));
  }

  render(){

    let recursivetimestart = Date.now();
    let newState = this.recursiveStateCopy(this.state.piecesObject);
    let recursivetimeend = Date.now();

    let jparsetimestart = Date.now();
    let newstate2 = this.jsonParseCopy(this.state.piecesObject);
    let jparsetimeend = Date.now();

    console.log(recursivetimestart);
    console.log(recursivetimeend);
    console.log(jparsetimestart);
    console.log(jparsetimeend);

    console.log(`custom recursive method took ${recursivetimeend - recursivetimestart}ms`);
    console.log(`JSON.parse(JSON.stringify()) took ${jparsetimeend - jparsetimestart}ms`);

    return(
      <div>
        TESTPAGE
      </div>
    )
  }
}

export default StateCopyTest;
/**

export const PIECEPATHS = {
  "Q": [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
  "K": [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]],
  "B": [[1,-1],[1,1],[-1,1],[-1,-1]],
  "N": [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]],
  "bP": [[0,1],[0,2],[-1,1], [1,1]],
  "wP": [[0,-1],[0,-2],[-1,-1], [1,-1]],
  "R": [[0,-1],[1,0],[0,1],[-1,0]]
}
 */

/* {
  "wR1": {pngPos: "130px -3px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "wR1", view: {}, x: 0, y: 7},
  "wR2": {pngPos: "130px -3px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "wR2", view: {}, x: 7, y: 7},
  "wN1": {pngPos: "197px -3px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "wN1", view: {}, x: 1, y: 7},
  "wN2": {pngPos: "197px -3px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "wN2", view: {}, x: 6, y: 7},
  "wB1": {pngPos: "-136px -3px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "wB1", view: {}, x: 2, y: 7},
  "wB2": {pngPos: "-136px -3px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "wB2", view: {}, x: 5, y: 7},
  "wK": {checkView: {}, firstMove: true, pngPos: "-4px -3px", dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "wK", view: {}, x: 4, y: 7},
  "wQ": {pngPos: "-70px -3px", dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "wQ", view: {}, x: 3, y: 7},
  "wP1": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP1", view: {}, x: 0, y: 6},
  "wP2": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP2", view: {}, x: 1, y: 6},
  "wP3": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP3", view: {}, x: 2, y: 6},
  "wP4": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP4", view: {}, x: 3, y: 6},
  "wP5": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP5", view: {}, x: 4, y: 6},
  "wP6": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP6", view: {}, x: 5, y: 6},
  "wP7": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP7", view: {}, x: 6, y: 6},
  "wP8": {enPassant: false, firstMove: true, fifthRank: 3, pngPos: "65px -3px", dead: false, paths: [[0,-1],[0,-2],[-1,-1], [1,-1]], name: "wP8", view: {}, x: 7, y: 6},
  "bR1": {pngPos: "130px 63px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "bR1", view: {}, x: 0, y: 0},
  "bR2": {pngPos: "130px 63px", firstMove: true, dead: false, paths: [[0,-1],[1,0],[0,1],[-1,0]], name: "bR2", view: {}, x: 7, y: 0},
  "bN1": {pngPos: "197px 63px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "bN1", view: {}, x: 1, y: 0},
  "bN2": {pngPos: "197px 63px", dead: false, paths: [[1,-2], [2,-1], [2,1], [1,2], [-1,2], [-2,1], [-2,-1],[-1,-2]], name: "bN2", view: {}, x: 6, y: 0},
  "bB1": {pngPos: "-136px 63px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "bB1", view: {}, x: 2, y: 0},
  "bB2": {pngPos: "-136px 63px", dead: false, paths: [[1,-1],[1,1],[-1,1],[-1,-1]], name: "bB2", view: {}, x: 5, y: 0},
  "bK": {checkView: {}, pngPos: "-4px 63px", firstMove: true, dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "bK", view: {}, x: 4, y: 0},
  "bQ": {pngPos: "-70px 63px", dead: false, paths: [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]], name: "bQ", view: {}, x: 3, y: 0},
  "bP1": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP1", view: {}, x: 0, y: 1},
  "bP2": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP2", view: {}, x: 1, y: 1},
  "bP3": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP3", view: {}, x: 2, y: 1},
  "bP4": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP4", view: {}, x: 3, y: 1},
  "bP5": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP5", view: {}, x: 4, y: 1},
  "bP6": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP6", view: {}, x: 5, y: 1},
  "bP7": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP7", view: {}, x: 6, y: 1},
  "bP8": {enPassant: false, firstMove: true, fifthRank: 4, pngPos: "65px 63px", dead: false, paths: [[0,1],[0,2],[-1,1], [1,1]], name: "bP8", view: {}, x: 7, y: 1},
} */