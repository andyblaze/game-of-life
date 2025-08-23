const config = {
  width: window.innerWidth,   // canvas width
  height: window.innerHeight, // canvas height
  framesPerTick: 1,          // update frequency (higher = slower updates, lower CPU)
  numCritters:50,
  maxSpeed:1.5,
  maxRadius:10,
  numFood:30,
  predator: { energyCap: 200, reproductionCost: 80, reproductionThreshold: 200 },
  prey:     { energyCap: 150, reproductionCost: 50, reproductionThreshold: 150 },
  reproductionThreshold: 200,
  reproductionCost: 80   // energy parent gives to offspring
};
export default config;