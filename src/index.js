import React from 'react'
import ReactDOM from 'react-dom'
import ChessGame from './ChessGame'
import './scss/main.scss'
import ChessGameProvider from './context'

ReactDOM.render(
  <ChessGameProvider>
    <ChessGame />
  </ChessGameProvider>
  , document.getElementById('root'))
