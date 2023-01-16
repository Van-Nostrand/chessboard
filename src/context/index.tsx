import React, { createContext, useMemo, useReducer, ReactNode } from 'react'
import { initialState } from './initialState'
import { actions } from './actions'
import chessReducer from './chessReducer'

export interface IDefaultContext {
  bGraveyard: any
  boardDimensions: number[]
  cellMap: any
  enPassantPiece: string
  graveyard: any
  messageBoard: string
  pawnPromotionFlag: boolean
  piecesObject: any
  pieceNumbering: any
  screenType: string
  selectedPiece: string
  testmode: boolean
  testboard: any
  tileArr: any
  tileSize: number
  turn: boolean
  windowSize: string
  wGraveyard: any
}

interface IProvider {
  state: IDefaultContext
  dispatch: React.Dispatch<any>
  clearPieceSelection: () => void
  selectPiece: (name: string) => void
  promotePawn: (name: string) => void
  turnMaintenance: (args: any) => void
}

export const ChessGameContext = createContext<IProvider>(undefined)

// eslint-disable-next-line react/prop-types
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
