import { clamp } from "./functions.js";

class CritterMovement {
    wraparoundEdges(c) {
        if (c.x < -c.radius) c.x += c.global.width + c.radius * 2;
        if (c.x > c.global.width + c.radius) c.x -= c.global.width + c.radius * 2;
        if (c.y < -c.radius) c.y += c.global.height + c.radius * 2;
        if (c.y > c.global.height + c.radius) c.y -= c.global.height + c.radius * 2;
    }
    move(critter) {
        const c = critter;
        c.x += c.vx;
        c.y += c.vy;
        
        this.wraparoundEdges(c);

       // --- APPLY DRAG ---
        c.vx -= c.vx * Math.abs(c.vx) * c.dna.dragCoefficient;
        c.vy -= c.vy * Math.abs(c.vy) * c.dna.dragCoefficient;
        // if velocity is tiny, stop completely (avoid endless drifting)
        if (Math.abs(c.vx) < 0.001) c.vx = 0;
        if (Math.abs(c.vy) < 0.001) c.vy = 0;
        // ------------------  
        
        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
        // energy cost proportional to speed
        const lostEnergy = c.dna.movementCost + speed * speed * c.dna.speedEnergyCost; // quadratic
        c.energy = clamp(c.energy - lostEnergy, 0, c.dna.energyCap);
    }
}
export class PreyMovement extends CritterMovement {}
export class VampireMovement extends CritterMovement {}
export class BasherMovement extends CritterMovement {}
