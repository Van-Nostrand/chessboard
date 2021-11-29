import React from 'react'
import PropTypes from 'prop-types'

export default function ChessGraveyard ({ pieces, classString }) {

  let piecesToRender
  if (pieces && pieces.length > 0) {
    piecesToRender = pieces
  }

  const text = classString.charAt(0) === 'w' ? 'WHITE GRAVEYARD' : 'BLACK GRAVEYARD'

  return (
    <div className={`graveyard ${classString}`} >
      <h3>{text}</h3>
      {piecesToRender}
    </div>
  )
}

ChessGraveyard.propTypes = {
  pieces: PropTypes.array,
  classString: PropTypes.string
}
