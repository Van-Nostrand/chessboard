import React, { createContext, useMemo, useReducer, ReactNode } from 'react'
import { initialState, IContext } from './initialState'
import { actions } from './actions'
import chessReducer from './chessReducer'
import { IPiecesObject, ICellMap } from '@/types'

interface IProvider {
  state: IContext
  dispatch: React.Dispatch<any>
  clearPieceSelection: () => void
  selectPiece: (name: string) => void
  promotePawn: (name: string) => void
  turnMaintenance: (args: any) => void,
  pawnBeingPromoted: (piecesObject: IPiecesObject, cellMap: ICellMap) => void,
  illegalMove: (message: string) => void
  illegalMoveButKeepSelection: (message: string) => void
  updateTilesize: (tileSize: number) => void
}

export const ChessGameContext = createContext<IProvider>(undefined)

export default function ChessGameProvider ({ children }: { children: ReactNode }) {

  const [ chessGameState, dispatch ] = useReducer(chessReducer, initialState)

  const value: IProvider = useMemo(() => {
    return { ...actions(chessGameState, dispatch) }
  }, [chessGameState])

  return (
    <ChessGameContext.Provider value={value}>
      { children }
    </ChessGameContext.Provider>
  )
}
