//In a different function for visual bitset comparisons
export const BitStorage = () => {
  const categories = {
    //circle:    0B00000000000000000000000000000001, //0x0001
    //square:    0B00000000000000000000000000000010, //0x0002
    //triangle:  0B00000000000000000000000000000100  //0x0004
    beaker: 0b11110000000000000000000000000001
  };
  const masks = {
    water: 0b11110000000000000000000000000000
  };

  return { masks, categories };
};

export const ShapesInfo = () => {
  const Na = {
    radius: 4,
    label: "Na",
    color: "#BF0101"
  };
  const Cl = {
    width: 10,
    height: 6,
    label: "Cl",
    color: "#AE684A"
  };
  const NaCl = {
    sides: 3,
    radius: 6,
    label: "NaCl",
    color: "#A9F645"
  };
  const allP = {
    rest: 0.3,
    fric: 0,
    group: 0
  };
  const bkr = {
    small: {
      width: 80,
      height: 80,
      thick: 5,
      color: "#8C8181"
    },
    medium: {
      width: 100,
      height: 100,
      thick: 5,
      color: "#6A6363"
    },
    large: {
      width: 120,
      height: 120,
      thick: 5,
      color: "#272525"
    },
    rest: 0.1,
    density: 0.1,
    fricAir: 0,
    group: 1
  };
  const sens = {
    height: 2,
    fricAir: 0,
    color: "#01FE2B"
  };
  const wtr = {
    color: "#01B2FE"
  };
  const link = {
    length: 1,
    stiff: 0.1,
    damping: 0.1,
    width: 0,
    anchor: false
  };

  return { Na, Cl, NaCl, allP, bkr, sens, wtr, link };
};
