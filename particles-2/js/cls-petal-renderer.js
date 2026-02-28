import BaseRenderer from "./cls-baserenderer.js";
import { HSLAString } from "./functions.js";

export default class PetalRenderer {
    static type = "petal";

    draw(particles, ctx) {
        particles.forEach(p => {
            const x = p.pos.x;
            const y = p.pos.y;
            const vx = p.vel.x;
            const vy = p.vel.y;
            const size = p.size;

            // skip zero-length velocity
            if (vx === 0 && vy === 0) return;

            // angle along velocity
            const angle = Math.atan2(vy, vx);

            // deterministic petal dimensions
            const length = size * 2.5;     // tip to base distance
            const baseWidth = size * 1.8;  // width of fat end

            // tip at particle
            const tipX = x;
            const tipY = y;

            // base center along velocity
            const baseX = x + vx * length;
            const baseY = y + vy * length;

            // perpendicular offset for base edges
            const dx = Math.cos(angle + Math.PI / 2) * baseWidth / 2;
            const dy = Math.sin(angle + Math.PI / 2) * baseWidth / 2;
            const baseLeft  = [baseX - dx, baseY - dy];
            const baseRight = [baseX + dx, baseY + dy];

            // control points for bulging sides (1/3 along the line from tip to base, pushed outward)
            const ctrlFactor = 0.33;
            const bulge = size; // amount of outward curve

            const ctrlLeftX  = tipX + (baseLeft[0] - tipX) * ctrlFactor - Math.sin(angle) * bulge;
            const ctrlLeftY  = tipY + (baseLeft[1] - tipY) * ctrlFactor + Math.cos(angle) * bulge;

            const ctrlRightX = tipX + (baseRight[0] - tipX) * ctrlFactor + Math.sin(angle) * bulge;
            const ctrlRightY = tipY + (baseRight[1] - tipY) * ctrlFactor - Math.cos(angle) * bulge;

            // draw teardrop petal
            ctx.fillStyle = HSLAString(p.color);
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.quadraticCurveTo(ctrlLeftX, ctrlLeftY, baseLeft[0], baseLeft[1]);
            ctx.quadraticCurveTo(ctrlRightX, ctrlRightY, tipX, tipY);
            ctx.closePath();
            ctx.fill();
        });
    }
}

BaseRenderer.register(PetalRenderer);
