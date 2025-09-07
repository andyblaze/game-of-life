import { mt_rand } from "./functions.js";
import Archetypes from "./archetypes.js";

export default class Item {
    constructor(config, type, typeIndex) {
        this.global = config.global(); 
        this.initPosition();
        this.initProperties(type);
        this.cfg = config.data.types[typeIndex];
    }
    initProperties(type) {
        this.archetype = Archetypes.get(type.name);
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