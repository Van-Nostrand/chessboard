import React, { useEffect, useRef} from "react";

const CanvasPieceTest = (props = {}) => {
  const {
    TILE_SIZE = 60,
    boardWidth = 8,
    boardHeight = 8,
    OFFSET_TOP = 0,
    OFFSET_LEFT = 0,
    onClick,
    pieceLedger,
    selectedPiece,
    setSelectedPiece,
    PIECE_SCALE = 0.58,
    pixelRatio = window.devicePixelRatio //unused
  } = props;

  let canvasRefs = {};
  Object.keys(pieceLedger).forEach(piece => canvasRefs[piece] = useRef(null));
  

  const pieceClick = (e) => {
    if(selectedPiece.length > 0){
      console.log(`${selectedPiece} is already selected`);
    }
    else if(selectedPiece === e.target.id){
      props.setSelectedPiece("");
    }
    else{
      props.setSelectedPiece(e.target.id);
    }
  }
  
  useEffect(() => {
    const contextArray = Object.keys(canvasRefs).map(refName => canvasRefs[refName].current.getContext('2d'));

    //save the state of each context
    contextArray.forEach(ctx => {
      ctx.save();
    });

    //draw and position each piece
    contextArray.forEach(ctx => {
      let pieceName = ctx.canvas.id;
      
      ctx.fillStyle= /^w/.test(pieceName) ? "white" : "black";
      ctx.scale(PIECE_SCALE, PIECE_SCALE);
      ctx.translate(pieceLedger[pieceName].transformArr[0], pieceLedger[pieceName].transformArr[1]);
      ctx.fill(new Path2D(pieceLedger[pieceName].svg));
      ctx.restore();
      canvasRefs[pieceName].current.style.left = pieceLedger[pieceName].x * 60 + "px";
      canvasRefs[pieceName].current.style.top = pieceLedger[pieceName].y * 60 + "px";
    });
  });

  const pieceCanvasStyle = {
    padding: 0,
    margin: 0,
    position: "absolute",
    boxSizing: "border-box"
  }
  
  const pieceCanvasses = Object.keys(pieceLedger).map(piece => 
                                      <canvas
                                        id={pieceLedger[piece].name}
                                        key={pieceLedger[piece].name}
                                        width={TILE_SIZE}
                                        height={TILE_SIZE}
                                        ref={canvasRefs[piece]}
                                        style={pieceCanvasStyle}
                                        onClick={pieceClick} /> );

  return (
    <>
      {pieceCanvasses}
    </>
  )  
};

export default CanvasPieceTest;