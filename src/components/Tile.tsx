import React from 'react'

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
  }

  return (
    <div
      className={classString}
      onClick={(e) => onClick(e, coordinates)}
      style={style}
    />
  )
}
