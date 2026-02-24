import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";

export default class VelocityLineRenderer {
    static type = "velocity_line";

    draw(particles, ctx) {
        particles.forEach(p => {
            ctx.strokeStyle = HSLAString(p.color);
            ctx.lineWidth = p.size * 10; // or try p.size * 0.5 for thinner streaks

            ctx.beginPath();
            ctx.moveTo(p.pos.x, p.pos.y);

            // Draw backwards along velocity
            ctx.lineTo(
                p.pos.x - p.vel.x,
                p.pos.y - p.vel.y
            );

            ctx.stroke();
        });
    }
}

BaseRenderer.register(VelocityLineRenderer);
