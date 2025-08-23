import { clamp, mt_rand } from "./functions.js";

export default class Critter {
    constructor(cfg, type='prey') {
        this.cfg = cfg;
        this.type = type;
        this.typeCfg = cfg[type];
        this.initPostition(cfg);
        this.initProperties();
    }
    initProperties() {
        this.energy = this.typeCfg.energyCap / 2; // start at half cap
        this.energyCap = this.typeCfg.energyCap;
        this.reproductionCost = this.typeCfg.reproductionCost;
        // assign color based on type
        if (this.type === 'predator') {
            const hue = Math.random() * 40; // red/orange: 0°–40°
            this.color = `hsla(${hue}, 80%, 50%, 1)`;
        } else {
            const hue = 180 + Math.random() * 80; // blue-ish: 180°–260°
            this.color = `hsla(${hue}, 70%, 60%, 1)`;
        }
        this.maxSpeed = this.cfg.maxSpeed;
    }
    initPostition(cfg) {
        this.x = mt_rand(0, cfg.width);
        this.y = mt_rand(0, cfg.height);
        this.vx = (Math.random() - 0.5) * cfg.maxSpeed;
        this.vy = (Math.random() - 0.5) * cfg.maxSpeed;
        this.r = mt_rand(4, cfg.maxRadius);
    }
    wraparoundEdges() {
        if (this.x < 0) this.x += this.cfg.width;
        if (this.x > this.cfg.width) this.x -= this.cfg.width;
        if (this.y < 0) this.y += this.cfg.height;
        if (this.y > this.cfg.height) this.y -= this.cfg.height;
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.wraparoundEdges();
        
        const lostEnergy = this.typeCfg.movementCost;
        this.energy = clamp(this.energy - lostEnergy, 0, this.energyCap) // moving costs energy
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // energy -> alpha
        const alpha = Math.min(this.energy / 100, 1);
        ctx.fillStyle = this.color.replace(/[\d\.]+\)$/g, `${alpha})`);
        ctx.fill();
    }
}