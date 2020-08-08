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

  const BISHOP = new Path2D(PIECE_SVG.BISHOP_SVG);
  const PIECESCALE = 0.6;
  const PIECE_TRANSLATE = [ -10 , 0 ];

  const PIECETEST = {
    piece1: {svg: PIECE_SVG.BISHOP_SVG, x: 0, y: 0},
    piece2: {svg: PIECE_SVG.QUEEN_SVG, x: 50, y: 50},
    piece3: {svg: PIECE_SVG.KING_SVG, x: 100, y: 100},
    piece4: {svg: PIECE_SVG.PAWN_SVG, x: 150, y: 150}
  };

  const drawPiece = (context, location, SVG) => {
    
    context.translate(location[0],location[1]);
    context.fill(new Path2D(SVG));
    // context.translate(-location[0], -location[1]);
    context.restore();
  }

  useEffect(() => {
    const context = pieceBoardRef.current.getContext('2d');
    
    // this "saves" the current state of context
    context.scale(PIECESCALE, PIECESCALE);
    // context.moveTo(0,0);
    context.lineWidth = -1;
    context.fillStyle = "#333333";
    context.save();
    
    for(const piece in PIECETEST){
      drawPiece(context, [PIECETEST[piece].x, PIECETEST[piece].y], PIECETEST[piece].svg);
      // context.restore();
    }

    // stroke is unnecessary unless you want your paths to be outlines. with path elements, fill will draw like a pen or paintbrush. 

    // this restores the saved context state
    // in this case, it restores a blank canvas
    context.restore();
  })

  const pieceBoardStyle = {
    padding: 0,
    margin: 0,
    position: "relative"
  }

  // let divStyle = {
  //   backgroundImage: `url(${piecesIMG})`,
  //   backgroundSize: "1200px",
  //   backgroundPosition: "50px 0",
  //   width: "300px",
  //   height: "300px",
  //   position: "absolute",
  //   // transform: "translate(50px, -200px)"
  //   top: 0,
  //   left: 0
  // }

  return (
    <div>
      <canvas 
        id="piece-board"
        ref={pieceBoardRef}
        width={tileSize * boardWidth}
        height={tileSize * boardHeight}
        style={pieceBoardStyle} />
      {/* <div style={divStyle}></div> */}
    </div>
  )

  
};

export default CanvasDrawTest;