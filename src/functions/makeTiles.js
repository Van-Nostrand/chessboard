import React from 'react'
import { Tile } from '@/components'

export const makeTiles = (tileSize, dimensions, clickHandler) => {
  let tilebool = false
  let tileAtStartOfLastRow = false
  return new Array(dimensions[1]).fill().map((row, i) => {
    return new Array(dimensions[0]).fill().map((tile, j) => {
      // not sure about this logic... ?
      if (j === 0) {
        if (tilebool === tileAtStartOfLastRow) {
          tilebool = !tileAtStartOfLastRow
          tileAtStartOfLastRow = !tileAtStartOfLastRow
        } else {
          tileAtStartOfLastRow = tilebool
        }
      } else {
        tilebool = !tilebool
      }
      return (
        <Tile
          key={`t${j}-${i}`}
          size={tileSize}
          classString={ tilebool ? 'light-tile tile' : 'dark-tile tile' }
          coordinates={`${j},${i}`}
          onClick={clickHandler}
        />
      )
    })
  })
}
