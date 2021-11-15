import PieceClass from './PieceClass'
/**==== PAWNS ====
* attacklogic() - similar to movelogic(), this pawn-exclusive function determines if a pawn can attack
* direction - a property set by props.name.charAt(0) which determines the direction this pawn may move in
* fifthRank - Used to track en passant
*/
export default class PawnClass extends PieceClass {
  constructor (props) {
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

  // unused
  attacklogic (x, y) {
    return (x === 1 || x === -1) && (1 * this.direction === y)
  }

  // unused
  movelogic = (x, y) => {
    // if x is not zero, or the pawn is moving in the wrong direction, return false
    if (x !== 0 || !((y > 0 && this.direction > 0) || (y < 0 && this.direction < 0))) return false
    // otherwise test to make sure it's moving 1 or 2 spaces based on first move
    return (this.firstMove && 0 < Math.abs(y) < 3 ) || (!this.firstMove && Math.abs(y) === 1)
  }

  // unused and wrong
  enpassantlogic = (targetcell, victim) => {
    return (
      targetcell[0] === victim[0] &&
      (targetcell[1] === victim[1] + 1 ||
        targetcell[1] === victim[1] - 1))
  }

  // returns an object that describes all cells within a pieces view, and whether or not that piece can act upon that cell
  vision = (cellMap, enPassantPiece, piecesObject) => {
    const BOARDSIZE = 8

    // create an empty object that will store potential moves
    const pathsObject = {}

    // for each path
    for (const path of this.paths) {
    // this.paths.forEach( path => {
      if (!this.firstMove && Math.abs(path[1]) === 2) continue
      // console.log('checking pawn', this.name, ' and path is', path)

      const checkX = path[0] + this.x
      const checkY = path[1] + this.y

      // if the cell is within the board
      if (0 <= checkX < BOARDSIZE && 0 <= checkY < BOARDSIZE) {

        const cellString = `${path[0] + this.x},${path[1] + this.y}`

        //cell contains a piece
        if (cellMap[cellString]) {
          const testedCell = cellMap[cellString]

          // piece is an enemy
          if (testedCell.charAt(0) !== this.name.charAt(0)) {
            // if residing in attack path, create key/value "cell,coordinates": [x,y,"a"]
            if (this.attacklogic(path[0], path[1], this.direction)) {
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
            // if enemy pawn in cell "behind" empty cell
            const EPTest = `${cellString.charAt(0)},${parseInt(cellString.charAt(2)) - this.direction}`
            if (cellMap[EPTest] && cellMap[EPTest].charAt(0) !== this.name.charAt(0) && cellMap[EPTest].charAt(1) === 'P') {

              // if piece just moved two spaces
              const EPEnemy = piecesObject[cellMap[EPTest]]
              if (EPEnemy.name === enPassantPiece) {

                // create key/value "cell,coordinates": [x,y,"e"] to denote empty attack cell
                pathsObject[cellString] = 'e'
                return
              }
            }
          }
        }
      }
    }
    this.view(pathsObject)
    // return pathsObject
  }

  set view (value) {
    this.view = value
  }
}
