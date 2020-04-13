import React from 'react';
import './Tile.css';

const Tile = (props) => {
  let style = {
    backgroundColor: props.backgroundColor,
    width: `${props.size}px`,
    height: `${props.size}px`,
    border: `${props.borderSize}px solid ${props.borderColour}`,
    margin: "0",
    padding: "0",
    boxSizing: "border-box"
  };
  
  return(
    <div className="tile" onClick={props.onClick} style={style}>
    </div>);
}

export default Tile;
