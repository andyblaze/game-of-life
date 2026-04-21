// ----------------------------
// STAR SYSTEMS
// ----------------------------
import Planet from "./planet.js";
import { randomFrom, mt_rand, HSLAString, mt_randf } from "./functions.js";

export  class Star1 {
    constructor(cfg, s) {
        this.cfg = cfg;
        this.simplex = s;
        this.RADIUS = mt_rand(2, 5);//180;
        this.BLOB_COUNT = this.RADIUS * 0.8;
        this.COLOR = { h: 55, s: 100, l: 90, a: 1 };
        this.planets = [];
        this.hasPlanets = true;
        this.setPlanets(cfg);
        const zindex = mt_rand(0, cfg.DEPTH_SPREAD);
        this.setPosition(zindex);
        //this.r = mt_rand(2, 5);
        // ----------------------------
        // BLOBS
        // ----------------------------
        this.time = Math.random() * 1000;

        // blob data
        const points = 10;
        this.blobs = [];
        for ( let i = 0; i < this.BLOB_COUNT; i++ ) {
            this.blobs.push({
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * this.RADIUS * 0.9,
            size: mt_rand(this.RADIUS / 10, this.RADIUS / 4),
            speed: 0.2 + Math.random() * 0.95,
            offset: mt_randf(0, 1000),
            shapeOffset: mt_randf(0, 1000),
            bright: Math.random() < 0.002,
            shape: Array.from({ length: points }, (_, j) =>
                    Math.sin(j / points * Math.PI * 2) * 0.5 + mt_randf(-0.3, 0.3)
                )
            });
        }
    }
    setPosition(zindex) {
        this.x = (Math.random() - 0.5) * this.cfg.width;
        this.y = (Math.random() - 0.5) * this.cfg.height;
        this.z = zindex;    
    }
    setPlanets(cfg) {
        this.planets = [];
        this.hasPlanets = Math.random() < 0.6;        
        if ( this.hasPlanets ) {
            const n = mt_rand(1, 5);
            for ( let i = 0; i < n; i++ ) {
                this.planets.push(new Planet(cfg));
            }
        }
    }
    drawCircle(ctx) {
        ctx.fillStyle = HSLAString(this.COLOR);
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
    drawGradient (ctx) {
        // GRADIENT BASE
        const c = { ...this.COLOR };
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, this.RADIUS);
        g.addColorStop(0, HSLAString(c));
        c.h *= 0.9; //mt_randf(-5, 5); // tiny variation only
        c.l *= 0.8; // or 0.5–0.8 range
        g.addColorStop(0.5, HSLAString(c));
        c.h *= 0.4;
        c.l *= 0.4;
        g.addColorStop(1, HSLAString(c));

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
drawBlobs(ctx, t) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, this.RADIUS, 0, Math.PI * 2);
    ctx.clip();

    const points = 10;
    const step = (Math.PI * 2) / points;

    for (let b of this.blobs) {

        // slow angular drift
        b.angle += 0.0015;

        // ONE noise call per blob
        const n = this.simplex.noise(
            Math.cos(b.angle) + t * b.speed,
            Math.sin(b.angle) + b.offset
        );

        const drift = n * 20;

        const x = cx + Math.cos(b.angle) * (b.dist + drift);
        const y = cy + Math.sin(b.angle) * (b.dist + drift);

        const baseR = b.size * (0.7 + n * 0.3);

        // small animated wobble (cheap)
        const wobble = this.simplex.noise(b.offset, t * 0.5);

        ctx.beginPath();

        for (let i = 0; i <= points; i++) {

            const a = i * step;

            // 👇 NO noise here anymore
            const rn = b.shape[i % points];

            const r = baseR + (rn + wobble * 0.5) * baseR * 0.4;

            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }

        ctx.closePath();

        const c = { ...this.COLOR, a: 0.08 };

        if (b.bright) {
            ctx.fillStyle = HSLAString(c);
            ctx.globalCompositeOperation = "lighter";
        } else {
            c.h *= 0.1; c.s *= 0.6; c.l *= 0.4;
            ctx.fillStyle = HSLAString(c);
            ctx.globalCompositeOperation = "source-over";
        }

        ctx.fill();
    }

    ctx.restore();
    ctx.globalCompositeOperation = "source-over";
}
    drawGlow(ctx) {
        // GLOW
        ctx.globalCompositeOperation = "lighter";

        const c = { ...this.COLOR };
        c.a = 0.29;

        const glow = ctx.createRadialGradient(cx, cy, this.RADIUS * 0.9, cx, cy, this.RADIUS * 1.5);
        glow.addColorStop(0, HSLAString(c));
        c.h *= 0.25; c.s *= 0.99; c.l *= 0.99; c.a = 0;
        glow.addColorStop(1, HSLAString(c));

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS * 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
    }
    render(ctx, p, t) {
        this.drawCircle(ctx);
        this.drawGradient(ctx);
        this.drawBlobs(ctx, t);
        this.drawGlow(ctx);
    }
}

