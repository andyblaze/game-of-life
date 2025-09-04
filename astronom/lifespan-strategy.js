import { lerpColor } from "./functions.js";

class PlantLifespan {
    update(aurora) {
        const a =  aurora;
        a.age++;
        if (a.age >= a.lifespan) {
            // if we're doing age related stuff
        }
        else {
            // do other stuff
        }
    }
}
export class Type1Lifespan extends PlantLifespan {}
export class Type2Lifespan extends PlantLifespan {}
export class Type3Lifespan extends PlantLifespan {}

