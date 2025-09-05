//const canvas = document.getElementById('sky');
//const ctx = canvas.getContext('2d');
import { randomFrom } from "./functions.js";

export default class Stars {
    constructor(cfg) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.stars = [];
        this.scale = Math.min(this.width, this.height) / cfg.BASELINE_SCALE;

        // ------------------ Rotation Speed ------------------
        this.skySpeed = cfg.skySpeed;

        // ------------------ Stars ------------------
        this.addConstellations(cfg);
        this.addStars(cfg);
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