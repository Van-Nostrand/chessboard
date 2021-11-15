import React from 'react'
import ReactDOM from 'react-dom'
import ChessGame from '@/ChessGame'
import ChessGameProvider from '@/context'
import '@/scss/main.scss'

ReactDOM.render(
  <ChessGameProvider>
    <ChessGame />
  </ChessGameProvider>
  , document.getElementById('root'))
