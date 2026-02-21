import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString, mt_rand } from "./functions.js";

export default class RadialBurstRenderer {
    static type = "radial_burst";

    constructor() {
        this.effectsMap = new WeakMap();
    }

    draw(particles, ctx) {
        particles.forEach(p => {

            // Small particles: simple circle
            if (p.size < 2) {
                ctx.fillStyle = HSLAString(p.color);
                ctx.beginPath();
                ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                return;
            }

            // Bigger particles: small central arc + radial spokes
            const centerRadius = 1; // radius of central dot
            ctx.fillStyle = HSLAString(p.color);
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, centerRadius, 0, Math.PI * 2);
            ctx.fill();

            let effect = this.effectsMap.get(p);

            if ( effect === undefined ) {
                effect = { baseRotation: Math.random() * Math.PI * 2, spokeCount: mt_rand(5, 8) };
                this.effectsMap.set(p, effect);
            }

            // Draw spokes
            //const spokeCount = 6; // simple fixed count
            const spokeLength = p.size;
            const angleStep = (2 * Math.PI) / effect.spokeCount;

            ctx.strokeStyle = HSLAString(p.color);
            ctx.lineWidth = 1;

            for (let i = 0; i < effect.spokeCount; i++) {
                //const angle = i * angleStep;
                const angle = effect.baseRotation + i * angleStep;
                const xEnd = p.pos.x + Math.cos(angle) * spokeLength;
                const yEnd = p.pos.y + Math.sin(angle) * spokeLength;

                ctx.beginPath();
                ctx.moveTo(p.pos.x, p.pos.y);
                ctx.lineTo(xEnd, yEnd);
                ctx.stroke();
            }
        });
    }
}

BaseRenderer.register(RadialBurstRenderer);
