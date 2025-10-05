export default class Simulation {
    constructor(config) {
        this.cfg = config;
        this.gravity = 0;
        //this.initBinary(config)
    }
    // compute G so that circular-orbit period equals desiredPeriod:
    // omega = 2*pi/T ; for circular orbit: omega^2 = G*(M1+M2)/a^3
    computeG(M1, M2, dist, T) {
        const omega = 2 * Math.PI / T;
        this.gravity = Math.pow(dist, 3) * omega * omega / (M1 + M2);
    }
    initBinary(starA, starB) {
        const cfg = this.cfg;
        this.computeG(cfg.M1, cfg.M2, cfg.separation, cfg.desiredPeriod);
        const M1 = cfg.M1, M2 = this.cfg.M2;
        const dist = cfg.separation;

        // center-of-mass at origin
        starA.setPosition(- (M2 / (M1 + M2)) * dist, 0);
        starB.setPosition(+ (M1 / (M1 + M2)) * dist, 0);

        // circular orbital velocity at this distance
        const vCirc = Math.sqrt(this.gravity * (M1 + M2) / dist);

        // scale by eccentricity: treat initial position as apocenter
        const factor = Math.sqrt((1 - cfg.eccentricity) / (1 + cfg.eccentricity));
        const v = vCirc * factor;

        // assign velocities perpendicular to radius vector
        starA.setVelocity(0, -v * (M2 / (M1 + M2)));
        starB.setVelocity(0, +v * (M1 / (M1 + M2)));

        starA.mass = M1; 
        starB.mass = M2;
        starA.radius = Math.max(6, 12 * Math.cbrt(M1));
        starB.radius = Math.max(5, 10 * Math.cbrt(M2));
    }
    // compute acceleration on 2 bodies (softened)
    accelOn(starA, starB) {
        const dx = starB.pos.x - starA.pos.x;
        const dy = starB.pos.y - starA.pos.y;
        const r2 = dx*dx + dy*dy + this.cfg.softening * this.cfg.softening;
        const invr3 = 1.0 / (Math.sqrt(r2) * r2); // 1/r^3
        return { x: this.gravity * starB.mass * dx * invr3, y: this.gravity * starB.mass * dy * invr3 };
    }
    // symplectic leapfrog for the two stars (stable for long runs)
    integrateStars(dt, starA, starB) {
        // compute initial accelerations
        const aA1 = this.accelOn(starA, starB);
        const aB1 = this.accelOn(starB, starA);

        // half kick
        starA.setVelocity(
            starA.vel.x + 0.5 * aA1.x * dt,
            starA.vel.y + 0.5 * aA1.y * dt
        );
        starB.setVelocity(
            starB.vel.x + 0.5 * aB1.x * dt,
            starB.vel.y + 0.5 * aB1.y * dt
        );

        // drift
        starA.setPosition(
            starA.pos.x + starA.vel.x * dt,
            starA.pos.y + starA.vel.y * dt
        );
        starB.setPosition(
            starB.pos.x + starB.vel.x * dt,
            starB.pos.y + starB.vel.y * dt
        );

        // compute accelerations at new positions
        const aA2 = this.accelOn(starA, starB);
        const aB2 = this.accelOn(starB, starA);

        // final half kick
        starA.setVelocity(
            starA.vel.x + 0.5 * aA2.x * dt,
            starA.vel.y + 0.5 * aA2.y * dt
        );
        starB.setVelocity(
            starB.vel.x + 0.5 * aB2.x * dt,
            starB.vel.y + 0.5 * aB2.y * dt
        );
    }
    draw(ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.cfg.canvasW / this.cfg.DPR, this.cfg.canvasH / this.cfg.DPR);    
    }
}