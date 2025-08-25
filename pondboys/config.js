import { mt_rand } from "./functions.js";

const config = {
  global: {
    width: window.innerWidth,   // canvas width
    height: window.innerHeight, // canvas height
    framesPerTick: 1,          // update frequency (higher = slower updates, lower CPU)
    numCritters:80,
    predatorPercentage: 0.05,
    numFood:350,
    foodEnergy:10
  },
  predator: {   energyCap: 250, reproductionCost: 180, 
                reproductionThreshold: 200, movementCost:0.04,
                speedEnergyCost:0.006, spawnChance: 0.999,
                maxRadius:10, maxSpeed:3.5, minSpeed:1.5,
                lifespan:{min:1, max:2} // minutes
            },
  prey:     {   energyCap: 150, reproductionCost: 50, 
                reproductionThreshold: 90, movementCost:0.025,
                speedEnergyCost:0.002, spawnChance:0.9,
                maxRadius:10, maxSpeed:2.5, minSpeed:1,
                lifespan:{min:1, max:1.5}
            }
};

export default config;