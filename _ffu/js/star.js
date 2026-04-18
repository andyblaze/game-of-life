// ----------------------------
// STAR SYSTEMS
// ----------------------------
import Planet from "./planet.js";
import { randomFrom, mt_rand, HSLAString, lerpHSLAColor } from "./functions.js";

export default class Star {
    constructor(cfg, noise) {
        this.cfg = cfg;
        this.simplex = noise;
        this.color = randomFrom(cfg.starColors);
        this.planets = [];
        this.hasPlanets = true;
        this.setPlanets(cfg);
        const zindex = mt_rand(0, cfg.DEPTH_SPREAD);
        this.setPosition(zindex);
        this.r = mt_rand(2, 5);
        // ----------------------------
        // BLOBS
        // ----------------------------
        this.time = Math.random() * 1000;

        this.blobs = [];
        const blobCount = mt_rand(2, 3);

        for (let i = 0; i < blobCount; i++) {
            this.blobs.push({
                seed: Math.random() * 1000,
                angle: Math.random() * Math.PI * 2,
                dist: Math.random() * 0.6,
                size: mt_rand(4, 8),
                strength: 0.1 + Math.random() * 0.92
            });
        }
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
        const baseColor = HSLAString(this.color);

        // ----------------------------
        // STAR GLOW (key addition)
        // ----------------------------
        ctx.save();

        //ctx.shadowBlur = 12 * p.scale;
        //ctx.shadowColor = baseColor;

// clip to star
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.clip();

    // base fill
    ctx.fillStyle = baseColor;
    ctx.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);

    // ----------------------------
    // BLOBS (boiling effect)
    // ----------------------------
    for (let b of this.blobs) {
        const bx = p.x + Math.cos(b.angle) * radius * b.dist;
        const by = p.y + Math.sin(b.angle) * radius * b.dist;
        const br = radius * b.size;

        // HSLA tint (same hue, darker/lighter)
        const c = {
            h: this.color.h,
            s: this.color.s - 40,
            l: this.color.l - 40 * b.strength,
            a: 0.45
        };

        ctx.fillStyle = HSLAString(c);

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

        /*ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();*/
        if ( this.hasPlanets ) {
            for (let pl of this.planets) {
                pl.render(ctx, p);
            }
        }
    }
    update() {
        this.time += 0.005;

        // animate blobs
        for (let b of this.blobs) {
            const n = this.simplex.noise(
                this.time * 0.5,
                b.seed
            );

            b.angle += n * 0.05;              // slow drift
            b.dist += n * 0.01;              // slight wobble
            b.dist = Math.max(0, Math.min(1, b.dist));
        }
        if ( this.hasPlanets ) {   // planets always orbit
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