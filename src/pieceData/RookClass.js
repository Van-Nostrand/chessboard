/*
Rooks
*/

export default class RookClass{

  static movelogic = (x,y) => x === 0 ^ y === 0

  static castlelogic = () => {
    return true
  }

  static getPaths = () => {
    return [[0,-1],[1,0],[0,1],[-1,0]]
  }

  static vision = (cellMap, piecesObject, name) => {
    const {x, y, paths} = piecesObject[name]

    const pathsObject = {}
    const BOARDSIZE = 8

    paths.forEach( path => {
      const startX = x + path[0]
      const startY = y + path[1]
      let blockedFlag = false

      for(let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]){
        const cellTest = `${i},${j}`

        // if cell in path contains piece
        if (cellMap[cellTest]){
          // if piece is enemy
          if(cellMap[cellTest].charAt(0) !== this.name.charAt(0)){
            // if enemy has not been found in this path yet then the path is clear and cell can be attacked
            if(!blockedFlag){
              pathsObject[cellTest] = 'a'
              blockedFlag = true
            }
            // else, enemy has been found in path and this tile is blocked
            else {
              pathsObject[cellTest] = 'b'
            }
          }
          // else piece must be ally and the cell is blocked
          else {
            pathsObject[cellTest] = 'b'
            blockedFlag = true
          }
        }
        // else cell is empty
        else {
          // if cell not blocked, can move to tile
          if(!blockedFlag){
            pathsObject[cellTest] = 'm'
          }
          // else cell is blocked by something prior
          else {
            pathsObject[cellTest] = 'b'
          }
        }
      }
    })
    return pathsObject
  }
}