//import { lerpColor } from "./functions.js";

class Lifespan {
    constructor() {}
    update(item) {}
}

class NewbornStar {
    constructor(x, y, baseAngle, cfg) {
        // Base position
        this.x = x;
        this.y = y;

        // Launch angle with random variance
        const angle = baseAngle + (Math.random() - 0.5) * cfg.launchArc;

        // Launch speed with a tiny random variation
        const speed = cfg.launchSpeed * (0.8 + Math.random() * 0.4);

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        // Appearance
        const col = cfg.starColors[Math.floor(Math.random() * cfg.starColors.length)];
        this.color = `rgba(${col.join(",")})`;
        this.size = Math.round(cfg.starSize[0] + Math.random() * (cfg.starSize[1] - cfg.starSize[0]));

        // Movement / lifecycle
        this.slowdown = 0.98;  // velocity decay per frame
        this.minSpeed = 0.05;  // below this, star is considered settled
        this.settled = false;
    }

    update() {
        if (!this.settled) {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.slowdown;
            this.vy *= this.slowdown;

            if (Math.hypot(this.vx, this.vy) < this.minSpeed) {
                this.settled = true;
            }
        }
    }

    draw(ctx) {
        this.update();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Convert to polar coords for starfield
    toStar(global) {
        const dx = this.x - global.width / 2;
        const dy = this.y - global.height / 2;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        return {
            radius,
            angle,
            size: this.size,
            color: this.color
        };
    }
}

export class Type1Lifespan extends Lifespan {
    constructor() {
        super();
        this.dustParticles = []; // → array of current specks.
        this.charge = 0; // 0..1 → how “ready” the nursery is (fraction of buildTime).
        this.lastUpdate = 0; // → timestamp for time-based growth.
        this.startTime = performance.now();
        this.starBorn = false;
        this.newborn = null;
    }
    update(cfg, global) {
        this.charge = Math.min(1, (performance.now() - this.startTime) / cfg.buildTime);
        if (Math.random() < cfg.dustDensity * this.charge) {
            const angle = Math.random() * Math.PI * 2;
            const maxR = cfg.patchRadius * (1 - this.charge); // shrink inward
            const r = Math.random() * maxR;
            const hue = 280 - 200 * this.charge;     // magenta → blue → cyan range
            const saturation = 70 + 30 * this.charge; // more intense with charge
            const lightness = 40 + 40 * this.charge;  // brighter near full charge
            const alpha = 0.2 + (0.6 * this.charge);    // fade in
            this.dustParticles.push({
                x: cfg.pos.x + (global.width / 2) + Math.cos(angle) * r,
                y: cfg.pos.y + (global.height / 2) + Math.sin(angle) * r,
                color: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
            });
        }
        //When fully charged → spawn a newborn star
        if (this.charge >= 1 && this.starBorn === false) {
            // 0 = to the right, Math.PI/2 = down, etc.
            const baseAngle = Math.random() * Math.PI * 2; // launch in any direction
            // small scatter
            const angle = baseAngle + (Math.random() - 0.5) * cfg.launchArc;

            this.newborn = new NewbornStar(
                cfg.pos.x + global.width / 2,
                cfg.pos.y + global.height / 2,
                angle,
                cfg
            );
            this.starBorn = true;        // mark that the star has been launched
            this.startTime = performance.now(); // reset for dust fade / next cycle
        }
        return {dust: this.dustParticles, newborn: this.newborn };
    }
}
export class Type2Lifespan extends Lifespan {}
export class Type3Lifespan extends Lifespan {}

