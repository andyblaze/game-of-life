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

            if (vx === 0 && vy === 0) return;

            // normalize velocity for direction
            const mag = Math.hypot(vx, vy);
            const dirX = vx / mag;
            const dirY = vy / mag;

            // perpendicular vector
            const perpX = -dirY;
            const perpY = dirX;

            // tip at particle
            const tip = [x, y];

            // fat base center along velocity
            const length = size * 2.5;
            const baseCenter = [x + dirX * length, y + dirY * length];

            // width of fat end
            const baseWidth = size * 2;
            const leftBase  = [baseCenter[0] - perpX * baseWidth / 2, baseCenter[1] - perpY * baseWidth / 2];
            const rightBase = [baseCenter[0] + perpX * baseWidth / 2, baseCenter[1] + perpY * baseWidth / 2];

            // arc radius for rounded top
            const arcRadius = size * 1.2;

            ctx.fillStyle = HSLAString(p.color);
            ctx.beginPath();
            ctx.moveTo(...tip);

            // left side quadratic to left base
            ctx.quadraticCurveTo(
                tip[0] + perpX * size * 0.5,
                tip[1] + perpY * size * 0.5,
                ...leftBase
            );

            // top semicircle (fat end)
            const startAngle = Math.atan2(leftBase[1] - baseCenter[1], leftBase[0] - baseCenter[0]);
            const endAngle   = Math.atan2(rightBase[1] - baseCenter[1], rightBase[0] - baseCenter[0]);
            ctx.arc(
                baseCenter[0],
                baseCenter[1],
                arcRadius,
                startAngle,
                endAngle,
                false
            );

            // right side quadratic back to tip
            ctx.quadraticCurveTo(
                tip[0] - perpX * size * 0.5,
                tip[1] - perpY * size * 0.5,
                ...tip
            );

            ctx.closePath();
            ctx.fill();
        });
    }
}

BaseRenderer.register(PetalRenderer);
