import React from "react";
import Matter from "matter-js";
import Methods from "./Organizer";

window.decomp = require("poly-decomp");

const Laboratory = () => {
  //module aliases
  let Engine = Matter.Engine,
    World = Matter.World,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Constraint = Matter.Constraint;
  //Sleeping = Matter.Sleeping;

  //create an engine
  let engine = Engine.create();
  engine.world.gravity.y = 0.3;
  engine.timing.timeScale = 1;

  //prettier-ignore
  const Package = {Engine, World, Render, Bodies, Body, MouseConstraint, Mouse, Events, Composite, Common, Constraint, engine}

  //Must pass Common to have unique sequential IDs
  const Functions = Methods(Package);

  let ground1 = Bodies.rectangle(400, 720, 810, 60);
  Body.setStatic(ground1, true);

  let base1 = Functions.makeBeaker("large", 100, 200);
  let sens1 = Functions.makeSensor(120, 100, 200);

  Body.setStatic(base1, true);

  let beaker1 = Functions.moveAndAttachSensor(base1, sens1);

  //prettier-ignore
  let allBodies = [ground1, beaker1];

  Functions.allowNaClReaction();

  //create a renderer
  let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 800,
      wireframes: false,
      background: "#D1B4F3"
    }
  });

  //add all of the bodies to the world
  World.add(engine.world, allBodies);

  //run the engine
  Engine.run(engine);

  //run the renderer
  Render.run(render);

  // add mouse control
  let mouse = Mouse.create(render.canvas),
    mouseConstraint = Functions.makeMouseConstraint(mouse);

  World.add(engine.world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  function vibrate() {
    let bodies = Composite.allBodies(engine.world);
    for (let i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      if (body.label === "Na" || body.label === "Cl") {
        let forceMagnitude = 0.005 * body.mass;
        Body.setVelocity(body, {
          x: Common.choose([1, -1]),
          y: Common.choose([1, -1])
        });
      }
    }
  }

  return (
    <div>
      <button onClick={() => Functions.toggleRotate(base1)}>
        toggleRotate
      </button>
      <button onClick={() => Functions.addSodium()}>addSodium</button>
      <button onClick={() => Functions.addChlorine()}>addChlorine</button>
      <button onClick={() => Functions.vibrate()}>shake</button>
    </div>
  );
};

export default Laboratory;
