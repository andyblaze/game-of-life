import Plant from "./plant.js";
import { clamp } from "./functions.js";

class PlantSpawn {
    spawn(plant, config) {
        const p = plant;        
        const baby = new Plant(config);
        // do stuff here
        return baby;
    }
}
export class Type1Spawn extends PlantSpawn {}
export class Type2Spawn extends PlantSpawn {}
export class Type3Spawn extends PlantSpawn {}
