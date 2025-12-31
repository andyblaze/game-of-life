import { clampMagnitude, normalize } from "./functions.js";

export default class SteeringSystem { 
    constructor(eventBus, perlin, feelers, wps) { 
        this.eventBus = eventBus;
        this.perlin = perlin;
        this.feelers = feelers;
        this.waypoint = null;
        this.waypointScanner = wps;
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
                chancePerMs: 0.0015,   // ≈ once few s
                minDuration: 2000,       // ms
                maxDuration: 7000,       // ms
                strength: 0.0052
            }
        };
        this.waypoint = this.waypointScanner.findWaypoint(this.playerPos, this.target);
        this.eventBus.emit("player:waypoint", this.waypoint);
        //console.log(this.waypoint);
        this.eventBus.on("player:moved", (data) => { 
            //if ( Math.random() < 20.01 )
                this.playerPos = { ...data }
        });
    }
    computeWander(dt) { 
        const wanderFreq     = 0.005;
        const wanderStrength = 0.24;//0.24;

        // --- advance time for Perlin ---
        this.time += dt;// * wanderFreq;

        // --- WANDER (Perlin-based angle) ---
        const n = this.perlin.noise(this.time, parseInt(Math.random() * 0.6)); // assume -1..1 or 0..1
        const angle = n * Math.PI * 2;

        const wanderX = Math.cos(angle) * wanderStrength;
        const wanderY = Math.sin(angle) * wanderStrength;
        return { wanderX, wanderY };
    }
    computePull() {
        const pullStrength = 0.25;//0.29;
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
        const maxSpeed = 1.0; 

        let { wanderX, wanderY } = this.computeWander(dt);
        let { pullX, pullY } = this.computePull();
        let { jitterX, jitterY } = this.computeJitter(dt);

        // 1. Compute intent (pull, wander, jitter)
        let intentX = pullX + wanderX + jitterX;
        let intentY = pullY + wanderY + jitterY;

        // 2. Compute avoidance
        const avoid = this.feelers.compute(this.playerPos, { vx: intentX, vy: intentY });
        const danger = this.feelers.computeDanger(this.playerPos, { vx: intentX, vy: intentY });

        const baseAvoid = 1.0; // tune this
        const avoidStrength = baseAvoid * danger;

        // 3. Scale intent by safety
        intentX *= (1 - danger);
        intentY *= (1 - danger);

        // 4. Combine
        let vx = intentX + (avoid.ax * avoidStrength);
        let vy = intentY + (avoid.ay * avoidStrength);

        // --- CLAMP SPEED ---
        const v = clampMagnitude(vx, vy, maxSpeed);
        vx = v.x;
        vy = v.y; 
        this.emit(vx, vy); 
    }
}