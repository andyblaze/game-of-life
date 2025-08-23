const config = {
  width: window.innerWidth,   // canvas width
  height: window.innerHeight, // canvas height
  framesPerTick: 1,          // update frequency (higher = slower updates, lower CPU)
  numCritters:80,
  predatorPercentage: 0.05,
  maxSpeed:2.5,
  minSpeed:1,
  maxRadius:10,
  numFood:380,
  foodEnergy:5,
  predator: { energyCap: 250, reproductionCost: 180, reproductionThreshold: 200, movementCost:0.04 },
  prey:     { energyCap: 150, reproductionCost: 50, reproductionThreshold: 50, movementCost:0.025 },
  reproductionThreshold: 200
};
export default config;