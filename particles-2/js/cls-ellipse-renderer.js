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

            const width = baseSize;
            const height = baseSize +10;//* 2.52;

            ctx.fillStyle = HSLAString(p.color);

            // draw rotated ellipse
           // ctx.save();
            ctx.beginPath();
            ctx.ellipse(x, y, width, height, rot, 0, 2 * Math.PI);
            ctx.fill();
            //ctx.restore();
        });
    }
}

BaseRenderer.register(MorphingEllipseRenderer);
