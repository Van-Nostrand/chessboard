import React from 'react'
import PropTypes from 'prop-types'

export default function Piece ({ pieceData, border, size, onClick }) {

  const { x, y, name, dead, imgSrc } = pieceData
  let style = {}
  const svgSrc = require(`../assets/${imgSrc}`)

  if (dead) {
    style = {
      width: `${size}px`,
      height: `${size}px`,
      transform: '',
      position: 'relative',
    }
  }
  else {
    style = {
      width: `${size}px`,
      height: `${size}px`,
      transform: `translate(${size * x}px,${size * y}px)`,
      position: 'absolute',
      border: border ? '0.1rem solid yellow' : ''
    }
  }

  const svgStyle = {
    maxWidth: '100%',
    maxHeight: '100%'
  }

  return (
    <div
      className={dead ? 'dead piece' : 'piece'}
      style={style}
      name={name}
      onClick={(e) => onClick(e, name)}
    >
      <img
        style={svgStyle}
        src={svgSrc}
      />
    </div>
  )
}

Piece.propTypes = {
  pieceData: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    name: PropTypes.string,
    dead: PropTypes.bool,
    imgSrc: PropTypes.string
  }),
  border: PropTypes.bool,
  size: PropTypes.number,
  onClick: PropTypes.func
}
