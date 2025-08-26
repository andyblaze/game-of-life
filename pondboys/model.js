import Critter from "./critter.js";
import { clamp, distance } from "./functions.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.critters = [];
        this.food = [];
        this.initCritters(cfg);
        this.spawnFood(this.global.numFood);
    }
    initCritters(cfg) {
        for (let i = 0; i < this.global.numCritters; i++) { 
            const type = Math.random() < this.global.predatorPercentage ? "predator" : "prey";
            this.critters.push(new Critter(cfg, type));
        }
    }
    handlePredation(a, b) {
        if ( a.type === "predator" && b.type === "prey") {
            const stolen = Math.min(b.energy * 0.3, 2);
            a.energy = clamp(a.energy + stolen, 0, a.dna.energyCap);
            b.energy = clamp(b.energy - stolen, 0, b.dna.energyCap);
        }
        if ( b.type === "predator" && a.type === "prey" ) {
            const stolen = Math.min(a.energy * 0.3, 2);
            b.energy = clamp(b.energy + stolen, 0, b.dna.energyCap);
            a.energy = clamp(a.energy - stolen, 0, a.dna.energyCap);
        }
    }
    handleCollisions() {
        // Soft collision: simple repulsion
        for (let i = 0; i < this.critters.length; i++) {
            for (let j = i + 1; j < this.critters.length; j++) {
                const a = this.critters[i];
                const b = this.critters[j];
                const { dx, dy, dist } = distance(a, b);
                const minDist = a.radius + b.radius;

                if (dist < minDist && dist > 0) {
                    // push each away proportionally
                    const overlap = (minDist - dist) / 2;
                    const nx = (dx / dist) * overlap;
                    const ny = (dy / dist) * overlap;

                    a.x -= nx;
                    a.y -= ny;
                    b.x += nx;
                    b.y += ny;

                    // small random nudge
                    const nudge = 0.2;
                    a.vx += (Math.random() - 0.5) * nudge;
                    a.vy += (Math.random() - 0.5) * nudge;
                    b.vx += (Math.random() - 0.5) * nudge;
                    b.vy += (Math.random() - 0.5) * nudge;
                    
                    this.handlePredation(a, b);
                }
            }
        }
    }
    handleFood() {
        for (let i = this.critters.length - 1; i >= 0; i--) {
            const c = this.critters[i];
            if (c.type === 'predator') continue;
            for (let j = this.food.length - 1; j >= 0; j--) {
                const f = this.food[j];
                const { dist } = distance(c, f);
                if (dist < c.radius + f.radius) {
                    // eat food
                    c.eat(this.global.foodEnergy);
                    this.food.splice(j, 1);
                    // optional: spawn a new food somewhere
                    this.spawnFood();
                }
            }
        }
    }
    spawnFood(n=1) {
        for (let i = 0; i < n; i++) {
            this.food.push({
                x: Math.random() * this.global.width,
                y: Math.random() * this.global.height,
                radius: 3,
                color: "hsla(280,80%,70%,0.6)"
            });
        }
    }
    handleDeath() {
        this.critters = this.critters.filter(c => c.energy > 0);
    } 
    handleReproduction() {
        if ( this.critters.length > 300 ) return;
        const newCritters = [];
        this.critters.forEach(c => {
            if ( c.canSpawn() ) {
                const baby = c.spawn(this.cfg, c.type);
                newCritters.push(baby);
            }
        });
        this.critters.push(...newCritters);
    }    
    tick() {
        this.handleDeath();
        this.critters.forEach(c => c.update());
        this.handleCollisions();
        this.handleFood();
        this.handleReproduction();
        return {"critters":this.critters, "food":this.food};
    }
}