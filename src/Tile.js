import React from 'react';

const Tile = (props) => {
  let style = {
    backgroundColor: props.backgroundColor,
    width: `${props.size}px`,
    height: `${props.size}px`,
    border: `${props.borderSize}px solid ${props.borderColour}`,
  };
  
  return(
    <div className="tile" onClick={props.onClick} style={style}>
    </div>);
}

export default Tile;
