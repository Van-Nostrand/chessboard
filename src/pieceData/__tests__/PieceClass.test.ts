// import PieceClass from '../PieceClass'
import { IPiece } from '@/types'

describe('PieceClass', () => {
  test('basic', () => {
    function PieceFunc (this: IPiece, props: any) {
      this.x = props.x
      this.y = props.y
      this.imgSrc = undefined
      this.paths = []
      this.name = props.name
      this.view = {}
      this.attackView = {}

      function moveLogic () {
        console.log('DOES MOVELOGIC WORK?', this)
      }

      this.moveLogic = moveLogic.bind(this)
    }

    const test: IPiece = new (PieceFunc as any)({ x: 2, y: 3, name: 'a name' })

    console.log('TEST??', test)

    expect(test).toBeTruthy()
  })
})
