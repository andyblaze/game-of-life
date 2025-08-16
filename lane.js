import Drop from "./drop.js";
import { Point, mt_rand, getRandomChars, getRandomChar } from "./functions.js";

export default class Lane {
    constructor(x, cfg) {
        this.x = x;
        this.charHeight = cfg.charHeight;
        this.drops = [];
        this.mainDrops = [];
        this.cfg = cfg;
    }
    spawnDrop() {
        
        if ( this.mainDrops.length === 0 ) { 
            const { min, max } = this.cfg.dropLengths;
            const length = mt_rand(min, max);
            const chars = getRandomChars(length);
            const speed = mt_rand(this.cfg.speed.min, this.cfg.speed.max) / 10;
            const point = Point(this.x, -length * this.charHeight);
            this.mainDrops.push(new Drop(chars, point, speed, this.cfg));
        }
    }
    update(canSpawn) {
        this.mainDrops.forEach(drop => {
            drop.update();
        });

        // Remove finished drops
        this.mainDrops = this.mainDrops.filter(drop => ! drop.isOffscreen());

        // Randomly spawn new drop
        if (canSpawn && Math.random() < this.cfg.mainSpawnChance) {
            this.spawnDrop();
        }
        this.drops = this.mainDrops;
    }
    hasDrops() {
        return this.mainDrops.length > 0;
    }
}
