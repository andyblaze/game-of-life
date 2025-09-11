import Perlin from "./perlin-noise.js";
import Voronoi from "./voronoi.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.sites = [];
        this.init(this.global);
    }
    init(global) {
        for ( let i = 0; i < global.numSites; i++ ) {
            this.sites.push({
                x:Math.random() * global.width,
                y:Math.random() * global.height, 
                nx:Math.random() * global.noiseSeedRange, 
                ny:Math.random() * global.noiseSeedRange
            });
        }
    }  
    tick() {
        this.sites.forEach(s => s.update());
        return this.sites;
    }
}