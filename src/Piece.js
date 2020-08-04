import React from 'react';
import pieceImg from "./pieces.png";

const BACKGROUNDSIZE = 400;

//TODO - remove need for hard-coded BACKGROUNDSIZE property
const Piece = ({border, name, dead, x, y, size, pngPos, onClick}) => {

  let borderLogic = border === name ? "1px solid yellow" : "";
  let isDead = dead ? 
    `translate(${-50}px,${-50}px)` : 
    `translate(${size * x}px,${size * y}px)`;

  let style = {
    width: size,
    height: size,
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `${BACKGROUNDSIZE}px`,
    backgroundPosition: pngPos,
    transform: isDead,
    border: borderLogic,
    
  }

  return(
    <div
        className="piece"
        style={style}
        name={name}
        onClick={(e) => onClick(e, name)}></div>
  );
};

export default Piece;