export default class Star {
    constructor(cfg, noise) {
        this.cfg = cfg;
        this.simplex = noise;
        this.COLOR = randomFrom(cfg.starColors);
        this.planets = [];
        this.hasPlanets = true;
        this.setPlanets(cfg);
        const zindex = mt_rand(0, cfg.DEPTH_SPREAD);
        this.setPosition(zindex);
        this.RADIUS = mt_rand(2, 5);
        this.BLOB_COUNT = this.RADIUS * 0.8;
        this.blobs = [];
        this.updateBlobs();
    }
    updateBlobs() {
        const points = 10;
        this.blobs = [];
        this.BLOB_COUNT = this.RADIUS * 0.8;
        for ( let i = 0; i < this.BLOB_COUNT; i++ ) {
            this.blobs.push({
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * this.RADIUS * 0.9,
            size: mt_rand(this.RADIUS / 10, this.RADIUS / 4),
            speed: 0.2 + Math.random() * 0.95,
            offset: mt_randf(0, 1000),
            shapeOffset: mt_randf(0, 1000),
            bright: Math.random() < 0.002,
            shape: Array.from({ length: points }, (_, j) =>
                    Math.sin(j / points * Math.PI * 2) * 0.5 + mt_randf(-0.3, 0.3)
                )
            });
        }
    }
    setPosition(zindex) {
        this.x = (Math.random() - 0.5) * this.cfg.width;
        this.y = (Math.random() - 0.5) * this.cfg.height;
        this.z = zindex;    
    }
    setPlanets(cfg) {
        this.planets = [];
        this.hasPlanets = Math.random() < 0.6;        
        if ( this.hasPlanets ) {
            const n = mt_rand(1, 5);
            for ( let i = 0; i < n; i++ ) {
                this.planets.push(new Planet(cfg));
            }
        }
    }
    drawCircle(ctx) {
        ctx.fillStyle = HSLAString(this.COLOR);
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
    drawGradient (ctx) {
        // GRADIENT BASE
        const c = { ...this.COLOR };
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, this.RADIUS);
        g.addColorStop(0, HSLAString(c));
        c.h *= 0.9; //mt_randf(-5, 5); // tiny variation only
        c.l *= 0.8; // or 0.5–0.8 range
        g.addColorStop(0.5, HSLAString(c));
        c.h *= 0.4;
        c.l *= 0.4;
        g.addColorStop(1, HSLAString(c));

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
    drawBlobs(ctx, t) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS, 0, Math.PI * 2);
        ctx.clip();

        const points = 10;
        const step = (Math.PI * 2) / points;

        for (let b of this.blobs) {

            // slow angular drift
            b.angle += 0.0015;

            // ONE noise call per blob
            const n = this.simplex.noise(
                Math.cos(b.angle) + t * b.speed,
                Math.sin(b.angle) + b.offset
            );

            const drift = n * 20;

            const x = cx + Math.cos(b.angle) * (b.dist + drift);
            const y = cy + Math.sin(b.angle) * (b.dist + drift);

            const baseR = b.size * (0.7 + n * 0.3);

            // small animated wobble (cheap)
            const wobble = this.simplex.noise(b.offset, t * 0.5);

            ctx.beginPath();

            for (let i = 0; i <= points; i++) {

                const a = i * step;

                // 👇 NO noise here anymore
                const rn = b.shape[i % points];

                const r = baseR + (rn + wobble * 0.5) * baseR * 0.4;

                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r;

                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }

            ctx.closePath();

            const c = { ...this.COLOR, a: 0.08 };

            if (b.bright) {
                ctx.fillStyle = HSLAString(c);
                ctx.globalCompositeOperation = "lighter";
            } else {
                c.h *= 0.1; c.s *= 0.6; c.l *= 0.4;
                ctx.fillStyle = HSLAString(c);
                ctx.globalCompositeOperation = "source-over";
            }

            ctx.fill();
        }

        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
    }
    drawGlow(ctx) {
        // GLOW
        ctx.globalCompositeOperation = "lighter";

        const c = { ...this.COLOR };
        c.a = 0.29;

        const glow = ctx.createRadialGradient(cx, cy, this.RADIUS * 0.9, cx, cy, this.RADIUS * 1.5);
        glow.addColorStop(0, HSLAString(c));
        c.h *= 0.25; c.s *= 0.99; c.l *= 0.99; c.a = 0;
        glow.addColorStop(1, HSLAString(c));

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, this.RADIUS * 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
    }
    render(ctx, p) {
        const radius = this.r * p.scale;
        const baseColor = HSLAString(this.color);

        // ----------------------------
        // STAR GLOW (key addition)
        // ----------------------------
        ctx.save();

        //ctx.shadowBlur = 12 * p.scale;
        //ctx.shadowColor = baseColor;

// clip to star
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.clip();

    // base fill
    ctx.fillStyle = baseColor;
    ctx.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2);

    // ----------------------------
    // BLOBS (boiling effect)
    // ----------------------------
    for (let b of this.blobs) {
        const bx = p.x + Math.cos(b.angle) * radius * b.dist;
        const by = p.y + Math.sin(b.angle) * radius * b.dist;
        const br = radius * b.size;

        // HSLA tint (same hue, darker/lighter)
        const c = {
            h: this.color.h,
            s: this.color.s - 40,
            l: this.color.l - 40 * b.strength,
            a: 0.45
        };

        ctx.fillStyle = HSLAString(c);

        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

        /*ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();*/
        if ( this.hasPlanets ) {
            for (let pl of this.planets) {
                pl.render(ctx, p);
            }
        }
    }
    update() {
        this.time += 0.005;

        // animate blobs
        for (let b of this.blobs) {
            const n = this.simplex.noise(
                this.time * 0.5,
                b.seed
            );

            b.angle += n * 0.05;              // slow drift
            b.dist += n * 0.01;              // slight wobble
            b.dist = Math.max(0, Math.min(1, b.dist));
        }
        if ( this.hasPlanets ) {   // planets always orbit
            for (let p of this.planets) 
                p.update();   
        }
    }
    // ----------------------------
    // RECYCLING (behind ship → ahead)
    // ----------------------------
    recycle(zindex) {
        this.setPlanets(this.cfg);
        this.setPosition(zindex);
    }
}