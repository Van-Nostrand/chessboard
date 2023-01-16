import PieceClass from './PieceClass'
import { ICellMap, IPieceView, IPiecesObject, IPieceProps } from '@/types'

/**==== PAWNS ====
* attacklogic() - similar to movelogic(), this pawn-exclusive function determines if a pawn can attack
* direction - a property set by props.name.charAt(0) which determines the direction this pawn may move in
* fifthRank - Used to track en passant
*/
export default class PawnClass extends PieceClass {
  // firstMove: boolean
  canBeCapturedInPassing: boolean
  direction: number
  fifthRank: number

  constructor (props: IPieceProps) {
    super(props)
    this.firstMove = true
    this.canBeCapturedInPassing = false
    this.imgSrc = props.name.charAt(0) + '-pawn.svg'
    this.paths = props.name.charAt(0) === 'w'
      ? [[0, -1], [0, -2], [-1, -1], [1, -1]]
      : [[0, 1], [0, 2], [-1, 1], [1, 1]]
    this.direction = props.name.charAt(0) === 'w' ? -1 : 1
    // fifthRank is a y index starting from the top
    this.fifthRank = props.name.charAt(0) === 'w' ? 3 : 4
  }

  attacklogic (x: number, y: number) {
    return (x === 1 || x === -1) && (1 * this.direction === y)
  }

  // unused
  // movelogic = (x: number, y: number) => {
  //   // if x is not zero, or the pawn is moving in the wrong direction, return false
  //   if (x !== 0 || !((y > 0 && this.direction > 0) || (y < 0 && this.direction < 0))) return false
  //   // otherwise test to make sure it's moving 1 or 2 spaces based on first move
  //   return (this.firstMove && 0 < Math.abs(y) && Math.abs(y) < 3 ) || (!this.firstMove && Math.abs(y) === 1)
  // }

  // unused and wrong
  // enpassantlogic = (targetcell, victim) => {
  //   return (
  //     targetcell[0] === victim[0] &&
  //     (targetcell[1] === victim[1] + 1 ||
  //       targetcell[1] === victim[1] - 1))
  // }

  // returns an object that describes all cells within a pieces view, and whether or not that piece can act upon that cell
  vision (cellMap: ICellMap, enPassantPiece: any, piecesObject: IPiecesObject) {
    const BOARDSIZE = 8

    // create an empty object that will store potential moves
    const pathsObject: IPieceView = {}

    // for each path
    for (const path of this.paths) {
    // this.paths.forEach( path => {
      if (!this.firstMove && Math.abs(path[1]) === 2) continue
      // console.log('checking pawn', this.name, ' and path is', path)

      const checkX = path[0] + this.x
      const checkY = path[1] + this.y

      // if the cell is within the board
      if (0 <= checkX && checkX < BOARDSIZE && 0 <= checkY && checkY < BOARDSIZE) {

        const cellString = `${path[0] + this.x},${path[1] + this.y}`

        //cell contains a piece
        if (cellMap[cellString]) {
          const testedCell = cellMap[cellString]

          // piece is an enemy
          if (testedCell.charAt(0) !== this.name.charAt(0)) {
            // if residing in attack path, create key/value "cell,coordinates": [x,y,"a"]
            if (this.attacklogic(path[0], path[1])) {
              pathsObject[cellString] = 'a'

            }
          }
        }
        // cell is empty
        else {
          //cell in move path
          if (checkX === this.x) {
            if (this.firstMove) {
              pathsObject[cellString] = 'm'
            }
            else if (!this.firstMove && Math.abs(path[1]) === 1) {
              pathsObject[cellString] = 'm'
            }
          }
          else if (this.fifthRank === this.y) {
            console.log('doing an enpassant check in vision for ', this, 'following path', path)
            // if enemy pawn in cell "behind" empty cell
            const splitCellString = cellString.split(',')// cell diagonal to pawn
            const EPTest = `${splitCellString[0]},${parseInt(splitCellString[1]) - this.direction}` // cell to the side of pawn
            // if EPTest is the coordinates of an enemy pawn that JUST PRIOR moved two tiles on their first turn...
            // console.log('splitcellstring is', splitCellString, 'and eptest is ', EPTest)
            // console.log('cellMap[EPTest] is ', cellMap[EPTest])
            if (cellMap[EPTest] && cellMap[EPTest].charAt(0) !== this.name.charAt(0) && cellMap[EPTest].charAt(1) === 'P') {
              // if piece just moved two spaces
              const EPEnemy = piecesObject[cellMap[EPTest]]
              if (EPEnemy.name === enPassantPiece) {
                // console.log('PASSED NEXT TEST')

                // create key/value "cell,coordinates": [x,y,"e"] to denote empty attack cell
                pathsObject[cellString] = 'e'
                // return
              }
            }
          }
        }
      }
    }
    this.view = pathsObject
    return pathsObject
  }
}
