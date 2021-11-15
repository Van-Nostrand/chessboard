import {
  BOARDDIMENSIONS,
  PIECE_OBJECTS,
  EN_PASSANT_TEST
  // PIECEPATHS
} from '@/constants'
import { updatePieceVision } from './updatePieceVision'
import { buildNewCellMap } from './buildNewCellMap'
import { createPiece } from './createPiece'

/**
 * This sets up the chess game and initializes all data
 * @returns initial game data
 */
export const gameSetup = () => {

  // create checkerboard
  // might not be necessary anymore... 
  let tileBool = true
  const initTileArr = new Array(BOARDDIMENSIONS[0]).fill().map(() => {
    return new Array(BOARDDIMENSIONS[1]).fill().map((tile, j) => {
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

  //declare pieces according to one of the game piece constants
  const initialPiecesObject = {}
  PIECE_OBJECTS.forEach( piece => {
    initialPiecesObject[piece.name] = createPiece(piece)
  })

  //cellMap is used for piece name lookup by cell
  const initialCellMap = buildNewCellMap(initialPiecesObject)

  //build the view properties for each piece
  updatePieceVision(initialPiecesObject, initialCellMap)

  return [ initialPiecesObject, initialCellMap, initTileArr, initialPieceNumbers ]
}
