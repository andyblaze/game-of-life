import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";
export default class CircleRenderer {
    static type = "solid";
    draw(particles, ctx) {
        particles.forEach(p => {
            ctx.fillStyle = HSLAString(p.color); 
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);            
            ctx.fill();
        });
    }
}

BaseRenderer.register(CircleRenderer);