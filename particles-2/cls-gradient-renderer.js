import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";

export default class GradientRenderer {
    static type = "gradient";
    draw(particles, tweens, ctx) {
        particles.forEach(p => {
            tweens.apply(p, p.dt()); 
            const g = ctx.createRadialGradient(
                p.pos.x, p.pos.y, 0,
                p.pos.x, p.pos.y, p.size
            );
            const c = p.color;

            g.addColorStop(0, HSLAString(c));
            g.addColorStop(1, `hsla(${c.h}, ${c.s}%, ${c.l}%, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

BaseRenderer.register(GradientRenderer);