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

  moveLogic () {
    return null
  }
}
