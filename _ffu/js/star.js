// ----------------------------
// STAR SYSTEMS
// ----------------------------
import Planet from "./planet.js";
import { randomFrom, mt_rand, HSLAString, lerpHSLAColor } from "./functions.js";

export default class Star {
    constructor(cfg) {
        this.cfg = cfg;
        this.color = randomFrom(cfg.starColors);
this.targetColor = { ...this.color };
this.baseColor = { ...this.color };
this.currentColor = { ...this.color };
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
updateColor() {
    const drift = 0.03; // slow evolution speed

    // gently nudge target toward base + noise
    this.targetColor.h = this.baseColor.h + (Math.random() - 0.5) * 10;
    this.targetColor.s = this.baseColor.s + (Math.random() - 0.5) * 5;
    this.targetColor.l = this.baseColor.l + (Math.random() - 0.5) * 5;

    // smooth current → target
    this.currentColor = lerpHSLAColor(
        this.currentColor,
        this.targetColor,
        drift
    );
}
    render(ctx, p) {
        const radius = this.r * p.scale;
        //const color = HSLAString(this.color);
        const color = HSLAString(this.currentColor);
        // ----------------------------
        // STAR GLOW (key addition)
        // ----------------------------
        ctx.save();

        ctx.shadowBlur = 12 * p.scale;
        ctx.shadowColor = color;

        ctx.fillStyle = color;

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
        this.updateColor();
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