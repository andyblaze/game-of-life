// ----------------------------
// STAR SYSTEMS
// ----------------------------
import Planet from "./planet.js";
import { randomFrom, mt_rand } from "./functions.js";

export default class Star {
    constructor(cfg) {
        this.cfg = cfg;
        this.color = randomFrom(cfg.starColors);
        this.planets = [];
        this.hasPlanets = true;
        this.setPlanets(cfg);
        const zindex = mt_rand(0, cfg.DEPTH_SPREAD);
        this.setPosition(zindex);
        this.r = mt_rand(2, 5);
    }
    setPosition(zindex) {
        this.x = (Math.random() - 0.5) * this.cfg.width;
        this.y = (Math.random() - 0.5) * this.cfg.height;
        this.z = zindex;    
    }
    setPlanets(cfg) {
        this.planets = [];
        this.hasPlanets = Math.random() < 0.6;        
        if ( this.hasPlanets ) {
            const n = mt_rand(1, 5);
            for ( let i = 0; i < n; i++ ) {
                this.planets.push(new Planet(cfg));
            }
        }
    }
    render(ctx, p) {
        const radius = this.r * p.scale;

        // ----------------------------
        // STAR GLOW (key addition)
        // ----------------------------
        ctx.save();

        ctx.shadowBlur = 12 * p.scale;
        ctx.shadowColor = this.color;

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        if ( this.hasPlanets ) {
            for (let pl of this.planets) {
                pl.render(ctx, p);
            }
        }
    }
    update() {  // planets always orbit
        if ( this.hasPlanets ) {
            for (let p of this.planets) 
                p.update();   
        }
    }
    // ----------------------------
    // RECYCLING (behind ship → ahead)
    // ----------------------------
    recycle(zindex) {
        this.setPlanets(this.cfg);
        this.setPosition(zindex);
    }
}