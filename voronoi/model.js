import Voronoi from "./voronoi.js";
import Perlin from "./perlin-noise.js";

export default class Model {
    constructor(cfg) {
        this.global = cfg.global();
        this.cfg = cfg;
        this.perlin = new Perlin();
        this.voronoi = new Voronoi(this.global.width, this.global.height);
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
    move(global) {
        this.sites.forEach(s=>{
            s.nx+= 0.0002; 
            s.ny+= 0.0002;
            s.x = (this.perlin.noise(s.nx, 0) + 1) * 0.5 * global.width;
            s.y = (this.perlin.noise(0, s.ny) + 1) * 0.5 * global.height;
        });
    }
    tick(timestamp) {
        this.move(this.global);
        const cells = this.voronoi.update(this.sites);
        return { "cells": cells, "sites": this.sites, "timestamp": timestamp };
    }
}