import Critter from "./critter.js";
import FoodHandler from "./food-handler.js";
import { distance } from "./functions.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.critters = [];
        this.initCritters(cfg);
        this.foodHandler = new FoodHandler(this.global);
        this.foodHandler.spawnFood(this.global.numFood);
    }
    initCritters(cfg) {
        for (let i = 0; i < this.global.numCritters; i++) { 
            const type = Math.random() < this.global.predatorPercentage ? "predator" : "prey";
            this.critters.push(new Critter(cfg, type));
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
                    
                    this.resolveInteraction(a, b);
                }
            }
        }
    }
    resolveInteraction(a, b) {
        a.archetype.interact(a, b);
        b.archetype.interact(b, a); // optional if prey reacts
    }
    handleDeath() {
        this.critters = this.critters.filter(c => c.energy > 0);
    } 
    handleReproduction() {
        if ( this.critters.length > 300 ) return;
        const newCritters = [];
        this.critters.forEach(c => {
            if ( c.canSpawn() ) {
                const baby = c.archetype.spawn(c, this.cfg);
                newCritters.push(baby);
            }
        });
        this.critters.push(...newCritters);
    }    
    tick() {
        this.handleDeath();
        this.critters.forEach(c => c.update());
        this.handleCollisions();
        const food = this.foodHandler.update(this.critters);
        this.handleReproduction();
        return {"critters":this.critters, "food":food};
    }
}