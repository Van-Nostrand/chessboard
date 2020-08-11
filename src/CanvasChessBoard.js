import React, { useState, useEffect, useRef } from 'react';

const CanvasChessBoard = (props = {}) => {
  
  const {
    tileSize = 60,
    lightTile = "#ecb379",
    darkTile = "#745120",
    boardWidth = 8,
    boardHeight = 8,
    offsetTop = 0,
    offsetLeft = 0,
    onClick,
    pixelRatio = window.devicePixelRatio //unused
  } = props;

  const canvasRef = useRef(null);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    
    context.save();

    let tileBool = true;

    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 8; j++){
        
        context.fillStyle = tileBool ? lightTile : darkTile;
        context.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);

        if(j === 0 || j % 7 !== 0){
          tileBool = !tileBool;
        }
      }
    }
  });

  const canvasStyle = {
    padding: 0,
    margin: 0,
    left: offsetLeft + "px",
    top: offsetTop + "px",
    position: "absolute"
  }

  return (
    <canvas 
      id="canvas-board"
      ref={canvasRef}
      width={tileSize * boardWidth}
      height={tileSize * boardHeight}
      style={canvasStyle}
      onClick={onClick} />
  )
};

export default CanvasChessBoard;