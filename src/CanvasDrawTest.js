import React, {useState, useEffect, useRef} from "react";
import piecesIMG from "./pieces.png";
import {

  PIECE_OBJECTS,
  PIECE_PATHS,
  PIECE_PROTOTYPES,
  PIECE_SVG,
} from "./CONSTANTS";

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

  const PIECETEST = {
    piece1: {svg: PIECE_SVG.BISHOP_SVG, x: 0, y: 0, transformArr: [-3,0]},
    piece2: {svg: PIECE_SVG.QUEEN_SVG, x: 60, y: 0, transformArr: [-24,-61]},
    piece3: {svg: PIECE_SVG.KING_SVG, x: 120, y: 0, transformArr: [-30,-64]},
    piece4: {svg: PIECE_SVG.PAWN_SVG, x: 180, y: 0, transformArr: [0,0]},
    piece5: {svg: PIECE_SVG.KNIGHT_SVG, x: 240, y: 0, transformArr: [0,0]},
    piece6: {svg: PIECE_SVG.ROOK_SVG, x: 300, y: 0, transformArr: [0,0]}
  };

  const getSVGData = (piece) => {
    switch(true){
      case /^(w|b)Q/.test(piece): return {svg: PIECE_SVG.QUEEN_SVG, transformArr: [-39,-105]};
      case /^(w|b)K/.test(piece): return {svg: PIECE_SVG.KING_SVG, transformArr: [-53,-110]} ;
      case /^(w|b)B/.test(piece): return {svg: PIECE_SVG.BISHOP_SVG, transformArr: [-3,-5]};
      case /^(w|b)R/.test(piece): return {svg: PIECE_SVG.ROOK_SVG, transformArr: [-57,-110]}
      case /^(w|b)P/.test(piece): return {svg: PIECE_SVG.PAWN_SVG, transformArr: [-55,-65]};
      case /^(w|b)N/.test(piece): return {svg: PIECE_SVG.KNIGHT_SVG, transformArr: [-41,-98]};
      default: console.log("something went wrong in getSVGData");
    }
  }

  let pieceLedger = {};
  for(let piece in PIECE_OBJECTS){
    pieceLedger[piece] = { ...PIECE_OBJECTS[piece], ...getSVGData(piece)};
  }

  let bunchOfRefs = {};
  Object.keys(pieceLedger).forEach(piece => bunchOfRefs[piece] = useRef(null));
  
  let [coordinates, setCoordinates] = useState([0,0]);
  let [thePieces, setThePieces] = useState(pieceLedger);
  let [canvasRefs, setCanvasRefs] = useState(bunchOfRefs);

  const backgroundRef = useRef(null);
  const PIECESCALE = 0.58;

  const pieceClick = (e) => {
    console.log(`just clicked ${e.target.id} at coordinates ${e.clientX},${e.clientY}`);
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

  const backgroundClick = (e) => {
    console.log(`just clicked the background at coordinates ${e.clientX}, ${e.clientY}`);
  }
  
  useEffect(() => {
    const backgroundContext = backgroundRef.current.getContext('2d');
    drawGrid(backgroundContext);

    const contextArray = Object.keys(canvasRefs).map(refName => canvasRefs[refName].current.getContext('2d'));

    contextArray.forEach(ctx => {
      ctx.save();
    });

    contextArray.forEach(ctx => {
      let pieceName = ctx.canvas.id;
      ctx.fillStyle="blue";
      ctx.scale(PIECESCALE, PIECESCALE);
      ctx.translate(thePieces[pieceName].transformArr[0], thePieces[pieceName].transformArr[1]);
      ctx.fill(new Path2D(thePieces[pieceName].svg));
      ctx.restore();
      canvasRefs[pieceName].current.style.left = thePieces[pieceName].x * 60 + "px";
      canvasRefs[pieceName].current.style.top = thePieces[pieceName].y * 60 + "px";
    });

  });
 
  const backgroundStyle = {
    padding: 0,
    margin: 0,
    position: "absolute",
    border: "1px solid purple",
    zIndex: -1
  };

  const pieceCanvasStyle = {
    padding: 0,
    margin: 0,
    position: "absolute",
    border: "2px solid green",
  }
  
  const pieceCanvasses = Object.keys(thePieces)
                                .map(piece => 
                                      <canvas
                                        id={thePieces[piece].name}
                                        key={thePieces[piece].name}
                                        width="60"
                                        height="60"
                                        ref={canvasRefs[piece]}
                                        style={pieceCanvasStyle}
                                        onClick={pieceClick} />);

  return (
    <div>
      {pieceCanvasses}
      <canvas 
        id="background-canvas"
        width="480"
        height="480"
        ref={backgroundRef}
        style={backgroundStyle}
        onClick={backgroundClick} />
    </div>
  )  
};

export default CanvasDrawTest;