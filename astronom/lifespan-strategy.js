//import { lerpColor } from "./functions.js";

class Lifespan {
    constructor() {}
    update(item) {}
}

class NewbornStar {
    constructor(x, y, baseAngle, cfg, global) {
        // Base position
        this.x = x;
        this.y = y;

        // Launch angle with random variance
        const angle = baseAngle + (Math.random() - 0);//.5);// * cfg.launchArc;
        
        const endpoint = this.findEdgeIntersection(x, y, angle, global.width, global.height);
        const minTravel = endpoint.dist / 1.5;
        this.slowdown = 0.98;  // velocity decay per frame
        const requiredSpeed = minTravel * (1 - this.slowdown);
        // Back-calculate required initial speed so that
        // total distance (with exponential decay) ≥ minTravel
        // Total travel distance = initialSpeed / (1 - decayFactor)
        const decayFactor = 0.98;
        const speed = Math.max(cfg.launchSpeed, minTravel * (1 - decayFactor));

        // Launch speed with a tiny random variation
        // const speed = cfg.launchSpeed * (0.8 + Math.random() * 0.4) + 5;
        this.vx = Math.cos(angle) * Math.max(cfg.launchSpeed, requiredSpeed);
        this.vy = Math.sin(angle) * Math.max(cfg.launchSpeed, requiredSpeed);
        // this.vx = Math.cos(angle) * speed;
        // this.vy = Math.sin(angle) * speed;

        // Appearance
        const col = cfg.starColors[Math.floor(Math.random() * cfg.starColors.length)];
        this.color = `rgba(${col.join(",")})`;
        this.size = Math.round(cfg.starSize[0] + Math.random() * (cfg.starSize[1] - cfg.starSize[0]));

        // Movement / lifecycle
        this.minSpeed = 0.05;  // below this, star is considered settled
        this.settled = false;
        this.state = "moving";
        this.added = false;
    }
    findEdgeIntersection(x, y, angle, width, height) {
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);

      let tMax = Infinity;

      // Check each boundary intersection (parametric line: x + t*dx, y + t*dy)
      if (dx > 0) tMax = Math.min(tMax, (width - x) / dx);
      if (dx < 0) tMax = Math.min(tMax, (0 - x) / dx);
      if (dy > 0) tMax = Math.min(tMax, (height - y) / dy);
      if (dy < 0) tMax = Math.min(tMax, (0 - y) / dy);

      return {
        x: x + dx * tMax,
        y: y + dy * tMax,
        dist: Math.sqrt((dx * tMax) ** 2 + (dy * tMax) ** 2)
      };
    }
    update() {
        if ( this.settled === false ) {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.slowdown;
            this.vy *= this.slowdown;

            if (Math.hypot(this.vx, this.vy) < this.minSpeed) {
                this.settled = true;
                this.state = "stopped";
            }
        }
    }
    isSettled() {
        return ( this.settled === true && this.state === "stopped" );
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        this.update();
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
        this.settled = false;
        this.state = "buildup";
    }
    createColor() {
        const hue = 280 - 200 * this.charge;     // magenta → blue → cyan range
        const saturation = 70 + 30 * this.charge; // more intense with charge
        const lightness = 40 + 40 * this.charge;  // brighter near full charge
        const alpha = 0.2 + (0.6 * this.charge);    // fade in
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    }
    resetState() {
        this.state = "buildup";
        this.starBorn = false;
        this.newborn = null;
        this.settled = false;  
        this.charge = 0;
        this.dustParticles = [];
        this.startTime = performance.now();
    }    
    update(cfg, global) {   
        this.charge = Math.min(1, (performance.now() - this.startTime) / cfg.buildTime);
        if (Math.random() < cfg.dustDensity * this.charge) {
            const angle = Math.random() * Math.PI * 2;
            const maxR = cfg.patchRadius * (1 - this.charge); // shrink inward
            const r = Math.random() * maxR;
            this.dustParticles.push({
                x: cfg.pos.x + (global.width / 2) + Math.cos(angle) * r,
                y: cfg.pos.y + (global.height / 2) + Math.sin(angle) * r,
                color: this.createColor()
            });
        }
        //When fully charged → spawn a newborn star
        if (this.charge >= 1 && this.starBorn === false) {
            this.state = "launching";
            // 0 = to the right, Math.PI/2 = down, etc.
            const baseAngle = Math.random() * Math.PI * 2; // launch in any direction
            // small scatter
            const angle = baseAngle + (Math.random() - 0.5) * cfg.launchArc;

            this.newborn = new NewbornStar(
                cfg.pos.x + global.width / 2,
                cfg.pos.y + global.height / 2,
                angle,
                cfg, global
            );
            if ( this.newborn !== null && this.newborn.settled === true )
                this.newborn = null;
            //this.starBorn = true;        // mark that the star has been launched
            this.dustParticles = [];
            this.startTime = performance.now(); // reset for dust fade / next cycle
        }
        return {"dust": this.dustParticles, "newborn": this.newborn };
    }
}
export class Type2Lifespan extends Lifespan {}
export class Type3Lifespan extends Lifespan {}

