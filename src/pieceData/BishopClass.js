import PieceClass from "./PieceClass";

export default class BishopClass extends PieceClass{
  constructor(name, x, y, pngPos){
    super(name, x, y, pngPos, [[1,-1],[1,1],[-1,1],[-1,-1]], true);
    
  }

  movelogic = (x,y) => x !== 0 && y !== 0 && (x/y === 1 || x/y === -1);

  vision = (cellMap) => {
   
    let pathsObject = {};
    const BOARDSIZE = 8;

    this.paths.forEach((path, i) => {

      //set boundaries for this path
      let startX = this.x + path[0];
      let startY = this.y + path[1];
      let blockedFlag = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        let cellTest = `${i},${j}`;

        if (cellMap[cellTest]){

          if(cellMap[cellTest].charAt(0) !== this.name.charAt(0)){

            if(!blockedFlag){

              pathsObject[cellTest] = "a";
              blockedFlag = true;
            }
            else {
              pathsObject[cellTest] = "b";
            }
          }
          else {
            pathsObject[cellTest] = "b";
            blockedFlag = true;
          }
        }
        else {
          if(!blockedFlag){
            pathsObject[cellTest] = "m";
          }
          else {
            pathsObject[cellTest] = "b";
          }
  
        }
        
      }

    })
    // return object
    this.newview = pathsObject;
    return pathsObject;
  }

}