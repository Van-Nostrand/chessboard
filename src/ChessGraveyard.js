import React from "react";

const ChessGraveyard = ({pieces, idString}) => {

  let piecesToRender;
  if(pieces && pieces.length > 0){
    piecesToRender = pieces.map(piece => piece);
  }

  return(
    <div id={idString} className="graveyard" >
      <h3>the graveyard</h3>
      {piecesToRender}
    </div>
  )
}

export default ChessGraveyard;