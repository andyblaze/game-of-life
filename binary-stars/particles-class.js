import createBridgePath from "./path.js";
import { hslaStr, Point } from "./functions.js";

export default class ParticleSystem {
    constructor(starA, starB, config) {
        this.starA = starA;
        this.starB = starB;
        this.cfg = config;

        this.bridge = null;
        this.ready = false; 
        this.time = 0;

        // Number of active particles
        this.count = config.activeParticleCount;
        this.maxWidth = starA.radius * 0.9; // visually wide, but not huge

        // Pool of particles
        this.particles = [];
    }
    makeParticle() {
        // Creates one particle at donor with randomized properties
        return {
            t: Math.random() - 0.08, // start near the donor
            speed: 0.8 + Math.random() * 0.2,
            size: 1 + Math.random() * 1.5,
            color: {...this.starA.color},
            pos: { x: 0, y: 0 },
            u: Math.random() * 20 - 10,         // perpendicular offset
            state: "bridge",
            wait:Math.random() * 13 + 4
        };
    }
    setPosition(p) {
        const donor = this.starA;
        const acc = this.starB;
        // --- Compute base donor → accretor direction ---
        const d = Point(
            acc.pos.x - donor.pos.x,
            acc.pos.y - donor.pos.y
        );
        const len = Math.hypot(d.x, d.y) || 1;
        const dir = Point(d.x / len, d.y / len);

        // --- Perpendicular for width jitter ---
        const perp = Point(-dir.y, dir.x);

        // --- Spawn just off donor surface, slightly inside ---
        const surfaceR = donor.radius * (0.95 + Math.random() * 0.1);
        const offsetAlong = surfaceR * 0.05; // tiny offset toward accretor
        const width = this.maxWidth * 0.3;        // smaller scatter at start
        const lateral = (Math.random() * 2 - 1) * width * 0.2;

        p.pos = Point(
            donor.pos.x + dir.x * offsetAlong + perp.x * lateral,
            donor.pos.y + dir.y * offsetAlong + perp.y * lateral
        );
    }
    initializeState(p) {
        p.state = "bridge";
        p.t = Math.random() * 0.05; // near start of bridge
        p.u = (Math.random() * 2 - 1);
        p.color.a = 0.4 + Math.random() * 0.6;
        p.radius = 0;
        p.speed = 0.5 + Math.random() * 0.5;
    }
    resetParticle(p) {
        this.setPosition(p);
        this.initializeState(p);
    }
    initParticles(donor, acc) {
        this.particles = Array.from({ length: this.count }, () => this.makeParticle());
        for ( const p of this.particles)
            this.resetParticle(p);
    }
    update(dt) {
        const donor = this.starA;
        const acc = this.starB;
        const bridge = createBridgePath(donor, acc);
        this.time += dt;
        // Wait for stars to stabilize before creating particles
        if ( ! this.ready ) {
            if (this.time < 2.5) return;
            this.ready = true;
            // Initialize all particles *after* stars are stable
            this.initParticles(donor, acc);
            return;
        }

        for ( const p of this.particles ) {
            if ( p.wait > 0 ) { // hide unready stars with alpha = 0
                p.wait -= dt;
                p.color.a = 0;
                continue;
            }
            p.color.a = 1;
            // --- STREAMING ALONG BRIDGE ---
            if ( p.state === "bridge" ) {
                p.t += p.speed * dt * 0.2;

                if ( p.t >= 1 ) { // reached accretor north pole                    
                    this.startSwirl(p, bridge(1), acc);
                    continue;
                }
                // normal bridge motion
                this.rideTheBridge(p, bridge(p.t), donor, acc);
            }
            // --- SWIRLING AROUND ACCRETOR ---
            else if ( p.state === "swirl" ) {
                this.swirl(p, dt, acc);
                if ( p.color.a <= 1 ) {
                    this.resetParticle(p, donor, acc);
                }
            }
        }
    }
    rideTheBridge(p, pos, donor, acc) {
        const d = Point(acc.pos.x - donor.pos.x, acc.pos.y - donor.pos.y);
        const len = Math.hypot(d.x, d.y) || 1;
        const perp = Point(-d.y / len, d.x / len);
        // taper width toward accretor
        const width = this.maxWidth * (1 - p.t);
        const offset = width * p.u;
        
        p.pos = Point(pos.x + perp.x * offset, pos.y + perp.y * offset);
    }
    startSwirl(p, pos, acc) {
        p.pos.x = pos.x;
        p.pos.y = pos.y;
        const d = Point(pos.x - acc.pos.x, pos.y - acc.pos.y);
        p.state = "swirl";
        p.theta = Math.atan2(d.y, d.x);
        p.omega = 1.5 + Math.random() * 0.8;
        p.radius = Math.hypot(d.x, d.y);
        p.color = {...acc.color};
        p.t = 0;
    }
    swirl(p, dt, acc) {
        p.theta += p.omega * dt;
        p.radius *= (1 - 0.1 * dt);
        p.pos = Point(
            acc.pos.x + Math.cos(p.theta) * p.radius,
            acc.pos.y + Math.sin(p.theta) * p.radius
        );
        p.color.a -= 8 * dt; 
        p.color = {...acc.color};
    }
    draw(ctx) {
        const { visualScale } = this.cfg;
        const c = Point(ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.lineWidth = 1;
        const donor = this.starA;
        const acc = this.starB;
        
        for (const p of this.particles) {
            // Convert world → screen
            const sx = c.x + p.pos.x * visualScale;
            const sy = c.y + p.pos.y * visualScale;

            const tail = Math.max(0.5, 1 * (1 - p.t));
            p.color.h = donor.color.h + (acc.color.h - donor.color.h) * p.t;
            
            ctx.strokeStyle = hslaStr(p.color);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - tail, sy - tail);
            ctx.stroke();
        }
    }
}