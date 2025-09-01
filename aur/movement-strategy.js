import { clamp } from "./functions.js";

class AuroraMovement {
    wraparoundEdges(a) {
        //if (a.x < -c.radius) c.x += c.global.width + c.radius * 2;
        if (a.x > a.global.width) a.x -= a.global.width;

    }
    move(aurora) {
        const a = aurora;
        a.x += a.vx;
        a.y += a.vy;
        
        this.wraparoundEdges(a);

    }
}
export class Type1Movement extends AuroraMovement {}
export class Type2Movement extends AuroraMovement {}
export class Type3Movement extends AuroraMovement {}
