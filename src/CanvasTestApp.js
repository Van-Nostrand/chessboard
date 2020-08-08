import React from "react";
import {useCanvas} from "./useCanvas";

function CanvasTestApp() {
  const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ] = useCanvas();

  const handleCanvasClick = (e) => {
    const currentCoord = {x: e.clientX, y: e.clientY};
    setCoordinates([...coordinates, currentCoord]);
  };

  const handleClearCanvas = (e) => {
    setCoordinates([]);
  }

  return(
    <main className="canvas-test-app">
      <canvas 
        className="canvas-app"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleCanvasClick} /> 

      <div className="button">
        <button onClick={handleClearCanvas}>CLEAR</button>
      </div>
    </main>
  );
};

export default CanvasTestApp;