import PieceClass from './PieceClass'

export default class BishopClass extends PieceClass {
  constructor (props) {
    super (props)
    this.paths = [[1, -1], [1, 1], [-1, 1], [-1, -1]]
    this.imgSrc = props.name.charAt(0) + '-bishop.svg'
  }

  movelogic = (x, y) => x !== 0 && y !== 0 && (x/y === 1 || x/y === -1)

  vision (cellMap) {
    const pathsObject = {}
    const BOARDSIZE = 8

    this.paths.forEach( path => {

      //set boundaries for this path
      const startX = this.x + path[0]
      const startY = this.y + path[1]
      let blockedFlag = false

      for (let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]) {
        const cellTest = `${i},${j}`

        if (cellMap[cellTest]) {
          if (cellMap[cellTest].charAt(0) !== this.name.charAt(0)) {
            if (!blockedFlag) {
              pathsObject[cellTest] = 'a'
              blockedFlag = true
            }
            else {
              pathsObject[cellTest] = 'b'
            }
          }
          else {
            pathsObject[cellTest] = 'b'
            blockedFlag = true
          }
        }
        else if (!blockedFlag) {
          pathsObject[cellTest] = 'm'
        }
        else {
          pathsObject[cellTest] = 'b'
        }
      }
    })
    // return pathsObject
    this.view = pathsObject
  }
}
