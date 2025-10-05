import { Point } from "./functions.js";

export default class Star {
    constructor(config, extra) {
        this.cfg = { ...config, ...extra };
        this.cfg.canvasSz = Point(config.canvasW, config.canvasH);
        this.cfg.scale = config.visualScale;
        this.cfg.dpr = config.DPR;
        this.hue = this.cfg.hue;
        this.mass = config.mass;
        this.pos = {x:0,y:0};
        this.vel = {x:0,y:0};
        this.radius = config.radius;
    } 
    worldToScreen(p){
        return Point(
            this.cfg.canvasSz.x / this.cfg.dpr * 0.5 + p.x * this.cfg.scale,
            this.cfg.canvasSz.y / this.cfg.dpr * 0.5 + p.y * this.cfg.scale
        );
    }
    draw(ctx) {
        const screen = this.worldToScreen(this.pos);
        const r = Math.max(3, this.radius * this.cfg.scale); 
        // small bright core
        ctx.fillStyle = `hsla(${this.hue},100%,70%,1)`;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
    setPosition(x, y) {
        this.pos = Point(x, y);
    }
    setVelocity(vx, vy) {
        this.vel = Point(vx, vy);
    }
}