import React from 'react'

const Tile = ({ size, onClick, classString }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    // border: `${props.borderSize}px solid ${props.borderColour}`,
  }

  return (
    <div className={classString} onClick={onClick} style={style}>
    </div>)
}

export default Tile
