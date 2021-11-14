import React from 'react'
import pieceImg from '../assets/pieces.png'

// const BACKGROUNDSIZE = 400

//TODO - remove need for hard-coded BACKGROUNDSIZE property
export default function Piece ({ border = '', name, dead, x, y, size, onClick, backgroundSize }) {

  const borderLogic = border === name ? '0.1rem solid yellow' : ''
  let style, divElement, pngPos
  switch (true) {
  case /^wQ/.test(name): pngPos = '-7rem -0.3rem'
    break
  case /^bQ/.test(name): pngPos = '-7rem 6.3rem'
    break
  case /^wK/.test(name): pngPos = '-0.4rem -0.3rem'
    break
  case /^bK/.test(name): pngPos = '-0.4rem 6.3rem'
    break
  case /^wB/.test(name): pngPos = '-13.6rem -0.3rem'
    break
  case /^bB/.test(name): pngPos = '-13.6rem 6.3rem'
    break
  case /^wN/.test(name): pngPos = '19.7rem -0.3rem'
    break
  case /^bN/.test(name): pngPos = '19.7rem 6.3rem'
    break
  case /^wR/.test(name): pngPos = '13rem -0.3rem'
    break
  case /^bR/.test(name): pngPos = '13rem 6.3rem'
    break
  case /^wP/.test(name): pngPos = '6.5rem -0.3rem'
    break
  case /^bP/.test(name): pngPos = '6.5rem 6.3rem'
    break
  default: console.log('error in Piece.js switch')
  }


  if (dead) {
    style = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundImage: `url(${pieceImg})`,
      backgroundSize: `${backgroundSize}px`,
      backgroundPosition: pngPos,
      transform: '',
      position: 'relative',
    }
    divElement = <div
      className="dead piece"
      style={style}
      name={name}></div>
  }
  else {
    style = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundImage: `url(${pieceImg})`,
      backgroundSize: `${backgroundSize}px`,
      backgroundPosition: pngPos,
      transform: `translate(${size * x}px,${size * y}px)`,
      position: 'absolute',
      border: borderLogic
    }

    divElement = <div
      className="piece"
      style={style}
      name={name}
      onClick={(e) => onClick(e, name)}></div>
  }


  return divElement
}

