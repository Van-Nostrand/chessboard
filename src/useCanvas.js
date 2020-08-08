import React, { useState, useEffect, useRef } from "react";

const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z";
const SVG_PATH = new Path2D(heartSVG);

//scaling constants
const SCALE = 0.1;
const OFFSET = 80;
export const canvasWidth = window.innerWidth * .5;
export const canvasHeight = window.innerHeight * .5;

export function draw(ctx, location){
  console.log("attempting to draw");
  ctx.fillStyle="red";
  ctx.shadowColor = 'blue';
  ctx.shadowBlur = 15;
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
  ctx.rotate(225 * Math.PI / 180);
  ctx.fill(SVG_PATH);

  ctx.restore();
}

export const useCanvas = () => {

  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');

    //clear the canvas before rendering
    ctx.clearRect(0,0, canvasWidth, canvasHeight);

    //draw all coordinates held in state
    coordinates.forEach((coordinate) => {draw(ctx, coordinate)});
  });

  return [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight];
}