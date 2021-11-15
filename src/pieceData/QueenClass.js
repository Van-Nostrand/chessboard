import PieceClass from './PieceClass'

export default class QueenClass extends PieceClass {
  constructor (props) {
    super(props)
    this.imgSrc = props.name.charAt(0) + '-queen.svg'
    this.paths = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]]
  }

  movelogic = (x, y) => {
    const result = (x === 0 ^ y === 0) ^ x/y === 1 || x/y === -1
    if (result === 1) return true
    else if (result === 0) return false
    else return result
  }

  vision (cellMap) {
    const pathsObject = {}
    const BOARDSIZE = 8
    // for each path: iterate over all cells
    this.paths.forEach( path => {

      //set boundaries for this path
      const startX = this.x + path[0]
      const startY = this.y + path[1]
      let blockedFlag = false
      for (let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]) {
        // debugger;
        const cellTest = `${i},${j}`
        // if cell in path contains piece
        if (cellMap[cellTest]) {
          // if piece is enemy
          if (cellMap[cellTest].charAt(0) !== this.name.charAt(0)) {
            // if enemy has not been found in this path yet
            if (!blockedFlag) {
              // create key/value "coordinates": "a"
              // set blockedFlag to true
              pathsObject[cellTest] = 'a'
              blockedFlag = true
            }
            // else, enemy has been found in path
            else {
              // create key/value "coordinates": "b" (for blocked)
              pathsObject[cellTest] = 'b'
            }
          }
          // else piece must be ally
          else {
            // create key/value "coordinates": "b"
            // set blockedFlag to true
            pathsObject[cellTest] = 'b'
            blockedFlag = true
          }
        }
        // else cell is empty
        else {
          // if blockedFlag is false
          if (!blockedFlag) {
            // create key/value "coordinates": "m"
            pathsObject[cellTest] = 'm'
          }
          // else this cell must be blocked by something
          else {
            // create key/value "coordinates": "b"
            pathsObject[cellTest] = 'b'
          }
        }
      }
    })
    console.log('called vision on queen. this is', this, 'paths object is', pathsObject)
    this.view = pathsObject
  }
}
