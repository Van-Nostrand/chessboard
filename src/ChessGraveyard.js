import React from 'react'
import PropTypes from 'prop-types'

export default function ChessGraveyard ({ pieces, classString }) {

  let piecesToRender
  if (pieces && pieces.length > 0) {
    piecesToRender = pieces
  }

  const text = classString.charAt(0) === 'w' ? 'WHITE GRAVEYARD' : 'BLACK GRAVEYARD'
  const transformString = `rotate(${classString.charAt(0) === 'w' ? '-90deg' : '90deg'})`
  const style = { transform: transformString }

  return (
    <div className={`graveyard ${classString}`} >
      <h3 style={style}>{text}</h3>
      {piecesToRender}
    </div>
  )
}

ChessGraveyard.PropTypes = {
  pieces: PropTypes.array,
  classString: PropTypes.string
}
