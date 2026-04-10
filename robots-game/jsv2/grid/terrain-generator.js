import { randomBetween } from "../functions.js";

export default class TerrainGenerator {
    constructor(grid, cfg) {
        this.terrains = cfg.terrain;
        this.grid = grid;
        this.width = cfg.width;
        this.height = cfg.height;
        this.terrain = [];
    }
    generate() {
        this.terrains.forEach(cfg => {
            const count = cfg.min + Math.floor(Math.random() * (cfg.max - cfg.min + 1));
            let attempts = 0;
            let placed = 0;
            while( placed < count && attempts < 50 ) {
                attempts++;
                const r = randomBetween(cfg.radius);
                const x = r + Math.random() * (this.width - 2 * r);
                const y = r + Math.random() * (this.height - 2 * r);
                if( this.grid.isFreeAt(x, y, r) ) {
                    this.terrain.push({type:cfg.type, x, y, r, color:cfg.color});
                    this.grid.occupy(x, y, r, cfg.type);
                    placed++;
                }
            }
        });
        return this.terrain;
    }
}
