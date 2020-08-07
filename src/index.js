import React from 'react';
import ReactDOM from 'react-dom';
import ChessGame from "./ChessGame";
import CanvasChessBoard from "./CanvasChessBoard";
import CanvasPieces from "./CanvasPieces";
import "./PromotionMenu.css";
// import "./index.css";
import CanvasDrawTest from "./CanvasDrawTest";


const tileClick = (e) => {
  console.log(e.clientX);
}

ReactDOM.render(
  <div>
    {/* <CanvasChessBoard onClick={tileClick} />
    <ChessGame /> */}
    <ChessGame />
  </div>
  , document.getElementById('root')
);