export default class Model {
    constructor(cfg) {
        this.cfg = cfg;
        this.boids = [];
        for (let i = 0; i < cfg.numBoids; i++) {
            this.boids.push({
                position: { x: Math.random() * cfg.width, y: Math.random() * cfg.height },
                velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
            });
        }
    }

    tick() {
        // Compute new velocities & positions
        for (const boid of this.boids) {
            const { x, y } = this.computeVelocity(boid);
            boid.velocity.x = x;
            boid.velocity.y = y;

            boid.position.x += boid.velocity.x;
            boid.position.y += boid.velocity.y;

            // wrap-around edges
            if (boid.position.x < 0) boid.position.x += this.cfg.width;
            if (boid.position.x > this.cfg.width) boid.position.x -= this.cfg.width;
            if (boid.position.y < 0) boid.position.y += this.cfg.height;
            if (boid.position.y > this.cfg.height) boid.position.y -= this.cfg.height;
        }
        return this.boids;
    }

computeVelocity(boid) {
    let separation = { x: 0, y: 0 };
    let alignment = { x: 0, y: 0 };
    let cohesion = { x: 0, y: 0 };

    let neighbors = 0;

    for (const other of this.boids) {
        if (other === boid) continue;

        const dx = other.position.x - boid.position.x;
        const dy = other.position.y - boid.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.cfg.neighborRadius) {
            neighbors++;

            // Separation
            if (dist < this.cfg.separationDistance && dist > 0) {
                separation.x -= dx / dist;
                separation.y -= dy / dist;
            }

            // Alignment
            alignment.x += other.velocity.x;
            alignment.y += other.velocity.y;

            // Cohesion
            cohesion.x += other.position.x;
            cohesion.y += other.position.y;
        }
    }

    if (neighbors > 0) {
        alignment.x /= neighbors;
        alignment.y /= neighbors;

        cohesion.x = (cohesion.x / neighbors) - boid.position.x;
        cohesion.y = (cohesion.y / neighbors) - boid.position.y;
    }

    // Weighted sum
    let vx = boid.velocity.x
        + separation.x * this.cfg.separationStrength
        + alignment.x * this.cfg.alignmentStrength
        + cohesion.x * this.cfg.cohesionStrength;

    let vy = boid.velocity.y
        + separation.y * this.cfg.separationStrength
        + alignment.y * this.cfg.alignmentStrength
        + cohesion.y * this.cfg.cohesionStrength;

// Example using a simple sin/cos drift
const t = Date.now() * 0.001; // seconds
const noise = {
    x: Math.sin(t + boid.position.y * 0.01) * this.cfg.noiseStrength,
    y: Math.cos(t + boid.position.x * 0.01) * this.cfg.noiseStrength
};

vx += noise.x;
vy += noise.y;

    // Limit speed
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > this.cfg.maxSpeed) {
        vx = (vx / speed) * this.cfg.maxSpeed;
        vy = (vy / speed) * this.cfg.maxSpeed;
    }

    return { x: vx, y: vy };
}
}