import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString, mt_randf } from "./functions.js";

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
            let rot = this.rotations.get(p) ?? mt_randf(-1, 1) * Math.PI * 2;
            rot += rot > 0 ? this.rotationSpeed : -this.rotationSpeed;
            this.rotations.set(p, rot);

            const x = p.pos.x;
            const y = p.pos.y;
            const baseSize = p.size;

            // simple morph: oscillate width/height slightly
            //const wobble = 0;//Math.sin(performance.now() * 0.005 + x + y) * 0.3; // small oscillation
            const width = baseSize;
            const height = baseSize +10;//* 2.52;

            //console.log(x, y);

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
            //ctx.rotate(rot);
            //ctx.scale(width, height);
            ctx.beginPath();
            //ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);    
            // .ellipse(x, y, x_radius, y_radius, rotation, start_angle, end_angle, direction);
            ctx.ellipse(x, y, width, height, rot, 0, 2 * Math.PI);//width, height, rot, Math.PI / 3, 0);
            //ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
}

BaseRenderer.register(MorphingEllipseRenderer);
