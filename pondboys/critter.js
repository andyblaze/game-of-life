export default class Critter {
    constructor(cfg, type='prey') {
        this.x = Math.random() * cfg.width;
        this.y = Math.random() * cfg.height;
        this.vx = (Math.random() - 0.5) * cfg.maxSpeed;
        this.vy = (Math.random() - 0.5) * cfg.maxSpeed;
        this.r = 4 + Math.random() * cfg.maxRadius;
        //this.color = `hsla(${Math.random() * 360}, 70%, 60%, 1)`;
        this.energy = cfg[type].energyCap / 2; // start at half cap
        this.energyCap = cfg[type].energyCap;
        this.reproductionCost = cfg[type].reproductionCost;
        this.type = type;
        // assign color based on type
        if (type === 'predator') {
            const hue = Math.random() * 40; // red/orange: 0°–40°
            this.color = `hsla(${hue}, 80%, 50%, 1)`;
        } else {
            const hue = 180 + Math.random() * 80; // blue-ish: 180°–260°
            this.color = `hsla(${hue}, 70%, 60%, 1)`;
        }
        this.cfg = cfg;
        this.maxSpeed = cfg.maxSpeed;
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x += this.cfg.width;
        if (this.x > this.cfg.width) this.x -= this.cfg.width;
        if (this.y < 0) this.y += this.cfg.height;
        if (this.y > this.cfg.height) this.y -= this.cfg.height;

        this.energy -= 0.05; // moving costs energy
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