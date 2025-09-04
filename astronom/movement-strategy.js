import { clamp } from "./functions.js";

class PlantMovement {
    wraparoundEdges(p) {
        //if (a.x < -c.radius) c.x += c.global.width + c.radius * 2;
        if (p.x > p.global.width) p.x -= p.global.width;

    }
    move(plant) {
        const p = plant;
        p.x += p.vx;
        p.y += p.vy;
        
        this.wraparoundEdges(p);

    }
}
export class Type1Movement extends PlantMovement {}
export class Type2Movement extends PlantMovement {}
export class Type3Movement extends PlantMovement {}
