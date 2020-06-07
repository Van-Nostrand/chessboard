import React from 'react';
import pieceImg from "./pieces.png";

const BACKGROUNDSIZE = 400;
//TODO - remove need for hard-coded BACKGROUNDSIZE property
const Piece = (props) => {
  let borderLogic = props.border === props.name ? "1px solid yellow" : "";
  let isDead = props.dead ? 
    `translate(${-50}px,${-50}px)` : 
    `translate(${props.size * props.xC}px,${props.size * props.yC}px)`;
  let style = {
    width: props.size,
    height: props.size,
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `${BACKGROUNDSIZE}px`,
    backgroundPosition: props.pngPos,
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
        name={props.name}
        onClick={(e) => props.onClick(e, props.name)}></div>
  );
};

export default Piece;

