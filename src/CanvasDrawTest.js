import React, {useState, useEffect, useRef} from "react";
import piecesIMG from "./pieces.png";
import { PIECE_SVG } from "./CONSTANTS";

const CanvasDrawTest = (props = {}) => {
  
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
  const multiRef1 = useRef(null);
  const multiRef2 = useRef(null);

  const BISHOP = new Path2D(PIECE_SVG.BISHOP_SVG);
  const PIECESCALE = 0.58;

  const PIECETEST = {
    piece1: {svg: PIECE_SVG.BISHOP_SVG, x: 0, y: 0},
    piece2: {svg: PIECE_SVG.QUEEN_SVG, x: 60, y: 0},
    piece3: {svg: PIECE_SVG.KING_SVG, x: 120, y: 0},
    piece4: {svg: PIECE_SVG.PAWN_SVG, x: 180, y: 0}
  };

  const drawPiece = (context, location, SVG) => {
    
    context.moveTo(location[0],location[1]);
    context.translate(location[0],location[1]);
    context.fill(new Path2D(SVG));
    context.restore();
  }
 
  const lineTest = (context, location, SVG) => {
    context.beginPath();
    context.moveTo(location[0],location[1]);
    context.translate(location[0],location[1]);
    context.closePath();
    context.stroke(new Path2D(SVG));
    context.restore();
  }

  const drawGrid = (context) => {
    context.strokeWidth = 1;
    context.strokeStyle = "blue";
    for(let i = 0; i < 10; i++){
      context.beginPath();
      context.moveTo(i*tileSize,0);
      context.lineTo(i*tileSize,480);
      context.closePath();
      context.stroke();
    }
    context.restore();
    context.strokeWidth = 1;
    context.strokeStyle = "blue";
    for(let i = 0; i < 10; i++){
      context.beginPath();
      context.moveTo(0,i*tileSize);
      context.lineTo(480,i*tileSize);
      context.closePath();
      context.stroke();
    }
    context.restore();
  }

  const canvasClick = (e) => {
    console.log(`just clicked ${e.target.id}`);
    console.log(e.clientX);
    let coordinates = [e.clientX, e.clientY];
  }

  useEffect(() => {
    // const context = pieceBoardRef.current.getContext('2d');
    const context1 = multiRef1.current.getContext('2d');
    const context2 = multiRef2.current.getContext('2d');
    
    //reposition canvas on the screen
    multiRef1.current.style.left = "100px";


    context1.fillStyle = "blue";
    context1.scale(PIECESCALE,PIECESCALE);
    context1.translate(-3, 0);
    context1.fill(new Path2D(PIECETEST.piece1.svg));
    
    // The SVG paths all start at different points of the shape, so they have different "origins" and require different translations
    context2.fillStyle = "red";
    context2.translate(-24,-61);
    context2.scale(PIECESCALE,PIECESCALE);
    context2.fill(new Path2D(PIECETEST.piece2.svg));

  })

  const pieceBoardStyle = {
    padding: 0,
    margin: 0,
    position: "relative",
    border: "1px solid red",
    top: "100px"
  }

  const multiStyle = {
    padding: 0,
    margin: 0,
    position: "absolute",
    border: "2px solid green",
    display: "inline-block"
  }

  const multiCanvas = [
    <canvas
      ref={multiRef1}
      id='canvas1'
      key="canvas1"
      width="60"
      height="60"
      style={multiStyle}
      onClick={canvasClick} />,
    <canvas
      ref={multiRef2}
      id="canvas2"
      key="canvas2"
      width="60"
      height="60"
      style={multiStyle}
      onClick={canvasClick} />
  ]


  return (
    <div>
      {multiCanvas}
    </div>
  )

  
};

export default CanvasDrawTest;