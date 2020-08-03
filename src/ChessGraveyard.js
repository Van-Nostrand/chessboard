import React from "react";

const ChessGraveyard = ({pieces}) => {

  let piecesToRender;
  if(pieces && pieces.length > 0){
    piecesToRender = pieces.map(piece => piece);
  }

  return(
    <div className="graveyard" >
      the graveyard!
      {piecesToRender}
    </div>
  )
}

export default ChessGraveyard;