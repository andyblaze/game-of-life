import { mt_rand } from "./functions.js";

export default class Config {
    static item(key) {
        return Config.data[key];
    }
    static global(key="") {
        return (key === "" ? Config.data.global : Config.data.global[key]);
    }
    static getRandom(type) {
        const idx = mt_rand(0, this.data[type].length - 1);
        return this.data[type][idx];
    }
    static data = {
        global: {
            width: window.innerWidth,   // canvas width
            height: window.innerHeight, // canvas height
            framesPerTick: 1,          // update frequency (higher = slower updates, lower CPU)
            numCritters:80,
            predatorPercentage: 0.05,
            numFood:350,
            foodEnergy:10,
            isStationary:0.6,
            propulsionKick:0.5
        },
        predator: [
            { energyCap: 250, reproductionCost: 180, 
                reproductionThreshold: 200, movementCost:0.04,
                speedEnergyCost:0.006, spawnChance: 0.999,
                maxRadius:30, maxSpeed:3.5, minSpeed:1.5,
                minLifespan:1, maxLifespan:1.5, // minutes
                propulsionThreshold:100, propulsionCost:20,
                color:[230, 25, 25, 0.5], type:"Predator",
                name:"Vampire", dragCoefficient:0.0006
            },
            { energyCap: 250, reproductionCost: 180, 
                reproductionThreshold: 200, movementCost:0.04,
                speedEnergyCost:0.006, spawnChance: 0.999,
                maxRadius:30, maxSpeed:3.5, minSpeed:1.5,
                minLifespan:1, maxLifespan:1.5, // minutes
                propulsionThreshold:100, propulsionCost:20,
                color:[230, 25, 255, 0.5], type:"Predator",
                name:"Basher", dragCoefficient:0.0006
            }
        ],
        prey: [ 
            { energyCap: 150, reproductionCost: 50, 
                reproductionThreshold: 90, movementCost:0.025,
                speedEnergyCost:0.002, spawnChance:0.999,
                maxRadius:20, maxSpeed:2.5, minSpeed:1,
                minLifespan:1, maxLifespan:1.5, // minutes
                propulsionThreshold:80, propulsionCost:10,
                color:[46, 178, 178, 0.5], type:"Prey",
                name:"Prey", dragCoefficient:0.0006
            },
            { energyCap: 150, reproductionCost: 50, 
                reproductionThreshold: 90, movementCost:0.025,
                speedEnergyCost:0.002, spawnChance:0.999,
                maxRadius:20, maxSpeed:2.5, minSpeed:1,
                minLifespan:1, maxLifespan:1.5, // minutes
                propulsionThreshold:80, propulsionCost:10,
                color:[46, 18, 178, 0.5], type:"Prey",
                name:"Prey", dragCoefficient:0.0006
            }
        ]
    }
}