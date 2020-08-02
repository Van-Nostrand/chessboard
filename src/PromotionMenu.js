import React, {useState, useEffect} from "react";


export const  PromotionMenu = (props) => {
  const [pieceSelection, setPieceSelection] = useState("");

  useEffect(() => {
    if(pieceSelection.length > 0){
      props.selectPiece(pieceSelection);
    }
  },[pieceSelection]);

  return (
    <div id="promotion-menu">
      <p>Choose a piece type</p>
      <div className="promotion-choice" onClick={() => setPieceSelection("Q")}>Queen</div>
      <div className="promotion-choice" onClick={() => setPieceSelection("N")}>Knight</div>
      <div className="promotion-choice" onClick={() => setPieceSelection("B")}>Bishop</div>
      <div className="promotion-choice" onClick={() => setPieceSelection("R")}>Rook</div>
    </div>
  )
}

