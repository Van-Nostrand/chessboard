/*
This class defines all the basic properties of a chesspiece 

pngPos - an array that describes where on the source png file their image is
x and y - cell coordinates of the piece
paths - this will be an array of arrays; each sub-array describes a direction that piece can move in
pathsRepeat - if true, signals that pieces paths are applied repeatedly, relative to current position (rooks, bishops, queens). if false, signals that pieces paths are signular and absolute (knights, kings, pawns)

name is of this form: "cT#""
  where c = w or b, to reference black and white
  where T = type of piece (K is King, N is Knight)
  where # = is an integer to differentiate between pieces of same type (except king and queen don't have a number)
  
vision() - pieces are in charge of tracking their possible moves. They do this with their vision() method and view property
  currently this is implemented individually in each pieces subclass
  newVision(), below, will be edited to work on all pieces
  view is an object that contains a series of arrays
  Each array is named after each path array they have 
  vision() checks all possible moves and attacks on the board and returns a new view
  
movelogic() - used to determine if moves are legal. x and y delta values are given as arguments, and a boolean is returned indicating whether those values describe a legal move for the current piece
    
*/
export default class PieceClass{
  constructor(name, x, y, pngPos, paths, pathsRepeat){
    this.name = name;
    this.x = x;
    this.y = y;
    this.pngPos = pngPos;

    this.dead = false;
    this.clicked = false;
    this.dragging = false;
    this.paths = paths;
    this.pathsRepeat = pathsRepeat;
  }

  movelogic = (x,y) => {};

  getCoordinates = () => {
    return [this.x,this.y];
  }

  setCoordinates = (x,y) => {
    this.x = x;
    this.y = y;
  }

  handleMove = (cell) => {
    this.setCoordinates(cell[0], cell[1]);
    return this;
  }

  //unnecessary?
  handleAttack = (cell, target) => {

  }

  killEm(){
    this.dead = true;
  }

  //Currently I've only tested this on rooks
  //It should work for bishops and queens as well
  //it will not work for knights, pawns, or kings, but maybe I can make it happen
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
      }
      pathsObject[path] = pathArr;
    });
    return pathsObject;
  }

}