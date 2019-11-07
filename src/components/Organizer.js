import Matter from "matter-js";
import { Beaker, Atom } from "./Shapes";
import { ShapesInfo, BitStorage } from "./Storage";

const Methods = Package => {
  //Concise namings
  const { Na, Cl, NaCl, allP, bkr, sens, wtr, link } = ShapesInfo();
  const bitsets = BitStorage();
  const activeMove = Package.Composite.create();

  const makeSodium = (xPos = 50, yPos = 50) => {
    let temp = Package.Bodies.circle(xPos, yPos, Na.radius, {
      restitution: allP.rest,
      fric: allP.fric,
      label: Na.label,
      render: { fillStyle: Na.color },
      collisionFilter: { group: allP.group }
    });
    return temp; //Could just make 1 return statement, maybe change
  };
  const makeChlorine = (xPos = 50, yPos = 50) => {
    let temp = Package.Bodies.rectangle(xPos, yPos, Cl.width, Cl.height, {
      restitution: allP.rest,
      fric: allP.fric,
      label: Cl.label,
      render: { fillStyle: Cl.color },
      collisionFilter: { group: allP.group }
    });
    return temp;
  };
  const makeSodiumChloride = (xPos = 50, yPos = 50) => {
    let temp = Package.Bodies.polygon(xPos, yPos, NaCl.sides, NaCl.radius, {
      restitution: allP.rest,
      friction: allP.fric,
      label: NaCl.label,
      render: { fillStyle: NaCl.color },
      collisionFilter: { group: allP.group }
    });
    return temp;
  };
  const makeBeaker = (size, xPos = 50, yPos = 50, dry = false) => {
    let { width, height, thick, color } =
      size === "small"
        ? bkr.small
        : size === "medium"
        ? bkr.medium
        : size === "large"
        ? bkr.large
        : null;
    let vectz = [
      { x: 0, y: 0 },
      { x: width + thick * 2, y: 0 },
      { x: width + thick * 2, y: -(height + thick * 2) },
      { x: width + thick, y: -(height + thick * 2) },
      { x: width + thick, y: -thick },
      { x: thick, y: -thick },
      { x: thick, y: -(height + thick * 2) },
      { x: 0, y: -(height + thick * 2) }
    ];
    let tempBkr = Package.Bodies.fromVertices(xPos, yPos, vectz, {
      restitution: bkr.rest,
      density: bkr.density,
      frictionAir: bkr.fricAir,
      collisionFilter: { group: bkr.group, category: bitsets.categories.beaker }
    });
    //Change individual colors of each body part
    tempBkr.parts.map(body => {
      body.render.fillStyle = color;
    });

    let tempSens = makeSensor(width, xPos, yPos);

    //Package.Composite.add(tempBkr, tempSens);

    //tempBkr = Package.Body.create({
    //  parts: [tempSens].concat(tempBkr.parts.slice(1, 4))
    //});

    //Putting water on hold bc it's super buggy and not the main problem
    // const adjust = 18.84; //I have no idea why, but otherwise water won't center with Beaker
    // let tempWtr = Package.Bodies.rectangle(
    //   xPos,
    //   yPos - adjust,
    //   width,
    //   height + thick
    // );
    // tempWtr.render.fillStyle = wtr.color;
    // tempWtr.collisionFilter.mask = bitsets.masks.water;

    return tempBkr;
  };
  const makeSensor = (length, xPos = 50, yPos = 50) => {
    let temp = Package.Bodies.rectangle(xPos, yPos, length, sens.height, {
      isSensor: true,
      frictionAir: sens.fricAir,
      render: { fillStyle: sens.color }
    });
    return temp;
  };
  const moveAndAttachSensor = (beaker, sensor) => {
    const bods = [beaker, sensor],
      bsize = (beaker.bounds.max.x - beaker.bounds.min.x) / 2,
      bthick = beaker.parts[2].bounds.max.y - beaker.parts[2].bounds.min.y,
      yshift = beaker.bounds.min.y - sensor.bounds.min.y;

    Package.Body.translate(sensor, { x: 0, y: yshift });

    const constraintz = [
      Package.Constraint.create({
        bodyA: sensor,
        pointA: { x: -bsize + bthick, y: 0 },
        bodyB: beaker,
        pointB: { x: -bsize + bthick / 2, y: yshift },
        length: link.length,
        stiffness: link.stiff,
        damping: link.damping,
        render: { lineWidth: link.width, anchors: link.anchor }
      }),
      Package.Constraint.create({
        bodyA: sensor,
        pointA: { x: bsize - bthick, y: 0 },
        bodyB: beaker,
        pointB: { x: bsize - bthick / 2, y: yshift },
        length: link.length,
        stiffness: link.stiff,
        damping: link.damping,
        render: { lineWidth: link.width, anchors: link.anchor }
      })
    ];

    return Package.Composite.create({
      bodies: bods,
      constraints: constraintz
    });
  };
  const makeMouseConstraint = mouse => {
    return Package.MouseConstraint.create(Package.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
  };
  function vibrate() {
    let bodies = Package.Composite.allBodies(Package.engine.world);
    for (let i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      if (body.label === "Na" || body.label === "Cl") {
        Package.Body.setVelocity(body, {
          x: Package.Common.choose([1, -1]),
          y: Package.Common.choose([1, -1])
        });
      }
    }
  }
  function suspendHelper(body, sign) {
    let gravity = Package.engine.world.gravity;
    Package.Body.applyForce(body, body.position, {
      x: sign * gravity.x * gravity.scale * body.mass,
      y: sign * gravity.y * gravity.scale * body.mass
    });
  }
  function suspend(body) {
    Package.Body.setStatic(body, false);
    Package.Events.on(Package.engine, "beforeUpdate", function() {
      suspendHelper(body, -1);
    });
  }
  function clearSuspend(body) {
    Package.Events.on(Package.engine, "beforeUpdate", function() {
      suspendHelper(body, 1);
    });
    Package.Body.setStatic(body, true);
  }
  function toggleRotate(body) {
    //Can't do ternary bc 2 steps
    if (body.isStatic) {
      suspend(body);
      Package.Body.setAngularVelocity(body, Math.PI / 144);
    } else {
      clearSuspend(body);
    }
  }
  function addSodium() {
    Package.World.add(Package.engine.world, makeSodium(100, 20));
  }
  function addChlorine() {
    Package.World.add(Package.engine.world, makeChlorine(100, 20));
  }
  function allowNaClReaction() {
    //prettier-ignore
    Package.Events.on(Package.engine, "collisionActive", function(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      const label1 = pair.bodyA.label,
          label2 = pair.bodyB.label;
      if ((label1 === "Na" && label2 === "Cl") || (label1 === "Cl" && label2 === "Na")) {
          Package.World.add(Package.engine.world, makeSodiumChloride(pair.bodyA.position.x, pair.bodyA.position.y));
          Package.World.remove(Package.engine.world, [pair.bodyA, pair.bodyB]);
      }
    }
  });
  }

  return {
    makeSodium,
    makeChlorine,
    makeSodiumChloride,
    makeBeaker,
    makeSensor,
    moveAndAttachSensor,
    makeMouseConstraint,

    vibrate,
    suspend,
    clearSuspend,
    toggleRotate,
    addSodium,
    addChlorine,

    allowNaClReaction
  };
};
export default Methods;
