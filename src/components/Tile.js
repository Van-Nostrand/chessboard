import React from 'react'
import PropTypes from 'prop-types'

export default function Tile ({ size, onClick, classString, coordinates }) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    // border: `${props.borderSize}px solid ${props.borderColour}`,
  }

  return (
    <div
      className={classString}
      onClick={(e) => onClick(e, coordinates)}
      style={style}
    />
  )
}

Tile.propTypes = {
  size: PropTypes.number,
  onClick: PropTypes.func,
  classString: PropTypes.string,
  coordinates: PropTypes.string
}
