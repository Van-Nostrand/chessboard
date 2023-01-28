import React from 'react'
import { Tile } from '@/components'

/**
 * makes the gameboard
 * @param {number} tileSize size of tile in pixels
 * @param {Array} dimensions array representing width and height of board. integers above 0 only.
 * @param {function} clickHandler the function that gets called when this tile is clicked
 * @returns an array of arrays of Tile components
 */
export const makeTiles = (
  tileSize: number,
  dimensions: number[],
  clickHandler: (e?: any, coordinates?: string) => void
) => {
  let tilebool = false
  let tileAtStartOfLastRow = false
  return new Array(dimensions[0]).fill(undefined).map((row, i) => {
    return new Array(dimensions[1]).fill(undefined).map((tile, j) => {
      // double check this sometime, I flipped i and j for some reason
      // I just need to check if the length is odd or even... this is silly
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
