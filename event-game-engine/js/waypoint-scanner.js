import { dot, normalize } from "./functions.js";

export default class WaypointScanner {
    constructor(map) {
        this.map = map;
        this.scanRadius = 120;
        this.directions = 20;
        this.samples = 6;
    }

    findWaypoint(pos, target) {
        let bestScore = -Infinity;
        let bestDir = null;

        for (let i = 0; i < this.directions; i++) {
            const angle = (i / this.directions) * Math.PI * 2;
            const dir = { x: Math.cos(angle), y: Math.sin(angle) };

            let land = 0;
            let water = 0;

            for (let s = 1; s <= this.samples; s++) {
                const t = (s / this.samples) * this.scanRadius;
                const x = pos.x + dir.x * t;
                const y = pos.y + dir.y * t;

                if (this.map.isLand(x, y)) land++;
                else water++;
            }

            let score = land - water * 1.5;

            // gentle bias toward final target
            const toTarget = normalize(
                target.x - pos.x,
                target.y - pos.y
            );
            score += dot(dir, toTarget) * 0.2;

            if (score > bestScore) {
                bestScore = score;
                bestDir = dir;
            }
        }

        if (!bestDir) return null;

        return {
            x: pos.x + bestDir.x * this.scanRadius,
            y: pos.y + bestDir.y * this.scanRadius
        };
    }
}
