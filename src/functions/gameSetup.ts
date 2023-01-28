import {
  BOARDDIMENSIONS,
  PIECE_OBJECTS,
  // PROMOTION_TEST
} from '@/constants'
import { updatePieceVision } from './updatePieceVision'
import { buildNewCellMap } from './buildNewCellMap'
import { getNewPiece } from './getNewPiece'
// import PieceClass from '@/pieceData/PieceClass'
import { IPiecesObject, ICellMap } from '@/types'

/**
 * This sets up the chess game and initializes all data
 * @returns initial game data
 */
export function gameSetup (): [IPiecesObject, ICellMap, string[][], { [k: string]: number }] {
  // create checkerboard
  // might not be necessary anymore...
  let tileBool = true
  const initTileArr = new Array(BOARDDIMENSIONS[0]).fill(null).map(() => {
    return new Array(BOARDDIMENSIONS[1]).fill(null).map((tile, j) => {
      tileBool = j % BOARDDIMENSIONS[0] === 0 ? tileBool : !tileBool
      // return tileBool? LIGHT_TILE : DARK_TILE;
      return tileBool? 'light-tile tile' : 'dark-tile tile'
    })
  })

  // used for dynamic piece numbering
  const initialPieceNumbers = {
    'wP': 0,
    'wR': 0,
    'wN': 0,
    'wB': 0,
    'wQ': 0,
    'bP': 0,
    'bR': 0,
    'bN': 0,
    'bB': 0,
    'bQ': 0
  }

  const initialPiecesObject: IPiecesObject = PIECE_OBJECTS.reduce((acc: IPiecesObject, cur) => {
    acc[cur.name] = getNewPiece(cur)
    return acc
  }, {})

  // cellMap is used for piece name lookup by cell
  const initialCellMap = buildNewCellMap(initialPiecesObject)

  // build the view properties for each piece
  updatePieceVision(initialPiecesObject, initialCellMap)

  return [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ]
}
