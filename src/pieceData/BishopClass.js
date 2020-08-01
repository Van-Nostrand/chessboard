export default class BishopClass{

  static movelogic = (x,y) => x !== 0 && y !== 0 && (x/y === 1 || x/y === -1);

  static getPaths = () => {
    return [[1,-1],[1,1],[-1,1],[-1,-1]];
  }

  static vision = (cellMap, piecesObject, name) => {
    let {x, y, paths} = piecesObject[name];
    
    let pathsObject = {};
    const BOARDSIZE = 8;

    paths.forEach((path, i) => {

      //set boundaries for this path
      let startX = x + path[0];
      let startY = y + path[1];
      let blockedFlag = false;

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        let cellTest = `${i},${j}`;

        if (cellMap[cellTest]){

          if(cellMap[cellTest].charAt(0) !== name.charAt(0)){

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
    return pathsObject;
  }

}