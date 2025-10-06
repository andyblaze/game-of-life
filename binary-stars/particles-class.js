import createBridgePath from "./path.js";

export default class ParticleSystem {
    constructor(starA, starB, config) {
        this.starA = starA;
        this.starB = starB;
        this.cfg = config;

        // Create a reusable path function between the stars
        this.bridge = null;//createBridgePath(starA, starB);
        this.ready = false; // <-- NEW
        this.time = 0;

        // Number of active particles
        this.count = 1500;
        this.maxWidth = starA.radius * 0.9; // visually wide, but not huge

        // Pool of particles
        this.particles = [];//Array.from({ length: this.count }, () => this.makeParticle());
    }
    makeParticle() {
        // Creates one particle at donor with randomized properties
        return {
            t: Math.random() - 0.08, // start near the donor
            speed: 0.8 + Math.random() * 0.2,
            size: 1 + Math.random() * 1.5,
            alpha: 0.5 + Math.random() * 0.5,
            pos: { x: 0, y: 0 },
            u: Math.random() * 20 - 10,         // tiny perpendicular offset
            state: "bridge"
        };
    }
resetParticle(p, donor, acc, maxWidth) {
    // --- Compute base donor → accretor direction ---
    const dx = acc.pos.x - donor.pos.x;
    const dy = acc.pos.y - donor.pos.y;
    const len = Math.hypot(dx, dy) || 1;
    const dirX = dx / len;
    const dirY = dy / len;

    // --- Perpendicular for width jitter ---
    const perpX = -dirY;
    const perpY = dirX;

    // --- Spawn just off donor surface, slightly inside ---
    const surfaceR = donor.radius * (0.95 + Math.random() * 0.1);
    const offsetAlong = surfaceR * 0.05; // tiny offset toward accretor
    const width = maxWidth * 0.3;        // smaller scatter at start
    const lateral = (Math.random() * 2 - 1) * width * 0.2;

    p.pos.x = donor.pos.x + dirX * offsetAlong + perpX * lateral;
    p.pos.y = donor.pos.y + dirY * offsetAlong + perpY * lateral;

    // --- Initialize state ---
    p.state = "bridge";
    p.t = Math.random() * 0.05; // near start of bridge
    p.u = (Math.random() * 2 - 1);
    p.alpha = 0.4 + Math.random() * 0.6;
    p.radius = 0;
    p.speed = 0.5 + Math.random() * 0.5;
}

initParticles(donor, acc, maxWidth) {
    this.particles = Array.from({ length: this.count }, () => this.makeParticle());
    for ( const p of this.particles)
        this.resetParticle(p, donor, acc, maxWidth);
}
update(dt) {
    const donor = this.starA;
    const acc = this.starB;
    const bridge = createBridgePath(donor, acc);
    const maxWidth = this.maxWidth;

    this.time += dt;
    // Wait ~0.5s for stars to stabilize before creating particles
    if (!this.ready) {
        if (this.time < 2.5) return;
        this.ready = true;

        // Initialize all particles *after* stars are stable
        this.initParticles(this.starA, this.starB, this.maxWidth);
        return;
    }


    for (const p of this.particles) {
        // --- STREAMING ALONG BRIDGE ---
        if (p.state === "bridge") {
            p.t += p.speed * dt * 0.2;

            if (p.t >= 1) {
                // reached accretor north pole
                const pos = bridge(1);
                p.pos.x = pos.x;
                p.pos.y = pos.y;

                const dx = pos.x - acc.pos.x;
                const dy = pos.y - acc.pos.y;
                p.state = "swirl";
                p.theta = Math.atan2(dy, dx);
                p.omega = 1.5 + Math.random() * 0.8;
                p.radius = Math.hypot(dx, dy);
                p.alpha = 1.0;
                p.t = 0;
                continue;
            }

            // normal bridge motion
            const pos = bridge(p.t);
            const dx = acc.pos.x - donor.pos.x;
            const dy = acc.pos.y - donor.pos.y;
            const len = Math.hypot(dx, dy) || 1;
            const perpX = -dy / len;
            const perpY = dx / len;

            // taper width toward accretor
            const width = maxWidth * (1 - p.t);
            const offset = width * p.u;

            p.pos.x = pos.x + perpX * offset;
            p.pos.y = pos.y + perpY * offset;
        }

        // --- SWIRLING AROUND ACCRETOR ---
        else if (p.state === "swirl") {
            p.theta += p.omega * dt;
            p.radius *= (1 - 0.1 * dt);
            p.pos.x = acc.pos.x + Math.cos(p.theta) * p.radius;
            p.pos.y = acc.pos.y + Math.sin(p.theta) * p.radius;
            p.alpha -= 0.8 * dt;

            if (p.alpha <= 0) {
                this.resetParticle(p, donor, acc, maxWidth);
            }
        }
    }
}







    draw(ctx) {
        const { visualScale } = this.cfg;
        const cx = ctx.canvas.width / 2;
        const cy = ctx.canvas.height / 2;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = 1;

        for (const p of this.particles) {
            // Convert world → screen
            const sx = cx + p.pos.x * visualScale;
            const sy = cy + p.pos.y * visualScale;

            const tail = Math.max(0.5, 3 * (1 - p.t));
            const hue = 40 + (200 - 40) * p.t;

            const alpha = p.alpha * (1 - p.t * 0.3);

            // Calculate tail direction in screen space (diagonal works fine visually)
            /*const grad = ctx.createLinearGradient(sx, sy, sx - tail, sy - tail);
            grad.addColorStop(0, `hsla(${hue}, 100%, 70%, ${alpha})`);
            grad.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);*/

            ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${p.alpha})`;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - tail, sy - tail);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawold(ctx) {
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