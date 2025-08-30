import Critter from "./critter.js";
import { clamp } from "./functions.js";

class CritterSpawn {
    mutateDNA(parentDNA, mutationRate, mutationStrength) {
        const childDNA = { ...parentDNA };
        for (let key in childDNA) {
            if (typeof childDNA[key] === "number" && Math.random() < mutationRate) {
                const factor = 1 + (Math.random() * 2 - 1) * mutationStrength;
                childDNA[key] *= factor;
            }
        }
        return childDNA;
    }
    spawn(critter, config) {
        const c = critter;
        // Apply mutation
        const mutationRate = 0.3;   // % chance a given trait mutates
        const mutationStrength = 0.6; // % variation
        const babyDNA = this.mutateDNA(c.dna, mutationRate, mutationStrength);
        
        const baby = new Critter(config, babyDNA.type, babyDNA);
        baby.x = c.x + (Math.random() - 0.5) * 10;
        baby.y = c.y + (Math.random() - 0.5) * 10;
        baby.energy = c.dna.reproductionCost;
        // Parent pays the cost
        c.energy = clamp(c.energy - c.dna.reproductionCost, 0, c.dna.energyCap);
        c.radius = 4;
        return baby;
    }
}
export class PreySpawn extends CritterSpawn {}
export class VampireSpawn extends CritterSpawn {}
export class BasherSpawn extends CritterSpawn {}
