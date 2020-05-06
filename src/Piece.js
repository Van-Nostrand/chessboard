import React from 'react';
import pieceImg from "./pieces.png";

// const ORIGINALWIDTH = 2000;
// const ORIGINALHEIGHT = 667;
// const RAWPIECEHEIGHT = 333.5;

const BACKGROUNDSIZE = 400;

const Piece = ({data, size, onClick, border, rules}) => {
  console.log(rules);
  let x = size * data.xC;
  let y = size * data.yC;

  let style = {
    width: size,
    height: size,
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `${BACKGROUNDSIZE}px`,
    backgroundPosition: data.pngPos,
    backgroundOrigin: "border-box",
    position: "absolute",
    transform: `translate(${x}px,${y}px)`,
    border: border,
    boxSizing: "border-box",
    pointerEvents: "all"
  }

  return(
    <div
        className="piece"
        style={style}
        name={data.name}
        onClick={(e) => onClick(e, data.name)}></div>
  );
};

export default Piece;

