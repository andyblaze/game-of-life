import Drop from "./drop.js";
import { Point, mt_rand, getRandomChars, getRandomChar } from "./functions.js";

export default class Lane {
    constructor(x, cfg) {
        this.x = x;
        this.charHeight = cfg.charHeight;
        this.drops = [];
        this.mainDrops = [];
        this.ghostDrops = [];
        this.cfg = cfg;
    }
    getChars(cfg) {
        const { min, max } = cfg.dropLengths;
        const length = mt_rand(min, max);
        return getRandomChars(cfg.charPool, length);
    }
    spawnMain() {        
        if ( this.mainDrops.length === 0 ) { 
            const chars = this.getChars(this.cfg.main);
            const point = Point(this.x, -chars.length * this.charHeight);
            this.mainDrops.push(new Drop(chars, point, this.cfg.main));
        }
    }
    spawnGhost() { //return;
        if ( this.ghostDrops.length < this.cfg.ghostsPerLane ) {
            const chars = this.getChars(this.cfg.ghost);
            const point = Point(this.x, -chars.length * this.charHeight);
            this.ghostDrops.push(new Drop(chars, point, this.cfg.ghost));
        }
    }
    update(canSpawn) { //console.log(canSpawn);
        this.mainDrops.forEach(drop => {
            drop.update();
        });
        this.ghostDrops.forEach(drop => {
            drop.update();
        });

        // Remove finished drops
        this.mainDrops = this.mainDrops.filter(drop => ! drop.isOffscreen());
        this.ghostDrops = this.ghostDrops.filter(drop => ! drop.isOffscreen());

        // Randomly spawn new main drop
        if (canSpawn === true && Math.random() < this.cfg.mainSpawnChance) {
            this.spawnMain();
        }
        
        if ( Math.random() < this.cfg.ghostSpawnChance )
            this.spawnGhost();
        
        this.drops = this.mainDrops.concat(this.ghostDrops);
    }
    hasDrops() {
        return this.mainDrops.length > 0;
    }
}
