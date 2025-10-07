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
        this.radius = config.radius;
        this.phase = Math.random() * Math.PI * 2;
        this.pulseRate = this.cfg.pulseRate;
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
    }
    draw(ctx) {
        const screen = this.worldToScreen(this.pos);
        const r = Math.max(3, this.radius * this.cfg.scale); 
        // small bright core
        ctx.fillStyle = hslaStr(this.color);
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, r * 0.8, 0, Math.PI * 2);
        ctx.fill();

    // --- small black blob for rotation ---
    const spotRadius = r * 0.15;         // small spot
    const spotAngle = this.phase;        // we can reuse phase for now
    const spotDist = r * 0.5;            // distance from center
    const bx = screen.x + Math.cos(spotAngle) * spotDist;
    const by = screen.y + Math.sin(spotAngle) * spotDist;

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.arc(bx, by, spotRadius, 0, Math.PI * 2);
    ctx.fill();
    }
    setPosition(x, y) {
        this.pos = Point(x, y);
    }
    setVelocity(vx, vy) {
        this.vel = Point(vx, vy);
    }
}