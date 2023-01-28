import React from 'react'
import { IPiece } from '@/types'

interface IPieceProps {
  pieceData: IPiece
  border: boolean
  size: number
  onClick?: (e: any, name?: string) => void
}

export default function Piece ({ pieceData, border, size, onClick }: IPieceProps) {

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

  return (
    <div
      className={dead ? 'dead piece' : 'piece'}
      style={style}
      onClick={(e) => onClick(e, name)}
    >
      <img
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        src={svgSrc}
      />
    </div>
  )
}
