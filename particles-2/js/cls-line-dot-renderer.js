import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString, lerpHSLAColor } from "./functions.js";

export default class LineRenderer {
    static type = "line";

    constructor(cfg) {
        this.streakMap = new WeakMap();
        this.dotAlphaMap = new WeakMap();
        this.dotProgressMap = new WeakMap();
        this.maxLineLength = 30;
        this.dotSpeed = 0.009;  // tweakable, e.g. 0.02 per frame
    }

    getStreakLength(p) {
        let streakLength = this.streakMap.get(p) || 1; // default to 1
        streakLength += (this.maxLineLength - streakLength) * 0.15;    // ease toward max length
        this.streakMap.set(p, streakLength);
        return streakLength;
    }
    getAlpha(p, streakLength) {
        let alpha = this.dotAlphaMap.get(p) || 0;

        // simple easing in based on streak growth
        const streakProgress = streakLength / this.maxLineLength;  // 0 → 1
        alpha += (1 - alpha) * streakProgress * 0.3; // tweak 0.3 for speed

        // optional: if particle near death, fade out fast
        if (p.age / p.life > 0.9) {
            alpha *= 0.5;  // or some fast dropoff
        }
        this.dotAlphaMap.set(p, alpha);
        return alpha;
    }
    getDotSpeed(p) {
        let t = this.dotProgressMap.get(p) || 0;
        t += this.dotSpeed;  // tweakable, e.g. 0.02 per frame
        if (t > 1) t = 1;    // stop at end
        this.dotProgressMap.set(p, t);
        return t;
    }

    draw(particles, ctx) {
        particles.forEach(p => {

            // Compute velocity magnitude
            const vx = p.vel.x;
            const vy = p.vel.y;
            const mag = Math.sqrt(vx * vx + vy * vy);

            if (mag === 0) return; // no movement → no line

            // Normalize velocity
            const nx = vx / mag;
            const ny = vy / mag;

            let streakLength = this.getStreakLength(p);

            let alpha = this.getAlpha(p, streakLength); //this.dotAlphaMap.get(p) || 0;

            let t = this.getDotSpeed(p);

            const x0 = p.pos.x;
            const y0 = p.pos.y;
            const x1 = x0 + nx * streakLength;
            const y1 = y0 + ny * streakLength;

            ctx.strokeStyle = HSLAString(p.color);
            ctx.lineWidth = p.size; // or fixed 1 if you prefer

            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            // Midpoint - except now it's the point along the line
            const mx = x0 + (x1 - x0) * t;
            const my = y0 + (y1 - y0) * t;

            // Life progress (0 → 1)
            const lifeT = p.age / p.life;

            // We want strong highlight early, fade as it ages
            const fadeT = 1 - lifeT;

            // Target "white-ish" version of same hue
            const highlightTarget = {
                h: p.color.h,
                s: 0,        // remove saturation
                l: 100,      // max lightness
                a: alpha
            };

            // Blend base color toward highlight target
            const dotColor = lerpHSLAColor(p.color, highlightTarget, fadeT);
            //console.log(p.color, highlightTarget, dotColor);

            ctx.fillStyle = HSLAString(dotColor);
            ctx.beginPath();
            ctx.arc(mx, my, p.size * 1.4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

BaseRenderer.register(LineRenderer);