/*
This class defines all the basic properties of a chesspiece 

pngPos - an array that describes where on the source png file their image is
x and y - cell coordinates of the piece
paths - this will be an array of arrays; each sub-array describes a direction that piece can move in
pathsIterate - if true, signals that pieces paths are applied repeatedly, relative to current position (rooks, bishops, queens). if false, signals that pieces paths are signular and absolute (knights, kings, pawns)

name is of this form: "cT#""
  where c = w or b, to reference black and white
  where T = type of piece (K is King, N is Knight)
  where # = is an integer to differentiate between pieces of same type (except king and queen don't have a number)
  
vision() - pieces are in charge of tracking their possible moves. They do this with their vision() method and view property
  this is implemented individually in each pieces subclass
  view is an object that contains information about where the piece can move
  the format is: {"CELL-COORDINATES": "ACTION"}
    where CELL-COORDINATES is an array describing x,y coordinates
    where ACTION is either:
      "a" for attack
      "m" for move
      "b" for blocked (either a teammate or a piece beyond another piece)
      and in the case of pawns, "e" for the ever-elusive en passant
  vision() checks all possible moves and attacks for the piece and returns a new view
  
movelogic() - used to determine if moves are legal. x and y delta values are given as arguments, and a boolean is returned indicating whether those values describe a legal move for the current piece
    
*/
export default class PieceClass{
  constructor(name, x, y, pngPos, paths, pathsIterate){
    this.name = name;
    this.x = x;
    this.y = y;
    this.pngPos = pngPos;

    this.dead = false;
    this.clicked = false;
    this.dragging = false;
    this.paths = paths;
    this.pathsIterate = pathsIterate;
  }

  movelogic = (x,y) => {};  

  vision = () => {
    let pathsObject = {};
    return pathsObject;
  }
}