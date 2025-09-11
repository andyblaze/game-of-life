import { clamp } from "./functions.js";
import Perlin from "./perlin-noise.js";

export default class VoronoiMovement {
    constructor() {
        this.perlin = new Perlin();
    }
    move(sites) {
        sites.forEach(s=>{
            s.nx+= 0.002; 
            s.ny+= 0.002;
            s.x = (this.perlin.noise(s.nx, 0) + 1) * 0.5 * width;
            s.y = (this.perlin.noise(0, s.ny) + 1) * 0.5 * height;
        });
    }
}
/*export class Type1Movement extends AuroraMovement {}
export class Type2Movement extends AuroraMovement {}
export class Type3Movement extends AuroraMovement {}*/
