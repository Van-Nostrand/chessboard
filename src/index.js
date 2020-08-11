import React from 'react';
import ReactDOM from 'react-dom';
import ChessGame from "./ChessGame";
import CanvasChessBoard from "./CanvasChessBoard";
import CanvasPieces from "./CanvasPieces";
import "./PromotionMenu.css";
// import "./index.css";
import CanvasPieceTest from "./CanvasPieceTest";
import CanvasChessGameTest from "./CanvasChessGameTest";


const tileClick = (e) => {
  console.log(e.clientX);
}

ReactDOM.render(
  
    <CanvasChessGameTest />
  
  , document.getElementById('root')
);