import { mt_rand } from "./functions.js";

const config = {
  width: window.innerWidth,   // canvas width
  height: window.innerHeight, // canvas height
  framesPerTick: 1,          // update frequency (higher = slower updates, lower CPU)
  numCritters:80,
  predatorPercentage: 0.05,
  numFood:480,
  foodEnergy:6,
  predator: {   energyCap: 250, reproductionCost: 180, 
                reproductionThreshold: 200, movementCost:0.04,
                speedEnergyCost:0.003, spawnChance: 0.999,
                maxRadius:10, maxSpeed:2.5, minSpeed:1,
                lifespan:mt_rand(5000, 12000)
            },
  prey:     {   energyCap: 150, reproductionCost: 50, 
                reproductionThreshold: 50, movementCost:0.025,
                speedEnergyCost:0.002, spawnChance:0.999,
                maxRadius:10, maxSpeed:2.5, minSpeed:1,
                lifespan:mt_rand(2000, 9000)
            },
  reproductionThreshold: 200
};
export default config;