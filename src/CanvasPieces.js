import React, { useState, useEffect, useRef } from 'react';

const CanvasChessBoard = (props = {}) => {
  
  const {
    tileSize = 60,
    boardWidth = 8,
    boardHeight = 8,
    offsetTop = 0,
    offsetLeft = 0,
    onClick,
    pixelRatio = window.devicePixelRatio //unused
  } = props;

  const pieceBoardRef = useRef(null);

  const PIECE_SVG = "m5 50 l50 50";
  const PIECE_PATH = new Path2D(PIECE_SVG);

  useEffect(() => {
    const context = pieceBoardRef.current.getContext('2d');
    
    context.save();


    context.restore();
  })

  const pieceBoardStyle = {
    padding: 0,
    margin: 0,
    position: "relative"
  }

  return (
    <canvas 
      id="piece-board"
      ref={pieceBoardRef}
      width={tileSize * boardWidth}
      height={tileSize * boardHeight}
      style={pieceBoardStyle}
      onClick={onClick} />
  )
};

export default CanvasChessBoard;