import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString, mt_rand, randomFrom } from "./functions.js";

export default class ConnectionsRenderer {
    static type = "connections";

    constructor() {
        this.connectionsMap = new WeakMap();
        this.connectionChance = 1; // tweakable: % chance to connect per particle per frame
    }
// Inside ConnectionsRenderer class
quadraticCurve(p, target, ctx, offsetAmount = 10) { 
    const x0 = p.pos.x;
    const y0 = p.pos.y;
    const x1 = target.pos.x;
    const y1 = target.pos.y;

    // Midpoint
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;

    // Perpendicular vector
    let dx = x1 - x0;
    let dy = y1 - y0;
    let px = -dy;
    let py = dx;

    // Normalize perpendicular
    const len = Math.sqrt(px * px + py * py) || 1;
    px = (px / len) * offsetAmount;
    py = (py / len) * offsetAmount;

    // Control point
    const cx = mx + px;
    const cy = my + py;

    // Draw curve
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.stroke();
}


    draw(particles, ctx) {
        particles.forEach(p => {
            let target = this.connectionsMap.get(p);

            // Check if connection exists and is alive
            if ( ! target ) {
                const maxDistance = 10;
                const nearby = particles.filter(candidate => {
                    if (candidate === p) return false;               // don’t link to self
                    //if (candidate.dead) return false;                // skip dead particles
                    const dx = candidate.pos.x - p.pos.x;
                    const dy = candidate.pos.y - p.pos.y;
                    return dx*dx + dy*dy <= maxDistance*maxDistance; // within threshold
                });
                // Roll random chance to create a connection
                if (mt_rand(0, 100) < this.connectionChance && nearby.length > 0 ) {
                    // Pick a random particle that isn’t self
                    do {
                        target = randomFrom(nearby);
                    } while (target === p);
                    this.connectionsMap.set(p, target);
                } else {
                    target = null;
                    this.connectionsMap.delete(p);
                }
            }

            // Draw the line if there’s a valid target
            if (target) {
                ctx.strokeStyle = HSLAString(p.color);
                ctx.lineWidth = 1;
                this.quadraticCurve(p, target, ctx, 10);
                /*ctx.beginPath();
                ctx.moveTo(p.pos.x, p.pos.y);
                ctx.lineTo(target.pos.x, target.pos.y);
                ctx.stroke();*/
            }
        });
    }
}

BaseRenderer.register(ConnectionsRenderer);
