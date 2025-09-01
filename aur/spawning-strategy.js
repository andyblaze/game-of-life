import Aurora from "./aurora.js";
import { clamp } from "./functions.js";

class AuroraSpawn {
    spawn(aurora, config) {
        const a = aurora;        
        const baby = new Aurora(config);
        // do stuff here
        return baby;
    }
}
export class Type1Spawn extends AuroraSpawn {}
export class Type2Spawn extends AuroraSpawn {}
export class Type3Spawn extends AuroraSpawn {}
