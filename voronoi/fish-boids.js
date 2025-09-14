export default class FishBoids {
    constructor(cfg) {
        this.cfg = cfg.item("boids");
        this.global = cfg.global();
        this.boids = [];
        this.resetSAC();
        this.initBoids(this.cfg, this.global);
    }
    initBoids(cfg, global) {
        for (let i = 0; i < cfg.numBoids; i++) {
            this.boids.push({
                //position: { x: Math.random() * global.width /2, y: Math.random() * global.height/2 },
                position: { x: global.width /2, y: global.height/2 },
                velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
                color: {...cfg.color}
            });
        }
    }
    resetSAC() {
        this.separation = { x: 0, y: 0 };
        this.alignment = { x: 0, y: 0 };
        this.cohesion = { x: 0, y: 0 };
    }
    getTurnAngle(oldVel, newVel) {
        const dot = oldVel.x * newVel.x + oldVel.y * newVel.y;
        const magA = Math.sqrt(oldVel.x * oldVel.x + oldVel.y * oldVel.y);
        const magB = Math.sqrt(newVel.x * newVel.x + newVel.y * newVel.y);
        const cosTheta = dot / (magA * magB + 1e-6); 
        return Math.acos(Math.max(-1, Math.min(1, cosTheta))); // radians
    }
    nudgeTowardCenter(boid) {
        const centerX = this.global.width * 0.46;
        const centerY = this.global.height * 0.39;

        // Vector from boid to center
        const toCenterX = centerX - boid.position.x;
        const toCenterY = centerY - boid.position.y;

        // Option 1: Random chance to apply nudge
        if (Math.random() < this.cfg.edgeNudgeChance) {
            boid.velocity.x += toCenterX * this.cfg.edgeNudgeStrength;
            boid.velocity.y += toCenterY * this.cfg.edgeNudgeStrength;
        }

        // Option 2: Always apply, but with random factor
        // const factor = Math.random();
        // boid.velocity.x += toCenterX * nudgeStrength * factor;
        // boid.velocity.y += toCenterY * nudgeStrength * factor;
    }
    wrapAroundEdges(boid) {
        if (boid.position.x < 0) boid.position.x += this.global.width;
        if (boid.position.x > this.global.width) boid.position.x -= this.global.width;
        if (boid.position.y < 0) boid.position.y += this.global.height;
        if (boid.position.y > this.global.height) boid.position.y -= this.global.height;
    }
    update() {
        // Compute new velocities & positions
        for (const boid of this.boids) {
            const oldVel = { ...boid.velocity };
            const { x, y } = this.computeVelocity(boid);
            boid.velocity.x = x;
            boid.velocity.y = y;

            boid.position.x += boid.velocity.x;
            boid.position.y += boid.velocity.y;
            
            const turnAngle = this.getTurnAngle(oldVel, boid.velocity);
            // If sharp turn, bump opacity
            if (turnAngle > 1.8) {  // tweak threshold
                boid.color.l += 40;
                //boid.color.a = Math.min(0.9, boid.color.a + 0.3);
            } else {
                // slowly fade back to normal
                boid.color.l = Math.max(35, boid.color.l - 0.2);
                //boid.color.a = Math.max(0.5, boid.color.a - 0.02);
            }
            this.nudgeTowardCenter(boid);
            this.wrapAroundEdges(boid);
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
    drawBoid(ctx, scale, boid) { 
        ctx.beginPath();
        ctx.moveTo(0, 0);     
        ctx.lineTo(-5 * scale, -2 * scale);  
        ctx.lineTo(-3 * scale, 0);    
        ctx.lineTo(-5 * scale, 2 * scale);    
        ctx.closePath();
        const { h, s, l, a } = boid.color;
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.fill(); 
    }    
    draw(ctx) {
        this.update();
        this.boids.forEach(boid => {
            ctx.save();            
            const { x, y } = boid.position;
            const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
            ctx.translate(x, y);
            ctx.rotate(angle);            
            const scale = 2.8; // more = bigger boid on screen
            ctx.globalAlpha = boid.opacity;
            this.drawBoid(ctx, scale, boid);            
            ctx.restore();
        });
    }
}