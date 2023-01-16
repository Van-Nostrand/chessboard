import { IPieceProps, ICellMap } from '@/types'

export default class PieceClass {
  x: number
  y: number
  imgSrc: string
  paths: any[]
  name: string
  view: ICellMap
  attackView: any
  dead: boolean
  firstMove?: boolean
  attackLogic?: (x: number, y: number) => boolean
  moveLogic?: (x: number, y: number) => boolean

  constructor (props: IPieceProps) {
    this.x = props.x
    this.y = props.y
    this.imgSrc = null
    this.paths = []
    this.name = props.name
    this.view = {}
    this.attackView = {}
    this.dead = false
  }
}
