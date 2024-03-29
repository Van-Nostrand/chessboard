import PieceClass from './PieceClass'
import { ICellMap, IPieceView, IPieceProps } from '@/types'

export default class RookClass extends PieceClass {
  constructor (props: IPieceProps) {
    super(props)
    this.imgSrc = props.name.charAt(0) + '-rook.svg'
    this.paths = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    this.firstMove = true
  }

  movelogic = (x: number, y: number) => ((x === 0) !== (y === 0)) && (x === 0 || y === 0)

  vision (cellMap: ICellMap) {

    const pathsObject: IPieceView = {}
    const BOARDSIZE = 8

    this.paths.forEach( path => {
      const startX = this.x + path[0]
      const startY = this.y + path[1]
      let blockedFlag = false

      for (let i = startX, j = startY; i < BOARDSIZE && i >= 0 && j >= 0 && j < BOARDSIZE; i += path[0], j += path[1]) {
        const cellTest = `${i},${j}`

        // if cell in path contains piece
        if (cellMap[cellTest]) {
          // if piece is enemy
          if (cellMap[cellTest].charAt(0) !== this.name.charAt(0)) {
            // if enemy has not been found in this path yet then the path is clear and cell can be attacked
            if (!blockedFlag) {
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
          if (!blockedFlag) {
            pathsObject[cellTest] = 'm'
          }
          // else cell is blocked by something prior
          else {
            pathsObject[cellTest] = 'b'
          }
        }
      }
    })
    // return pathsObject
    this.view = pathsObject
  }
}
