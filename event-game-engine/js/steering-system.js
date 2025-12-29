import { clampMagnitude, normalize } from "./functions.js";

export default class SteeringSystem { 
    constructor(eventBus, perlin) { 
        this.eventBus = eventBus;
        this.perlin = perlin;
        this.target = { "x": 250, "y": 206 };
        this.playerPos = { "x": 573, "y": 118 };
        this.time = 0;
        this.jitter = {
            active: false,
            timeLeft: 0,
            x: 0,
            y: 0
        };
        this.cfg = {
            jitter: {
                chancePerMs: 0.000015,   // ≈ once every ~6–7s
                minDuration: 200,       // ms
                maxDuration: 1600,       // ms
                strength: 0.00252
            }
        };
        this.eventBus.on("player:moved", (data) => { 
            if ( Math.random() < 0.1 )
                this.playerPos = { ...data }
        });
    }
    computeWander(dt) { 
        const wanderFreq     = 0.0005;
        const wanderStrength = 0.4;

        // --- advance time for Perlin ---
        this.time += dt * wanderFreq;

        // --- WANDER (Perlin-based angle) ---
        const n = this.perlin.noise(this.time); // assume -1..1 or 0..1
        const angle = n * Math.PI * 2;

        const wanderX = Math.cos(angle) * wanderStrength;
        const wanderY = Math.sin(angle) * wanderStrength;
        return { wanderX, wanderY };
    }
    computePull() {
        const pullStrength   = 0.4;

        // --- PULL (towards target) ---
        const dx = this.target.x - this.playerPos.x;
        const dy = this.target.y - this.playerPos.y;

        const dir = normalize(dx, dy);

        const pullX = dir.x * pullStrength;
        const pullY = dir.y * pullStrength;
        return { pullX, pullY };
    }
    computeJitter(dt) {
        const j = this.jitter;
        const cfg = this.cfg.jitter;

        // --- if jitter is currently active ---
        if (j.active) {
            j.timeLeft -= dt;

            if (j.timeLeft <= 0) {
                j.active = false;
                j.timeLeft = 0;
            } else {
                return { "jitterX": j.x, "jitterY": j.y };
            }
        }

        // --- chance to trigger jitter (frame-rate independent) ---
        const roll = Math.random();
        const chanceThisFrame = cfg.chancePerMs * dt;

        if (roll < chanceThisFrame) {
            const angle = Math.random() * Math.PI * 2;
            const strength = cfg.strength;

            j.x = Math.cos(angle) * strength;
            j.y = Math.sin(angle) * strength;

            j.timeLeft =
                cfg.minDuration +
                Math.random() * (cfg.maxDuration - cfg.minDuration);

            j.active = true;

            return { "jitterX": j.x, "jitterY": j.y };
        }

        // --- no jitter this frame ---
        return { "jitterX": 0, "jitterY": 0 };
    }
    combine() {
        
    }
    emit(vx, vy) {
        if ( ! Number.isFinite(vx) || ! Number.isFinite(vy) ) return;
        this.eventBus.emit("player:steer", { vx, vy });
    }
    update(dt) {
        // --- tuning values (tweak freely) ---
        const maxSpeed       = 1.0; 

        const { wanderX, wanderY } = this.computeWander(dt);
        const { pullX, pullY } = this.computePull();
        const { jitterX, jitterY } = this.computeJitter(dt);
        // --- COMBINE ---
        let vx = wanderX + pullX + jitterX;
        let vy = wanderY + pullY + jitterY;

        // --- CLAMP SPEED ---
        const v = clampMagnitude(vx, vy, maxSpeed);
        vx = v.x;
        vy = v.y; 
        this.emit(vx, vy); 
    }
}