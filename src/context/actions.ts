import React from 'react'
import {
  buildNewCellMap,
  recursiveStateCopy,
  getNewPiece,
  updatePieceVision
} from '@/functions'
import { IDefaultContext } from './initialState'

export const actions = (state: IDefaultContext, dispatch: React.Dispatch<any>) => {
  return ({
    state,
    dispatch,
    clearPieceSelection: () => {
      dispatch({ type: 'clear-piece-selection' })
    },
    selectPiece: (name: string) => {
      dispatch({ type: 'select-piece', name })
    },
    // similar to turnMaintenance but different enough to get it's own function
    promotePawn: (newPieceType: string) => {
      const newPieceNumbering = recursiveStateCopy(state.pieceNumbering)
      const newPiecesObject = recursiveStateCopy(state.piecesObject)
      const newPieceName = `${state.selectedPiece.charAt(0)}${newPieceType}${++newPieceNumbering[`${state.selectedPiece.charAt(0)}${newPieceType}`]}`

      const newPiece = getNewPiece({
        name: newPieceName,
        x: newPiecesObject[state.selectedPiece].x,
        y: newPiecesObject[state.selectedPiece].y
      })
      // remove old pawn, add new piece to object
      delete newPiecesObject[state.selectedPiece]
      newPiecesObject[newPiece.name] = newPiece
      const newCellMap = buildNewCellMap(newPiecesObject)
      const newMessageBoard = `${state.selectedPiece} has been promoted to ${newPiece.name}`
      updatePieceVision(newPiecesObject, newCellMap)

      dispatch({
        type: 'promoted',
        piecesObject: newPiecesObject,
        cellMap: newCellMap,
        messageBoard: newMessageBoard,
        pieceNumbering: newPieceNumbering
      })
    },
    // called at the end of most turns
    turnMaintenance: (args: {
      newPiecesObject: any
      newCellMap: any
      newMessageBoard: any
      newGraveyard: any
    }) => {
      const {
        newPiecesObject,
        newCellMap,
        newMessageBoard,
        newGraveyard = args.newGraveyard || state.graveyard
      } = args
      let newEnPassantPiece = ''
      //if the piece has a firstMove prop, flip it
      if (newPiecesObject[state.selectedPiece].firstMove) {
        newPiecesObject[state.selectedPiece].firstMove = false

        //if it's a pawn and it just had a double move, flag for enpassant attacks
        if ( /^\wP/.test(state.selectedPiece) && (
          newPiecesObject[state.selectedPiece].y === 4 ||
          newPiecesObject[state.selectedPiece].y === 3)
        ) {
          newEnPassantPiece = state.selectedPiece
        }
      }
      updatePieceVision(newPiecesObject, newCellMap, newEnPassantPiece)
      dispatch({
        type: 'maintenance',
        piecesObject: newPiecesObject,
        cellMap: newCellMap,
        messageBoard: newMessageBoard,
        enPassantPiece: newEnPassantPiece,
        graveyard: newGraveyard
      })
    }

  })
}
