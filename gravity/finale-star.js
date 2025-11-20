import { mt_rand } from "./functions.js";

export default class FinaleStar {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.configure();
        // State
        this.phase = "idle";         // idle → grow → repel → idle
        this.phaseStart = 0;

        this.strength = 0;           // applied to particles
    }
    configure(configIdle=true) {
        // Configurable timings
        if ( true === configIdle )
            this.idleDuration  = mt_rand(36000, 42000);  // ms before starting next grow
        this.growDuration  = mt_rand(10000, 12000); // ms pulling 
        this.repelDuration = mt_rand(2800, 3800);  // ms burst 

        // Strengths
        this.pullStrength  = mt_rand(55, 75);     // strong pull
        this.repelStrength = -mt_rand(35, 55);   // strong burst        
    }
    update(now) {
        const t = now - this.phaseStart;

        // --- IDLE ---
        if ( this.phase === "idle" ) {
            this.strength = 0;
            this.configure(false);

            // Wait until idleDuration is over
            if (t >= this.idleDuration) {
                this.phase = "grow";
                this.phaseStart = now;
                this.idleDuration  = mt_rand(36000, 42000);
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