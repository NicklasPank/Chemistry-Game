import React from "react";
import Matter from "matter-js";
import { BitStorage } from "./Storage";
import { templateLiteral } from "@babel/types";

const bitsets = BitStorage();

//prettier-ignore
export const Beaker = (startX, startY, width, height, thick) => {
  let vectz = [
    {x: 0,           y:  0    },  {x: width,       y:  0     }, {x: width, y: -height},
    {x: width-thick, y: -height}, {x: width-thick, y: -thick }, {x: thick, y: -thick }, 
    {x: thick,       y: -height}, {x: 0,           y: -height}];
  let theBeaker = Matter.Bodies.fromVertices(startX, startY, vectz, { restitution: 0.1, density: 0.1, frictionAir: 0 });
  theBeaker.collisionFilter.group = 1;
  theBeaker.collisionFilter.category = bitsets.categories.beaker;
  return theBeaker;
};

//prettier-ignore
export const Sodiums = (startX, startY, numH, numW, spacing) => {
  const NaRad = 4;
  const NaColor = "#BF0101";
  let NaParticles = [];
  let posX = startX,
    posY = startY;
  for (let i = 0; i < numH; i++) {
    for (let j = 0; j < numW; j++) {
      let temp = Matter.Bodies.circle(posX, posY, NaRad, { restitution: 0.3, friction: 0, label: "Na" });
      temp.render.fillStyle = NaColor;
      temp.collisionFilter.group = 0;
      console.log(temp);
      NaParticles.push(temp);
      posX += spacing + 2 * NaRad;
    }
    posY += spacing + 2 * NaRad;
    posX = startX;
  }
  return NaParticles;
};

export const Water = (beaker, fillPercent) => {
  const waterColor = "#01B2FE";
  const block = Matter.Bodies.rectangle(
    beaker.position.x,
    beaker.position.y,
    80,
    90
  );
  block.render.fillStyle = waterColor;
  block.collisionFilter.mask = bitsets.masks.water;
  return block;
};
