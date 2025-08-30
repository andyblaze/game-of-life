import { clamp, mt_rand } from "./functions.js";
import CritterArchetypes from "./critter-archetypes.js";

export default class Critter {
    constructor(config, type, newDNA=false) {
        this.global = config.global(); 
        this.dna = (newDNA === false ? config.getRandom(type) : newDNA);
        this.initPosition(this.dna.maxSpeed);
        this.initProperties(this.dna);
    }
    isPredator() {
        return (this.dna.type === "Predator");
    }
    isPrey() {
        return (this.dna.type === "Prey");
    }
    initProperties(dna) {
        this.archetype = CritterArchetypes.get(this.dna.type);
        this.id = Math.random();
        this.age = 0;
        this.lifespan = mt_rand(dna.minLifespan * 3600, dna.maxLifespan * 3600);
        this.energy = dna.energyCap / 2; // start at half cap
        this.color = dna.color;
    }
    initPosition(maxSpeed) {
        this.x = mt_rand(0, this.global.width);
        this.y = mt_rand(0, this.global.height);
        this.vx = (Math.random() - 0.5) * maxSpeed;
        this.vy = (Math.random() - 0.5) * maxSpeed;
        this.radius = 4;
    }
    eat(foodEnergy) {
        // Scale energy gain by age fraction (older = weaker digestion)
        const ageFactor = 1 - (this.age / this.lifespan); 
        const gained = foodEnergy * Math.max(0.2, ageFactor); 
        this.energy = clamp(this.energy + gained, 0, this.dna.energyCap);
    }
    update() {
        this.archetype.update(this);
        this.archetype.move(this);
        this.archetype.propel(this);
    }
    canSpawn() {
        let chance = Math.random() > this.dna.spawnChance; 
        return (chance && this.energy >= this.dna.reproductionThreshold && this.radius === this.dna.maxRadius);
    }
    draw(ctx) {
        this.archetype.draw(ctx, this);   
    }
}