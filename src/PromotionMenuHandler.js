import React, { Component } from 'react'
import { PromotionMenu } from './PromotionMenu'

export default class PromotionMenuHandler extends Component {

  selectPiece = (e) => {
    console.log(e)
  }

  render () {
    return (
      <PromotionMenu selectPiece={this.selectPiece} team={'w'} />

    )
  }
}
