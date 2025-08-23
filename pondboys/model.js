import Critter from "./critter.js";
import { clamp } from "./functions.js";

export default class Model {
    constructor(cfg) {
        this.cfg = cfg;
        this.critters = [];
        this.food = [];
        this.initCritters(cfg);
        this.spawnFood(cfg.numFood);
    }
    initCritters(cfg) {
        for (let i = 0; i < cfg.numCritters; i++) {
            const type = Math.random() < cfg.predatorPercentage ? 'predator' : 'prey';
            this.critters.push(new Critter(cfg, type));
        }
    }
    handlePredation(a, b) {
        if ( a.type === "predator" && b.type === "prey") {
            const stolen = Math.min(b.energy * 0.3, 2);
            a.energy = clamp(a.energy + stolen, 0, a.energyCap);
            b.energy = clamp(b.energy - stolen, 0, b.energyCap);
        }
        if ( b.type === "predator" && a.type === "prey" ) {
            const stolen = Math.min(a.energy * 0.3, 2);
            b.energy = clamp(b.energy + stolen, 0, b.energyCap);
            a.energy = clamp(a.energy - stolen, 0, a.energyCap);
        }
    }
    handleCollisions() {
        // Soft collision: simple repulsion
        for (let i = 0; i < this.critters.length; i++) {
            for (let j = i + 1; j < this.critters.length; j++) {
                const a = this.critters[i];
                const b = this.critters[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = a.r + b.r;

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
                const dx = c.x - f.x;
                const dy = c.y - f.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < c.r + f.r) {
                    // eat food
                    c.energy = clamp(c.energy + this.cfg.foodEnergy, 0, c.energyCap);
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
                x: Math.random() * this.cfg.width,
                y: Math.random() * this.cfg.height,
                r: 3,
                color: "limegreen"
            });
        }
    }
    handleDeath() {
        this.critters = this.critters.filter(c => c.energy > 0);
    } 
    handleReproduction() {
        const newCritters = [];

        this.critters.forEach(c => {
            if (c.energy >= c.typeCfg.reproductionThreshold) {
                // create offspring
                const baby = new Critter(this.cfg, c.type);
                // optionally mutate traits here
                baby.x = c.x + (Math.random() - 0.5) * 10;
                baby.y = c.y + (Math.random() - 0.5) * 10;
                baby.energy = c.typeCfg.reproductionCost;
                this.critters.push(baby);
                c.energy = clamp(c.energy - c.typeCfg.reproductionCost, 0, c.energyCap);
            }
        });

        // add offspring to population
        this.critters.push(...newCritters);
    }    
    tick() {
        this.handleDeath();
        this.critters.forEach(c => c.move());
        this.handleCollisions();
        this.handleFood();
        this.handleReproduction();
        return {"critters":this.critters, "food":this.food};
    }
}