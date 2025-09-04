import { clamp, mt_rand } from "./functions.js";
import PlantArchetypes from "./plant-archetypes.js";

export default class Plant {
    constructor(config, type) {
        this.global = config.global(); 
        this.initPosition();
        this.initProperties(type);
        this.cfg = config;
    }
    initProperties(type) {
        this.archetype = PlantArchetypes.get(type.name);
        this.color = type.color;
    }
    initPosition() {
        this.x = mt_rand(0, this.global.width);
        this.y = mt_rand(0, this.global.height);
    }
    update() {
        this.archetype.update(this);
        this.archetype.move(this);
        this.archetype.propel(this);
    }
    draw(ctx) {
        this.archetype.draw(ctx, this);   
    }
}