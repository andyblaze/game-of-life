export default class SteeringFeelers {
    constructor(map) {
        this.map = map;
        this.length = 10;
        this.strength = 1.5;
    }

    compute(playerPos, velocity) {
        const speed = Math.hypot(velocity.vx, velocity.vy);

        // Not moving? No feeler info yet
        if (speed < 0.001) {
            return { ax: 0, ay: 0 };
        }

        // Normalised forward direction
        const dx = velocity.vx / speed;
        const dy = velocity.vy / speed;

        // Lookahead point
        const fx = playerPos.x + dx * this.length;
        const fy = playerPos.y + dy * this.length;

        // If forward is land, all good
        if (this.map.isLand(fx, fy)) {
            return { ax: 0, ay: 0 };
        }

        // Forward is water → steer sideways
        // Pick a perpendicular direction
        const side = Math.random() < 0.5 ? 1 : -1;

        const ax = -dy * side * this.strength;
        const ay =  dx * side * this.strength;

        return { ax, ay };
    }
}
