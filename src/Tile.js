import React from 'react';
import './Tile.css';

const Tile = (props) => {
  let style = {
    background: props.backgroundColor,
    // width: props.size + "px",
    width: `${props.size}px`,
    height: `${props.size}px`,
    // height: props.size + "px",
    border: `1px solid ${props.borderC}`
    // border: "1px solid " + props.borderC
  };
  return(
    <div className="tile" onClick={props.onClick} style={style}>
    </div>);
}

export default Tile;
