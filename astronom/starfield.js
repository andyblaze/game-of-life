import { randomFrom } from "./functions.js";
import { BinaryStar, TrinaryStar } from "./star-types.js";

export default class StarField {
    constructor(cfg) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.stars = [];
        this.binaries = [];
        this.trinaries = [];
        this.scale = Math.min(this.width, this.height) / cfg.BASELINE_SCALE;

        // ------------------ Rotation Speed ------------------
        this.skySpeed = cfg.skySpeed;

        // ------------------ Stars ------------------
        this.addBinaries(cfg);
        this.addTrinaries(cfg);
        this.addConstellations(cfg);
        this.addStars(cfg);
    }
    addBinaries(cfg) {
        cfg.binaries.forEach(b=> {
            this.binaries.push(new BinaryStar(b));
        });        
    }
    addTrinaries(cfg) {
        cfg.trinaries.forEach(t=> {
            this.trinaries.push(new TrinaryStar(t));
        });        
    }
    addConstellations(cfg) {
        const constellationPoints = [...cfg.ursaMinor, ...cfg.ursaMajor, ...cfg.orion, ...cfg.cassiopeia, ...cfg.pleiades];
        constellationPoints.forEach(c => {
            const x = c.x * this.scale;
            const y = c.y * this.scale;
            const radius = Math.sqrt(x*x + y*y);
            const angle = Math.atan2(y, x);
            this.stars.push({
                radius: radius,
                angle: angle,
                size: Math.round(1.6 + Math.random()*0.5), // slightly bigger
                color: randomFrom(cfg.constellationColors)
            });
        });
    }
    addStar(s) {
        this.stars.push(s);
    }
    addStars(cfg) {
        while(this.stars.length < cfg.totalStars){
            const radius = Math.random()*Math.sqrt(this.centerX*this.centerX + this.centerY*this.centerY);
            const angle = Math.random()*Math.PI*2;
            this.stars.push({
                radius: radius,
                angle: angle,
                size: Math.round(1.4 + Math.random()*0.5),
                color: randomFrom(cfg.starColors)
            });
        }
    }
    isOnscreen(x, y, size) {
        return (x + size >= 0 && x - size < this.width && y + size >= 0 && y - size < this.height);
    }
    update(ctx) {
        this.binaries.forEach(b => b.update(ctx, this.centerX, this.centerY, this.skySpeed));
        this.trinaries.forEach(t => t.update(ctx, this.centerX, this.centerY, this.skySpeed));
        this.stars.forEach(star=>{
            const x = this.centerX + star.radius*Math.cos(star.angle);
            const y = this.centerY + star.radius*Math.sin(star.angle);
            if ( this.isOnscreen(x, y, star.size) ) {
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(x, y, star.size, 0, Math.PI*2);
                ctx.fill();
            }
            star.angle += this.skySpeed; // update whether drawn or not - else they'll be somewhere weird in the sky
        });
    }
}