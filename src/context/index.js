import React, { createContext, useMemo, useReducer } from 'react'
import { initialState } from './initialState'
import { actions } from './actions'
import chessReducer from './chessReducer'

export const ChessGameContext = createContext({})

// eslint-disable-next-line react/prop-types
export default function ChessGameProvider ({ children }) {

  const [ chessGameState, dispatch ] = useReducer(chessReducer, initialState)

  const value = useMemo(() => {
    return { ...actions(chessGameState, dispatch) }
  }, [chessGameState])

  return (
    <ChessGameContext.Provider value={value}>
      { children }
    </ChessGameContext.Provider>
  )
}
