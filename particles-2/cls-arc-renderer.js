import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";

export default class ArcRenderer {
    static type = "arc";

    draw(particles, ctx) {
        particles.forEach(p => {
            ctx.strokeStyle = HSLAString(p.color);
            ctx.lineWidth = 2; // tweak as needed

            const radius = p.size;

            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        });
    }
}

BaseRenderer.register(ArcRenderer);
