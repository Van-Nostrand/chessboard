import { createContext } from 'react'

export const ChessGameContext = createContext({})
export default function ChessGameProvider () {
  return (
    <ChessGameContext.Provider value={}>

    </ChessGameContext.Provider>
  )
}
