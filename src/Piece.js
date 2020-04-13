import React from 'react';
import pieceImg from "./pieces.png";

const Piece = ({data, size, onClick}) => {

    let x = size * data.xC;
    let y = size * data.yC;
   

    let style = {
        width: data.clicked? "56px" : "62px",
        height: data.clicked? "56px" : "62px",
        backgroundImage: `url(${pieceImg})`,
        backgroundSize: "370px",
        backgroundPosition: data.pngPos,
        backgroundOrigin: "border-box",
        position: "absolute",
        border: `3px solid ${data.bkground}`,
        transform: `translate(${x}px,${y}px)`
    }
  
    return(
        <div
            className="piece"
            style={style}
            name={data.name}
            onClick={() => onClick(data.name)}></div>
    );
  

};

export default Piece;

