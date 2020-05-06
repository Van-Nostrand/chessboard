import React from 'react';
import pieceImg from "./pieces.png";

// const ORIGINALWIDTH = 2000;
// const ORIGINALHEIGHT = 667;
// const RAWPIECEHEIGHT = 333.5;

const BACKGROUNDSIZE = 400;

const Piece = ({name, size, onClick, border, rules}) => {
  
  let borderLogic = border === name ? "1px solid yellow" : "";
  let isDead = rules.dead ? 
    `translate(${-50}px,${-50}px)` : 
    `translate(${size * rules.xC}px,${size * rules.yC}px)`;
  let style = {
    width: size,
    height: size,
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `${BACKGROUNDSIZE}px`,
    backgroundPosition: rules.pngPos,
    backgroundOrigin: "border-box",
    position: "absolute",
    transform: isDead,
    border: borderLogic,
    boxSizing: "border-box",
    pointerEvents: "all"
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

