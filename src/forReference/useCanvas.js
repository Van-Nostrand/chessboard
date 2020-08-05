//an example I found at this url
//https://github.com/TheMartinCrabtree/react-canvas-demo
//used for reference only

import React, {useState, useEffect, useRef} from "react";

//DECLARE DRAWING CONSTANTS HERE
const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"
const SVG_PATH = new Path2D(heartSVG);

//DECLARE SCALING CONSTANTS HERE
const SCALE = 0.1;
const OFFSET = 80;
export const canvasWidth = window.innerWidth * .5;
export const canvasHeight = window.innerHeight * .5;

export function draw(ctx, location){
  console.log("attempting to draw")
  ctx.fillStyle = 'red';
  ctx.shadowColor = 'blue';
  // ctx.fillStyle = lightTile;
  // ctx.shadowColor = darkTile;
  ctx.shadowBlur = 15;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
  ctx.rotate(225 * Math.PI / 180);
  ctx.fill(SVG_PATH);
  // .restore(): Canvas 2D API restores the most recently saved canvas state
  ctx.restore();
}

export function useCanvas(){
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [lightTile, setLightTile] = useState(""); //throws error?
  // const [darkTile, setDarkTile] = useState("#745120");

  useEffect(()=>{
      const canvasObj = canvasRef.current;
      const ctx = canvasObj.getContext('2d');
      console.log("here's lightTile");
      console.log(lightTile);
      // clear the canvas area before rendering the coordinates held in state
      ctx.clearRect( 0,0, canvasWidth, canvasHeight );

      // draw all coordinates held in state
      coordinates.forEach((coordinate)=>{draw(ctx, coordinate)});
  });

  return [ coordinates, setCoordinates, lightTile, setLightTile,/* darkTile, setDarkTile,*/ canvasRef, canvasWidth, canvasHeight ];

}


// import React, { useState, useEffect, useRef } from 'react';

// // Path2D for a Heart SVG
// const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"
// const SVG_PATH = new Path2D(heartSVG);

// // Scaling Constants for Canvas
// const SCALE = 0.1;
// const OFFSET = 80;
// export const canvasWidth = window.innerWidth * .5;
// export const canvasHeight = window.innerHeight * .5;

// export function draw(ctx, location){
//   console.log("attempting to draw")
//   ctx.fillStyle = 'red';
//   ctx.shadowColor = 'blue';
//   ctx.shadowBlur = 15;
//   ctx.save();
//   ctx.scale(SCALE, SCALE);
//   ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
//   ctx.rotate(225 * Math.PI / 180);
//   ctx.fill(SVG_PATH);
//   // .restore(): Canvas 2D API restores the most recently saved canvas state
//   ctx.restore();  
// };

// export function useCanvas(){
//     const canvasRef = useRef(null);
//     const [coordinates, setCoordinates] = useState([]);

//     useEffect(()=>{
//         const canvasObj = canvasRef.current;
//         const ctx = canvasObj.getContext('2d');
//         // clear the canvas area before rendering the coordinates held in state
//         ctx.clearRect( 0,0, canvasWidth, canvasHeight );

//         // draw all coordinates held in state
//         coordinates.forEach((coordinate)=>{draw(ctx, coordinate)});
//     });

//     return [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ];
// }

