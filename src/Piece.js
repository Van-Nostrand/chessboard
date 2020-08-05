import React from 'react';
import pieceImg from "./pieces.png";

const BACKGROUNDSIZE = 400;

//TODO - remove need for hard-coded BACKGROUNDSIZE property
const Piece = ({border = "", name, dead, x, y, size, onClick }) => {

  let borderLogic = border === name ? "1px solid yellow" : "";
  let style, divElement, pngPos;
  switch(true){
    case /^wQ/.test(name): pngPos = "-70px -3px";
      break;
    case /^bQ/.test(name): pngPos = "-70px 63px";
      break;
    case /^wK/.test(name): pngPos = "-4px -3px";
      break;
    case /^bK/.test(name): pngPos = "-4px 63px";
      break;
    case /^wB/.test(name): pngPos = "-136px -3px";
      break;
    case /^bB/.test(name): pngPos = "-136px 63px";
      break;
    case /^wN/.test(name): pngPos = "197px -3px";
      break;
    case /^bN/.test(name): pngPos = "197px 63px";
      break;
    case /^wR/.test(name): pngPos = "130px -3px";
      break;
    case /^bR/.test(name): pngPos = "130px 63px";
      break;
    case /^wP/.test(name): pngPos = "65px -3px";
      break;  
    case /^bP/.test(name): pngPos = "65px 63px";
      break;
    default: console.log("error in Piece.js switch");
  }


  if(dead){
    style = {
      width: size,
      height: size,
      backgroundImage: `url(${pieceImg})`,
      backgroundSize: `${BACKGROUNDSIZE}px`,
      backgroundPosition: pngPos,
      transform: "",
      position: "relative",
    };
    divElement = <div
                  className="dead piece"
                  style={style}
                  name={name}></div>
  }
  else {
    style = {
      width: size,
      height: size,
      backgroundImage: `url(${pieceImg})`,
      backgroundSize: `${BACKGROUNDSIZE}px`,
      backgroundPosition: pngPos,
      transform: `translate(${size * x}px,${size * y}px)`,
      position: "absolute",
      border: borderLogic    
    };

    divElement = <div
                  className="piece"
                  style={style}
                  name={name}
                  onClick={(e) => onClick(e, name)}></div>
  }


  return divElement;
};

export default Piece;

