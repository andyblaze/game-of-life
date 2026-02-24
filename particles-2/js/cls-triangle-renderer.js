import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";

export default class TriangleRenderer {
    static type = "triangle";

    constructor() {
        // store rotation state per particle
        this.rotations = new WeakMap();
        this.rotationSpeed = 0.05; // radians per frame, tweakable
    }

    draw(particles, ctx) {
        particles.forEach(p => {
            // get or initialize rotation
            let rot = this.rotations.get(p) ?? Math.random() * Math.PI * 2;
            rot += this.rotationSpeed; // advance rotation
            this.rotations.set(p, rot);

            const size = p.size;
            const x = p.pos.x;
            const y = p.pos.y;

            // compute triangle vertices relative to center
            const vertices = [
                [0, -size],
                [size * Math.sin(Math.PI / 3), size / 2],
                [-size * Math.sin(Math.PI / 3), size / 2]
            ];

            // rotate and translate vertices
            const rotated = vertices.map(([vx, vy]) => {
                const rx = vx * Math.cos(rot) - vy * Math.sin(rot);
                const ry = vx * Math.sin(rot) + vy * Math.cos(rot);
                return [rx + x, ry + y];
            });

            // draw triangle
            ctx.fillStyle = HSLAString(p.color);
            ctx.beginPath();
            ctx.moveTo(...rotated[0]);
            ctx.lineTo(...rotated[1]);
            ctx.lineTo(...rotated[2]);
            ctx.closePath();
            ctx.fill();
        });
    }
}

BaseRenderer.register(TriangleRenderer);
