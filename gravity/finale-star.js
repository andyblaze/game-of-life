export default class FinaleStar {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // Configurable timings
        this.idleDuration  = 30000;  // ms before starting next grow
        this.growDuration  = 12000; // ms pulling (unchanged)
        this.repelDuration = 2800;  // ms burst (unchanged)

        // Strengths
        this.pullStrength  = 65;     // gentle pull
        this.repelStrength = -34;   // strong burst

        // State
        this.phase = "idle";         // idle → grow → repel → idle
        this.phaseStart = 0;

        this.strength = 0;           // applied by particles
    }
    update(now) {
        const t = now - this.phaseStart;

        // --- IDLE ---
        if (this.phase === "idle") {
            this.strength = 0;

            // Wait until idleDuration is over
            if (t >= this.idleDuration) {
                this.phase = "grow";
                this.phaseStart = now;
            }
            return;
        }

        // --- GROW ---
        if (this.phase === "grow") {
            const k = t / this.growDuration;

            if (k < 1) {
                this.strength = this.pullStrength * k; // linear ease-in
            } else {
                // transition to repulsion
                this.phase = "repel";
                this.phaseStart = now;
                this.strength = this.repelStrength;
            }
            return;
        }

        // --- REPEL ---
        if (this.phase === "repel") {
            if (t >= this.repelDuration) {
                // back to idle
                this.phase = "idle";
                this.phaseStart = now;
                this.strength = 0;
            }
            return;
        }
    }
    draw(ctx) {}
}