import React from 'react'

export default function Piece ({ pieceData, border = '', size, onClick }) {
  const { x, y, name, dead, imgSrc } = pieceData
  const borderLogic = border === name ? '0.1rem solid yellow' : ''
  let style = {}

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
      border: borderLogic
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
        src={require(`../assets/${imgSrc}`)}
      />
    </div>
  )
}

