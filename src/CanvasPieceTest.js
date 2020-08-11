import React, {useState, useEffect, useRef} from "react";
import piecesIMG from "./pieces.png";
import {
  PIECE_OBJECTS,
  PIECE_PATHS,
  PIECE_PROTOTYPES,
  PIECE_SVGS,
} from "./CONSTANTS";

const CanvasPieceTest = (props = {}) => {

  const {
    tileSize = 60,
    boardWidth = 8,
    boardHeight = 8,
    offsetTop = 0,
    offsetLeft = 0,
    onClick,
    PIECE_SCALE = 0.58,
    pixelRatio = window.devicePixelRatio //unused
  } = props;

  const getSVGData = (piece) => {
    switch(true){
      case /^(w|b)Q/.test(piece): return PIECE_SVGS.queen;
      case /^(w|b)K/.test(piece): return PIECE_SVGS.king;
      case /^(w|b)B/.test(piece): return PIECE_SVGS.bishop;
      case /^(w|b)R/.test(piece): return PIECE_SVGS.rook;
      case /^(w|b)P/.test(piece): return PIECE_SVGS.pawn;
      case /^(w|b)N/.test(piece): return PIECE_SVGS.knight;
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
  let [selectedPiece, setSelectedPiece] = useState("");

  const backgroundRef = useRef(null);

  const pieceClick = (e) => {
    if(selectedPiece.length > 0){
      console.log(`${selectedPiece} is already selected`);
    }
    else{
      setSelectedPiece(e.target.id);

    }
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
    if(selectedPiece.length > 0){
      console.log(`${e.clientX},${e.clientY}`);
      setThePieces({...thePieces, [selectedPiece]: {...thePieces[selectedPiece], x: Math.floor(e.clientX / 60), y: Math.floor(e.clientY / 60)}});
      setSelectedPiece("");
    }
  }
  
  useEffect(() => {
    console.log("called useEffect");
    const backgroundContext = backgroundRef.current.getContext('2d');
    drawGrid(backgroundContext);

    const contextArray = Object.keys(canvasRefs).map(refName => canvasRefs[refName].current.getContext('2d'));

    contextArray.forEach(ctx => {
      ctx.save();
    });

    contextArray.forEach(ctx => {
      let pieceName = ctx.canvas.id;
      ctx.fillStyle="blue";
      ctx.scale(PIECE_SCALE, PIECE_SCALE);
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
    border: "1px solid green",
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

export default CanvasPieceTest;