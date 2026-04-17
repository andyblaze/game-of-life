import { randomFrom, mt_rand } from "./functions.js";

export default class Planet {
    constructor(cfg) {
        this.dist = mt_rand(30, 150);
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.005 + Math.random() * 0.01;
        this.size = mt_rand(2, 5); 
        this.type = randomFrom(cfg.planetTypes);
        this.color = randomFrom(cfg.palettes[this.type]);
        this.blobs = [];

        const blobCount = mt_rand(2, 3); // 2–3 blobs

        for (let i = 0; i < blobCount; i++) {
            this.blobs.push({
                angle: Math.random() * Math.PI * 2,
                dist: Math.random() * 0.5,         // relative to radius
                size: 0.3 + Math.random() * 0.4,   // relative size
                alpha: 0.1 + Math.random() * 0.15  // subtle
            });
        }
    }
    update() {
        this.angle += this.speed;
    }
    renderCircle(ctx, px, py, radius) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();    
    }
    render(ctx, p) {
        const px = p.x + Math.cos(this.angle) * this.dist * p.scale;
        const py = p.y + Math.sin(this.angle) * this.dist * p.scale;        
        const radius = this.size * p.scale;

        if ( radius < 4 ) { // just a circle
            this.renderCircle(ctx, px, py, radius);
            return;
        }

        // ----------------------------
        // LIGHT DIRECTION (planet -> star)
        // ----------------------------
        const lx = p.x - px;
        const ly = p.y - py;
        const len = Math.hypot(lx, ly) || 1;
        const nx = lx / len;
        const ny = ly / len;
        // ----------------------------
        // GRADIENT (curved lighting)
        // ----------------------------
        const lightOffset = radius;

        const gx1 = px - nx * lightOffset;
        const gy1 = py - ny * lightOffset;
        const gx2 = px + nx * lightOffset;
        const gy2 = py + ny * lightOffset;

        const gradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
        gradient.addColorStop(0, "rgba(0,0,0,0.6)");
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, "white");
        // ----------------------------
        // DRAW PLANET BASE
        // ----------------------------
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.clip(); // keep blobs inside planet
        ctx.fillStyle = gradient;
        ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);

        if ( radius < 6 ) {
            ctx.restore();
            return; // gradient only, no blobs
        }

        // ----------------------------
        // BLOBS (surface variation)
        // ----------------------------
        for ( let b of this.blobs ) {
            const bx = px + Math.cos(b.angle) * radius * b.dist;
            const by = py + Math.sin(b.angle) * radius * b.dist;
            const br = radius * b.size;

            ctx.fillStyle = `rgba(0,0,0,${b.alpha})`;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}