export default class Model {
    constructor(cfg) {
        this.cfg = cfg;
        this.boids = [];
        this.resetSAC();
        this.initBoids(cfg);
    }
    initBoids(cfg) {
        for (let i = 0; i < cfg.numBoids; i++) {
            this.boids.push({
                position: { x: Math.random() * cfg.width, y: Math.random() * cfg.height },
                velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
            });
        }
    }
    resetSAC() {
        this.separation = { x: 0, y: 0 };
        this.alignment = { x: 0, y: 0 };
        this.cohesion = { x: 0, y: 0 };
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
    computeNoise(boid) {
        // Example using a simple sin/cos drift
        const t = Date.now() * 0.001; // seconds
        const noise = {
            x: Math.sin(t + boid.position.y * 0.01) * this.cfg.noiseStrength,
            y: Math.cos(t + boid.position.x * 0.01) * this.cfg.noiseStrength
        };
        return noise;
    }
    limitSpeed(vx, vy) {
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > this.cfg.maxSpeed) {
            vx = (vx / speed) * this.cfg.maxSpeed;
            vy = (vy / speed) * this.cfg.maxSpeed;
        }
        return [ vx, vy ];
    }
    weightedVelocity(idx, velocity) {
        // Weighted sum
        let vx = velocity[idx]
            + this.separation[idx] * this.cfg.separationStrength
            + this.alignment[idx] * this.cfg.alignmentStrength
            + this.cohesion[idx] * this.cfg.cohesionStrength;
        return vx;
    }
    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return [dx, dy, Math.sqrt(dx * dx + dy * dy)];        
    }
    setSeparation(dist, dx, dy) {
        if (dist < this.cfg.separationDistance && dist > 0) {
            this.separation.x -= dx / dist;
            this.separation.y -= dy / dist;
        }    
    }
    setAlignment(velocity) {
        this.alignment.x += velocity.x;
        this.alignment.y += velocity.y;    
    }
    setCohesion(position) {
        this.cohesion.x += position.x;
        this.cohesion.y += position.y; 
    }
    checkOnNeighbors(neighbors, position) {
        if ( neighbors > 0 ) {
            this.alignment.x /= neighbors;
            this.alignment.y /= neighbors;

            this.cohesion.x = (this.cohesion.x / neighbors) - position.x;
            this.cohesion.y = (this.cohesion.y / neighbors) - position.y;
        }
    }
    computeVelocity(boid) {
        this.resetSAC();

        let neighbors = 0;

        for ( const other of this.boids ) {
            if ( other === boid ) continue;

            const [dx, dy, dist] = this.getDistance(other.position, boid.position);

            if ( dist < this.cfg.neighborRadius ) {
                neighbors++;
                this.setSeparation(dist, dx, dy);
                this.setAlignment(other.velocity);
                this.setCohesion(other.position);
            }
        }

        this.checkOnNeighbors(neighbors, boid.position);

        let vx = this.weightedVelocity("x", boid.velocity);
        let vy = this.weightedVelocity("y", boid.velocity);

        const noise = this.computeNoise(boid);

        vx += noise.x;
        vy += noise.y;

        [ vx, vy ] = this.limitSpeed(vx, vy);
        return { x: vx, y: vy };
    }
}