/*
This class defines all the basics of a chesspiece 
x and y are cell coordinates, domain of [0-7]
name is of this form: "cT#""
  where c = w or b, to reference black and white
  where T = type of piece (K is King, N is Knight)
  where # = is an integer to differentiate between pieces of same type
*/
export default class PieceClass{
  constructor(name, x, y, pngPos){
    this.name = name;
    this.x = x;
    this.y = y;
    this.pngPos = pngPos;

    this.dead = false;
    this.clicked = false;
    this.dragging = false;
  }

  getCoordinates = () => {
    return [this.x,this.y];
  }

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  //Currently I've only tested this on rooks
  //It should work for bishops and queens as well
  //it will not work for knights, pawns, or kings
  //TODO - Decide if BOARDSIZE should be the highest number of cells a piece can move across rather than a hard-coded reference to the boards size
  newVision = (occupiedObject) => {
    let pathsObject = {};
    const BOARDSIZE = 8;

    this.paths.forEach(path => {
      let pathArr = [];

      //currently, this checks the pieces own tile. needs refactoring
      for(let i = this.x, j = this.y ; i < BOARDSIZE && i > -1 && j < BOARDSIZE && j > -1; i = i + path[0], j = j + path[1]){
        let cellCheck = `${i},${j}`;
        
        //if this is an empty cell
        if(!occupiedObject[cellCheck]){
          pathArr.push([cellCheck, "move"]);
        } else if (occupiedObject[cellCheck] && occupiedObject[cellCheck][0].charAt(0) !== this.name.charAt(0)){
          pathArr.push([cellCheck, "attack"]);
        }
        // console.log(`here's occupied object inside RookClass`);
        // console.log(occupiedObject[cellCheck]);
      }
      pathsObject[path] = pathArr;
    });
    return pathsObject;
  }

}