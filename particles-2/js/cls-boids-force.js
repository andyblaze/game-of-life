export default class BoidsForce {
    static type = "boids";

    constructor(cfg) {
        this.cfg = cfg;
        this.baseStrength = 0.32; // tweak this
        this.neighborRadius = 150;  // how far particles “see” each other
        this.separationDist = 15;  // minimum distance to avoid crowding
    }

    apply(particles) {
        const strength = this.baseStrength * this.cfg.boids; 
        if (strength === 0) return;

        const len = particles.length;

        particles.forEach((p, i) => {
            let avgVelX = 0, avgVelY = 0;    // alignment
            let centerX = 0, centerY = 0;    // cohesion
            let sepX = 0, sepY = 0;          // separation
            let count = 0;

            for (let j = 0; j < len; j++) {
                if (i === j) continue;
                const other = particles[j];
                const dx = other.pos.x - p.pos.x;
                const dy = other.pos.y - p.pos.y;
                const dist = Math.hypot(dx, dy);
                if (dist < this.neighborRadius) {
                    // Alignment
                    avgVelX += other.vel.x;
                    avgVelY += other.vel.y;

                    // Cohesion
                    centerX += other.pos.x;
                    centerY += other.pos.y;

                    // Separation
                    if (dist < this.separationDist) {
                        sepX -= (other.pos.x - p.pos.x);
                        sepY -= (other.pos.y - p.pos.y);
                    }

                    count++;
                }
            }

            if (count > 0) {
                // Average the contributions
                avgVelX /= count;
                avgVelY /= count;
                centerX /= count;
                centerY /= count;

                // Compute velocity adjustments
                let velX = (avgVelX - p.vel.x) * 0.05;          // alignment weight
                let velY = (avgVelY - p.vel.y) * 0.05;

                let cohX = (centerX - p.pos.x) * 0.002;         // cohesion weight
                let cohY = (centerY - p.pos.y) * 0.002;

                let sepX_adj = sepX * 0.05;                     // separation weight
                let sepY_adj = sepY * 0.05;

                // Apply combined boid “force”
                p.vel.x += strength * (velX + cohX + sepX_adj);
                p.vel.y += strength * (velY + cohY + sepY_adj);
            }
        });
    }
}
