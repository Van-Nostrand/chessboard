import React, { useContext, useRef, useState } from 'react'
import { ChessGameContext } from '@/context'
import { makeTiles } from '@/functions'

export default function TestingBoard () {
  const { chessGameState, dispatch } = useContext(ChessGameContext)
  const {
    testmode,
    testboard,
    tileSize
  } = chessGameState
  const testingContainerRef = useRef(null)
  const [ testBoardWidth, setTestBoardWidth ] = useState('')
  const [ testBoardHeight, setTestBoardHeight ] = useState('')

  const handleTestModeSwitch = () => {
    testmode
      ? dispatch({ type: 'testModeOff' })
      : dispatch({ type: 'testModeOn' })
  }

  const handleSubmitBoardParams = () => {
    dispatch({
      type: 'init-testboard',
      payload: {
        width: testBoardWidth,
        height: testBoardHeight
      }
    })
    setTestBoardWidth('')
    setTestBoardHeight('')
  }

  const handleNumericInput = (value, propName) => {
    if (/^[0-9]+$/.test(value)) {
      propName === 'width'
        ? setTestBoardWidth(parseInt(value))
        : setTestBoardHeight(parseInt(value))
    } else if (value === '') {
      propName === 'width'
        ? setTestBoardWidth('')
        : setTestBoardHeight('')
    }
  }

  const handleClickTile = (e) => {
    console.log('you clikced this ', e)
  }

  const testBoardIsRendering = Object.keys(testboard).length > 0

  const tiles = testBoardIsRendering ? makeTiles(tileSize, [testboard.width, testboard.height], handleClickTile) : []
  const tileContainerStyle = testBoardIsRendering
    ? { width: `${testboard.width * tileSize}px`, height: `${testboard.height * tileSize}px` }
    : {}
  const pieces = []
  const testBoardStyle = {
    width: `${tileSize * testBoardWidth}px`,
    height: `${tileSize * testBoardHeight}px`
  }

  return (
    <div className={ testmode ? 'testing-board' : 'testing-board-off'}>
      <div
        className='test-mode-switch'
        style={{ cursor: 'pointer' }}
        onClick={handleTestModeSwitch}
      >
        <span>{ testmode ? 'disable testmode' : 'start testmode' }</span>
      </div>
      { !testBoardIsRendering && (
        <div className={ testmode ? 'testing-board__form' : 'testing-board__form--hidden'}>
          <div>
            <label htmlFor='boardwidth'>test board width</label>
            <input
              type='text'
              name='boardwidth'
              value={testBoardWidth}
              onChange={(e) => handleNumericInput(e.target.value, 'width')}
            />
          </div>
          <div>
            <label htmlFor='boardheight'>test board height</label>
            <input
              type='text'
              name='boardheight'
              value={testBoardHeight}
              onChange={(e) => handleNumericInput(e.target.value, 'height')}
            />
          </div>
          <div>
            <button onClick={handleSubmitBoardParams}>
              submit
            </button>
          </div>
        </div>
      )}
      <div
        className={ testmode ? 'board-container test-board' : 'board-container--hidden'}
        style={ testmode ? testBoardStyle : {} }
      >
        <div
          className='board-container__tiles'
          style={tileContainerStyle}
        >
          {tiles}
        </div>
        <div
          className='board-container__pieces'
          ref={testingContainerRef}
        >
          {pieces}
        </div>
      </div>
    </div>
  )
}
