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
        this.radius = 4;//mt_rand(4, cfg.maxRadius);
    }
    wraparoundEdges() {
        if (this.x < 0) this.x += this.cfg.width;
        if (this.x > this.cfg.width) this.x -= this.cfg.width;
        if (this.y < 0) this.y += this.cfg.height;
        if (this.y > this.cfg.height) this.y -= this.cfg.height;
    }
    update() {
        // grow based on energy surplus or a fixed rate
        const growthRate = 0.02 * (this.energy / this.energyCap);
        this.radius = Math.min(this.radius + growthRate, this.cfg.maxRadius);
    }
    canSpawn() {
        const handicap = (this.type === "predator" && Math.random() < 0.1 ? false : true);
        return (handicap && this.energy >= this.typeCfg.reproductionThreshold && this.radius === this.cfg.maxRadius);
    }
    spawn(cfg, type) {
        const baby = new Critter(cfg, type);
        // optionally mutate traits here
        baby.x = this.x + (Math.random() - 0.5) * 10;
        baby.y = this.y + (Math.random() - 0.5) * 10;
        baby.energy = this.typeCfg.reproductionCost;
        this.energy = clamp(this.energy - this.typeCfg.reproductionCost, 0, this.energyCap);
        this.radius = 4;
        return baby;
    }
    move() {
        this.update();
        this.x += this.vx;
        this.y += this.vy;
        
        this.wraparoundEdges();
        
        const lostEnergy = this.typeCfg.movementCost;
        this.energy = clamp(this.energy - lostEnergy, 0, this.energyCap) // moving costs energy
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        // energy -> alpha
        const alpha = Math.min(this.energy / 100, 1);
        ctx.fillStyle = this.color.replace(/[\d\.]+\)$/g, `${alpha})`);
        ctx.fill();
    }
}