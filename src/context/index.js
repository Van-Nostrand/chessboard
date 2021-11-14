import React, { createContext, useMemo, useReducer } from 'react'
import { initialState } from './initialState'
import chessReducer from './reducer'

export const ChessGameContext = createContext({})

// eslint-disable-next-line react/prop-types
export default function ChessGameProvider ({ children }) {

  const [ chessGameState, dispatch ] = useReducer(chessReducer, initialState)

  const value = useMemo(() => ({
    chessGameState, dispatch
  }), [chessGameState])

  return (
    <ChessGameContext.Provider value={value}>
      { children }
    </ChessGameContext.Provider>
  )
}
