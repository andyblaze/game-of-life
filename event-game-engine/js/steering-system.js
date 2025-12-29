import { clampMagnitude, normalize } from "./functions.js";

export default class SteeringSystem { 
    constructor(eventBus, perlin) {
        this.eventBus = eventBus;
        this.perlin = perlin;
        this.target = { "x": 0, "y": 326 };
        this.playerPos = { "x": 573, "y": 118 };
        this.time = 0;
    }
    update(dt) {
        // --- tuning values (tweak freely) ---
        const wanderStrength = 0.4;
        const pullStrength   = 0.6;
        const maxSpeed       = 1.0;
        const wanderFreq     = 0.0005;

        // --- advance time for Perlin ---
        this.time += dt * wanderFreq;

        // --- WANDER (Perlin-based angle) ---
        const n = this.perlin.noise(this.time); // assume -1..1 or 0..1
        const angle = n * Math.PI * 2;

        const wanderX = Math.cos(angle) * wanderStrength;
        const wanderY = Math.sin(angle) * wanderStrength;

        // --- PULL (towards target) ---
        const dx = this.target.x - this.playerPos.x;
        const dy = this.target.y - this.playerPos.y;

        const dir = normalize(dx, dy);

        const pullX = dir.x * pullStrength;
        const pullY = dir.y * pullStrength;

        // --- COMBINE ---
        let vx = wanderX + pullX;
        let vy = wanderY + pullY;

        // --- CLAMP SPEED ---
        const v = clampMagnitude(vx, vy, maxSpeed);
        vx = v.x;
        vy = v.y; 

        if ( ! Number.isFinite(vx) || ! Number.isFinite(vy) ) return;
        // --- OUTPUT ---
        this.eventBus.emit("player:steer", { vx, vy });
    }
}