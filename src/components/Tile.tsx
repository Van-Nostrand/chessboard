import React from 'react'
// import PropTypes from 'prop-types'

interface ITileProps {
  size: number
  onClick: (e: any, coordinates: string) => void
  classString: string
  coordinates: string
}

export default function Tile ({ size, onClick, classString, coordinates }: ITileProps) {
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

// Tile.propTypes = {
//   size: PropTypes.number,
//   onClick: PropTypes.func,
//   classString: PropTypes.string,
//   coordinates: PropTypes.string
// }
