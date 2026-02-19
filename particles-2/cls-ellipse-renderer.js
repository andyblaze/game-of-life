import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";

export default class MorphingEllipseRenderer {
    static type = "ellipse";

    constructor() {
        // per-particle rotation state
        this.rotations = new WeakMap();
        this.rotationSpeed = 0.02; // radians per frame, tweakable
    }

    draw(particles, ctx) {
        particles.forEach(p => {
            // get or initialize rotation
            let rot = this.rotations.get(p) ?? Math.random() * Math.PI * 2;
            rot += this.rotationSpeed;
            this.rotations.set(p, rot);

            const x = p.pos.x;
            const y = p.pos.y;
            const baseSize = p.size;

            // simple morph: oscillate width/height slightly
            const wobble = Math.sin(performance.now() * 0.005 + x + y) * 0.3; // small oscillation
            const width = baseSize * (1 + wobble);
            const height = baseSize * (1 - wobble);

            console.log(x, y);

            // radial gradient fill
            /*const g = ctx.createRadialGradient(x, y, 0, x, y, baseSize);
            const c = p.color;
            g.addColorStop(0, HSLAString(c));
            g.addColorStop(1, `hsla(${c.h}, ${c.s}%, ${c.l}%, 0)`);
            ctx.fillStyle = g;*/
            ctx.fillStyle = HSLAString(p.color);

            // draw rotated ellipse
            ctx.save();
            //ctx.translate(x, y);
            ctx.rotate(rot);
            //ctx.scale(width, height);
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);    
            //ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
}

BaseRenderer.register(MorphingEllipseRenderer);
