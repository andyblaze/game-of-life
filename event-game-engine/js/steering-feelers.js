export default class SteeringFeelers {  /*Summary (pin this mentally)

✔ Scan quite far (80–150px) 

✔ 360° lookaround

✔ 16–24 coarse directions

✔ Score by land dominance

✔ Gentle target bias (tiebreaker, not commander)

✔ Set safe waypoint

✔ Wander & jitter on the way there */
    constructor(map) {
        this.map = map;

        this.length = 80;
        this.strength = 10;

        this.angles = [
            -Math.PI / 3,
            -Math.PI / 6,
             0,
             Math.PI / 6,
             Math.PI / 3
        ];
    }

    compute(playerPos, velocity) {
        const speed = Math.hypot(velocity.vx, velocity.vy);
        if (speed < 0.001) return { ax: 0, ay: 0 };

        const baseAngle = Math.atan2(velocity.vy, velocity.vx);

        let bestScore = -Infinity;
        let bestAngle = null;

        for (const offset of this.angles) {
            const angle = baseAngle + offset;
            const score = this.sampleDirection(playerPos, angle);

            if (score > bestScore) {
                bestScore = score;
                bestAngle = angle;
            }
        }

        // Everything is terrible → no steering
        if (bestScore <= 0 || bestAngle === null) {
            return { ax: 0, ay: 0 };
        }

        return {
            ax: Math.cos(bestAngle) * this.strength,
            ay: Math.sin(bestAngle) * this.strength
        };
    }
    computeDanger(playerPos, velocity) {
        const speed = Math.hypot(velocity.vx, velocity.vy);
        if (speed < 0.001) return 0;

        const baseAngle = Math.atan2(velocity.vy, velocity.vx);
        const scores = [];

        for (const offset of this.angles) {
            const angle = baseAngle + offset;
            const distance = this.sampleDirection(playerPos, angle);
            const normalized = 1 - distance / this.length;
            scores.push(normalized);
        }

        const danger = Math.max(...scores);
        return danger; // 0..1
    }

    sampleDirection(pos, angle) {
        // Returns how far we can go before hitting water
        for (let d = 1; d <= this.length; d++) {
            const x = pos.x + Math.cos(angle) * d;
            const y = pos.y + Math.sin(angle) * d;

            if (!this.map.isLand(x, y)) {
                return d - 1; // distance of safety
            }
        }
        return this.length; // fully clear
    }
}
