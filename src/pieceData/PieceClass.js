export default class PieceClass {
  constructor (props) {
    this.x = props.x
    this.y = props.y
    this.imgSrc = null
    this.paths = []
    this.name = props.name
    this.view = {}
    this.attackView = {}
  }

  static moveLogic () {
    return null
  }

  // get imgSrc () {
  //   return this.imgSrc
  // }

  // set imgSrc (s) {
  //   this.imgSrc = s
  // }

  // get paths () {
  //   return this.paths
  // }

  // get coordinates () {
  //   return [this.x, this.y]
  // }

  // set coordinates (value) {
  //   this.x = value.x
  //   this.y = value.y
  // }

  // set view (value) {
  //   this.view = value
  // }

  // get view () {
  //   return this.view
  // }
}
