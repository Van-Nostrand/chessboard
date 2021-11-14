import PieceClass from './PieceClass'
/*
==== KNIGHTS ====
*/
export default class KnightClass extends PieceClass {

  constructor (props) {
    super(props)
    this.imgSrc = props.name.charAt(0) + '-knight.svg'
    this.paths = [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]]
  }

  static movelogic = (x, y) =>
    x !== 0 !== y &&
    3 > Math.abs(x) &&
    3 > Math.abs(y) &&
    ((Math.abs(x) === 2 ^ Math.abs(y) === 2) === 1)


  static getPaths = () => {
    return [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]]
  }


  static vision = (cellMap, piecesObject, name) => {
    const { x, y, paths } = piecesObject[name]

    const pathsObject = {}
    const BOARDSIZE = 8

    paths.forEach(path => {
      const testX = x + path[0]
      const testY = y + path[1]
      const cellCheck = `${testX},${testY}`

      if (
        !cellMap[cellCheck] &&
        testX >= 0 && testX < BOARDSIZE &&
        testY >= 0 && testY < BOARDSIZE
      ) {
        pathsObject[cellCheck] = 'm'
      }
      else if (cellMap[cellCheck] && cellMap[cellCheck].charAt(0) !== name.charAt(0)) {
        pathsObject[cellCheck] = 'a'
      }
      else if (cellMap[cellCheck] && cellMap[cellCheck].charAt(0) === name.charAt(0)) {
        pathsObject[cellCheck] = 'b'
      }
    })
    return pathsObject
  }

}
