import { dot, normalize } from "./functions.js";

export default class WaypointScanner {
    constructor(map) {
        this.map = map;
        this.directions = 20;
        this.scanRadius = 60;
        this.samples = 4 + Math.floor(this.scanRadius / 10);//this.samples = 6;
    }

    findWaypoint(pos, target) {
        const scanResults = [];

        // Precompute normalized vector to target
        const toTarget = normalize(target.x - pos.x, target.y - pos.y);

        // --- 1. Scan all directions ---
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

            const landScore = land - water * 9.0; // stronger water penalty
            scanResults.push({ dir, landScore });
        }

        // --- 2. Filter only safe directions ---
        const safeDirs = scanResults.filter(r => r.landScore > 0);

        let bestDir;

        if (safeDirs.length === 0) {
            // fallback: pick direction with highest (least negative) landScore
            bestDir = scanResults.reduce((best, r) => r.landScore > best.landScore ? r : best);
        } else {
            // --- 3. Find max land score among safe directions ---
            const maxLandScore = Math.max(...safeDirs.map(r => r.landScore));

            // --- 4. Collect directions with max land score ---
            const bestDirs = safeDirs.filter(r => r.landScore === maxLandScore);

            // --- 5. Break ties with very tiny target bias + small random tie-break ---
            const targetBiasWeight = 0.02; // tiny
            bestDir = bestDirs.reduce((best, r) => {
                const scoreR = dot(r.dir, toTarget) * targetBiasWeight + Math.random() * 0.01;
                const scoreBest = dot(best.dir, toTarget) * targetBiasWeight + Math.random() * 0.01;
                return scoreR > scoreBest ? r : best;
            });
        }

        // --- 6. Return waypoint ---
        return {
            x: pos.x + bestDir.dir.x * this.scanRadius,
            y: pos.y + bestDir.dir.y * this.scanRadius
        };
    }
}
