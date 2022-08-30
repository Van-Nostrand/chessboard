import * as React from 'react'
import { createRoot } from 'react-dom/client'
import ChessGame from '@/ChessGame'
import ChessGameProvider from '@/context'
import '@/scss/main.scss'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ChessGameProvider>
      <ChessGame />
    </ChessGameProvider>
  </React.StrictMode>
)
