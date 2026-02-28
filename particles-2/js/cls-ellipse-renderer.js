import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString, mt_randf } from "./functions.js";

export default class MorphingEllipseRenderer {
    static type = "ellipse";

    constructor() {
        // per-particle rotation state
        this.rotations = new WeakMap();
        this.rotationSpeed = 0.02; // radians per frame, tweakable

        // per-particle shape factor for width/height
        this.ellipsesFactor = new WeakMap();
    }

    draw(particles, ctx) {
        particles.forEach(p => {
            // get or initialize rotation
            let rot = this.rotations.get(p) ?? mt_randf(-1, 1) * Math.PI * 2;
            rot += rot > 0 ? this.rotationSpeed : -this.rotationSpeed;
            this.rotations.set(p, rot);

            // get or initialize shape factor
            let scaleFactor = this.ellipsesFactor.get(p);
            if ( scaleFactor === undefined ) {
                scaleFactor = mt_randf(0.25, 5.5); // 0 = circle, 1 = elongated
                this.ellipsesFactor.set(p, scaleFactor);
            }

            const x = p.pos.x;
            const y = p.pos.y;
            const baseSize = p.size;

            const width = baseSize;
            const height = baseSize * (1 + 0.5 * scaleFactor); // morphing height

            ctx.fillStyle = HSLAString(p.color);

            // draw rotated ellipse
            ctx.beginPath();
            ctx.ellipse(x, y, width, height, rot, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}

BaseRenderer.register(MorphingEllipseRenderer);
