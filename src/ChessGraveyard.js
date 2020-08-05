import React from "react";

const ChessGraveyard = ({pieces, idString}) => {

  let piecesToRender;
  if(pieces && pieces.length > 0){
    piecesToRender = pieces;
  }

  
  let text = idString.charAt(0) === "w" ? "WHITE GRAVEYARD" : "BLACK GRAVEYARD";

  let transformString = `rotate(${idString.charAt(0) === "w" ? "-90deg" : "90deg"})`;

  let style = {
    transform: transformString
  }
  
  return(
    <div id={idString} className="graveyard" >
      <h3 style={style}>{text}</h3>
      {piecesToRender}
    </div>
  )
}

export default ChessGraveyard;