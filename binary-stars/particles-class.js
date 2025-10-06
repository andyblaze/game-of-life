import createBridgePath from "./path.js";

export default class ParticleSystem {
    constructor(starA, starB, config) {
        this.starA = starA;
        this.starB = starB;
        this.cfg = config;

        // Create a reusable path function between the stars
        this.path = createBridgePath(starA, starB);

        // Number of active particles
        this.count = 300;

        // Pool of particles
        this.particles = Array.from({ length: this.count }, () => this.makeParticle());
    }

    makeParticle() {
        // Creates one particle at donor with randomized properties
        return {
            t: Math.random() * 0.2, // start near the donor
            speed: 0.1 + Math.random() * 0.2,
            size: 1 + Math.random() * 1.5,
            alpha: 0.5 + Math.random() * 0.5,
            pos: { x: 0, y: 0 }
        };
    }

    update(dt) {
        // Recreate path each frame (stars move)
        this.path = createBridgePath(this.starA, this.starB);

        for (const p of this.particles) {
            // advance along path
            p.t += p.speed * dt * 0.2;

            // wrap or recycle when reaching accretor
            if (p.t > 1) {
                p.t = 0;
                p.speed = 0.1 + Math.random() * 0.2;
            }

            // compute world position along path
            const { x, y } = this.path(p.t);
            p.pos.x = x;
            p.pos.y = y;
        }
    }

    draw(ctx) {
        //ctx.save();
        //ctx.globalCompositeOperation = "lighter"; // additive blending looks nice
        for (const p of this.particles) {
            //ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            const sx = ctx.canvas.width / 2 + p.pos.x * this.cfg.visualScale;
            const sy = ctx.canvas.height / 2 + p.pos.y * this.cfg.visualScale;
            ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 220, 160, 1)";
            ctx.fill();
        }
        //ctx.restore();
    }
}