import { Point, hslaStr, lerpColor } from "./functions.js";

export default class Star {
    constructor(config, extra) {
        this.cfg = { ...config, ...extra };
        this.cfg.canvasSz = Point(config.canvasW, config.canvasH);
        this.cfg.scale = config.visualScale;
        this.cfg.dpr = config.DPR;
        this.colorA = {...this.cfg.colorA};
        this.colorB = {...this.cfg.colorB};
        this.mass = config.mass;
        this.pos = {x:0,y:0};
        this.vel = {x:0,y:0};
        this.radius = this.cfg.radius; 
        this.phase = Math.random() * Math.PI * 2;
        this.pulseRate = this.cfg.pulseRate;

        // --- Transit spots ---
        this.spots = [];
        const numSpots = 3 + Math.floor(Math.random() * 3); // 3–5 spots
        this.makeSpots(numSpots, this.radius, this.colorA);
    }
    makeSpots(numSpots, radius, color) {
        //console.log(radius);
        for (let i = 0; i < numSpots; i++) {
            const spot = {
                transitPhase: Math.random(),                          // starting phase along disk
                spotYOffset: (Math.random() * 0.6 - 0.3) * radius,   // ±30% radius from equator
                spotRadius: 0.5,// + Math.random(),                        // 1–2 px
                colorOffset: {                                       // slightly darker/shifted
                    h: color.h,
                    s: Math.max(0, color.s - 40),
                    l: Math.max(0, color.l - 40),
                    a: 1
                },
                transitSpeed: 0.02 + Math.random() * 0.03,           // fraction/sec across disk
                waitTime: Math.random() * 2                            // seconds before starting
            }; //console.log(radius, spot.spotYOffset);
            this.spots.push(spot);
        }
    } 
    worldToScreen(p){
        return Point(
            this.cfg.canvasSz.x / this.cfg.dpr * 0.5 + p.x * this.cfg.scale,
            this.cfg.canvasSz.y / this.cfg.dpr * 0.5 + p.y * this.cfg.scale
        );
    }
    update(dt) {
        // advance phase (controls oscillation speed)
        this.phase += this.pulseRate * dt;
        // oscillate f smoothly between 0 → 1 → 0
        const f = (Math.sin(this.phase) + 1) / 2;
        this.color = lerpColor(this.colorA, this.colorB, f);
        // --- Update transit spots ---
        for (const spot of this.spots) {
            // Handle waiting time
            if (spot.waitTime > 0) {
                spot.waitTime -= dt;
                continue; // spot hasn't started yet
            }

            // Advance transit phase
            spot.transitPhase += spot.transitSpeed * dt;

            // Loop phase: once past 1 (across disk), reset to 0 with new wait
            if (spot.transitPhase > 1) {
                spot.transitPhase = 0;
                spot.waitTime = Math.random() * 2; // staggered restart
            }
        }
    }
    draw(ctx) {
        const screen = this.worldToScreen(this.pos);
        const r = Math.max(3, this.radius * this.cfg.scale); 
        const starRadius = r * 0.8; // same as used to draw star
        // small bright core
        ctx.fillStyle = hslaStr(this.color);
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, starRadius, 0, Math.PI * 2);
        ctx.fill();


        // --- Draw transit spots ---
        for (const spot of this.spots) {
            if (spot.waitTime > 0) continue; // not yet visible
            const margin = 0.96;
            const x = screen.x - starRadius * margin + 2 * starRadius * margin * spot.transitPhase;
            const y = screen.y + spot.spotYOffset * this.cfg.scale; 

            // Spot color slightly darker than star
            const color = lerpColor(this.color, spot.colorOffset, 0.2);

            ctx.fillStyle = hslaStr(color);
            ctx.beginPath();
            ctx.arc(x, y, spot.spotRadius * this.cfg.scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    setPosition(x, y) {
        this.pos = Point(x, y);
    }
    setVelocity(vx, vy) {
        this.vel = Point(vx, vy);
    }
}