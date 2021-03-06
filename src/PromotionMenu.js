import React, {useState, useEffect} from "react";
import pieceImg from "./assets/pieces.png";


export const PromotionMenu = ({selectPiece, team}) => {
  const [pieceSelection, setPieceSelection] = useState("");

  useEffect(() => {
    if(pieceSelection.length > 0){
      selectPiece(pieceSelection);
    }
  },[pieceSelection]);

  let queenStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `400px`,
    backgroundPosition: team === "w" ? "-70px -3px" : "-70px 63px",
    backgroundOrigin: "border-box",
  }
  let knightStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `400px`,
    backgroundPosition: team === "w" ? "197px -3px" : "197px 63px",
    backgroundOrigin: "border-box",
  }
  let bishopStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `400px`,
    backgroundPosition: team === "w" ? "-136px -3px" : "-136px 63px",
    backgroundOrigin: "border-box",
  }
  let rookStyle = {
    backgroundImage: `url(${pieceImg})`,
    backgroundSize: `400px`,
    backgroundPosition: team === "w" ? "130px -3px" : "130px 63px",
    backgroundOrigin: "border-box",
  }

  return (
    <div id="promotion-menu">
      <p>Choose a piece</p>
      <div style={queenStyle} className="promotion-choice" onClick={() => setPieceSelection("Q")}></div>
      <div style={knightStyle} className="promotion-choice" onClick={() => setPieceSelection("N")}></div>
      <div style={bishopStyle} className="promotion-choice" onClick={() => setPieceSelection("B")}></div>
      <div style={rookStyle} className="promotion-choice" onClick={() => setPieceSelection("R")}></div>
    </div>
  )
}

