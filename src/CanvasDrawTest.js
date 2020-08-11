import React, {useState, useEffect, useRef} from "react";
import piecesIMG from "./pieces.png";
// import { PIECE_SVG } from "./CONSTANTS";

import {
  // BOARDDIMENSIONS,
  // TILESIZE,
  // TILEBORDERSIZE, 
  PIECE_OBJECTS,
  PIECEPATHS,
  PIECE_PROTOTYPES,
  PIECE_SVG,
  // PP_TEST,
  // EN_PASSANT_TEST
} from "./CONSTANTS";

const CanvasDrawTest = (props = {}) => {

  let [coordinates, setCoordinates] = useState([0,0]);
  let [conti, setConti] = useState([]);
  let [refArray, setRefArray] = useState(new Array(16).map(ref => useRef(null)));
  
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
  const multiRef3 = useRef(null);

  const BISHOP = new Path2D(PIECE_SVG.BISHOP_SVG);
  const PIECESCALE = 0.58;

  const PIECETEST = {
    piece1: {svg: PIECE_SVG.BISHOP_SVG, x: 0, y: 0, transformArr: [-3,0]},
    piece2: {svg: PIECE_SVG.QUEEN_SVG, x: 60, y: 0, transformArr: [-24,-61]},
    piece3: {svg: PIECE_SVG.KING_SVG, x: 120, y: 0, transformArr: [-30,-64]},
    piece4: {svg: PIECE_SVG.PAWN_SVG, x: 180, y: 0, transformArr: [0,0]},
    piece5: {svg: PIECE_SVG.KNIGHT_SVG, x: 240, y: 0, transformArr: [0,0]},
    piece6: {svg: PIECE_SVG.ROOK_SVG, x: 300, y: 0, transformArr: [0,0]}
  };

  const canvasClick = (e) => {
    // console.log(`just clicked ${e.target.id}`);
    // console.log(e.clientX);
    
  }

  const moveCanvas = (x,y) => {
    // console.log(multiRef1);
    multiRef1.current.style.left = x;
    multiRef1.current.style.top = y;
  }

  const backgroundClick = (e) => {
    
    setCoordinates([e.clientX, e.clientY]);
  }

  useEffect(() => {
    const contextArray = new Array(conti.length).fill();

    const context1 = multiRef1.current.getContext('2d');
    const context2 = multiRef2.current.getContext('2d');
    const context3 = multiRef3.current.getContext('2d');

    //if you don't save and restore, each time a piece moves it will redraw itself
    context1.save();
    context2.save();
    context3.save();
    
    multiRef1.current.style.left = coordinates[0] + "px";
    multiRef1.current.style.top = coordinates[1] + "px";
    multiRef3.current.style.left = "120px";


    context1.fillStyle = "blue";
    context1.scale(PIECESCALE,PIECESCALE);
    context1.translate(-3, 0);
    context1.fill(new Path2D(PIECETEST.piece1.svg));

    
    // The SVG paths all start at different points of the shape, so they have different "origins" and require different translations
    context2.fillStyle = "red";
    context2.translate(-24,-61);
    context2.scale(PIECESCALE,PIECESCALE);
    context2.fill(new Path2D(PIECETEST.piece2.svg));

    context3.fillStyle = "#ffaa00";
    context3.translate(-30,-64);
    context3.scale(PIECESCALE, PIECESCALE);
    context3.fill(new Path2D(PIECETEST.piece3.svg));

    context1.restore();
    context2.restore();
    context3.restore();

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
    // display: "inline-block"
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
      onClick={canvasClick} />,
    <canvas 
      ref={multiRef3}
      id="canvas3"
      key="canvas3"
      width="60"
      height="60"
      style={multiStyle}
      onClick={canvasClick} />
  ];

  const backgroundStyle = {
    padding: 0,
    margin: 0,
    position: "absolute",
    border: "1px solid purple",
    zIndex: -1
  };
  
  

  return (
    <div>
      {multiCanvas}
      <canvas 
        id="background-canvas"
        width="480"
        height="480"
        style={backgroundStyle}
        onClick={backgroundClick} />
    </div>
  )


  // const drawPiece = (context, location, SVG) => {
    
  //   context.moveTo(location[0],location[1]);
  //   context.translate(location[0],location[1]);
  //   context.fill(new Path2D(SVG));
  //   context.restore();
  // }
 
  // const lineTest = (context, location, SVG) => {
  //   context.beginPath();
  //   context.moveTo(location[0],location[1]);
  //   context.translate(location[0],location[1]);
  //   context.closePath();
  //   context.stroke(new Path2D(SVG));
  //   context.restore();
  // }

  // const drawGrid = (context) => {
  //   context.strokeWidth = 1;
  //   context.strokeStyle = "blue";
  //   for(let i = 0; i < 10; i++){
  //     context.beginPath();
  //     context.moveTo(i*tileSize,0);
  //     context.lineTo(i*tileSize,480);
  //     context.closePath();
  //     context.stroke();
  //   }
  //   context.restore();
  //   context.strokeWidth = 1;
  //   context.strokeStyle = "blue";
  //   for(let i = 0; i < 10; i++){
  //     context.beginPath();
  //     context.moveTo(0,i*tileSize);
  //     context.lineTo(480,i*tileSize);
  //     context.closePath();
  //     context.stroke();
  //   }
  //   context.restore();
  // }
};

export default CanvasDrawTest;