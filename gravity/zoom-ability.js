import { mt_rand } from "./functions.js";

export default class ZoomAbility {
    constructor(eff) {
        this.eff = eff;
        // Activation chance per frame (e.g. once per 5 seconds ≈ 1/(5*60))
        this.chance = (1 / (5 * 60));

        // How long the zoom lasts
        this.duration = mt_rand(3000, 6000); // ms

        // Drag multiplier during zoom (0 = no drag, <1 means reduced drag)
        this.dragFactor = mt_rand(103, 106) / 100;//1.06;

        // Optional velocity boost on activation
        this.boost = mt_rand(1,3);//2; // set to 0.5 if you want sparks

        // Internal state
        this.active = false;
        this.endTime = 0;
        this.baseDrag = this.eff.driftDrag;
    }

    // Do we trigger right now?
    shouldActivate(now) {
        return (false === this.active && Math.random() < this.chance);
    }
    // Activates zoom mode
    activate(now) {
        this.active = true;
        this.endTime = now + this.duration;

        // Reduce drag
        this.eff.driftDrag = this.baseDrag * this.dragFactor;

        // Optional boost
        if ( this.boost !== 0 ) {
            this.eff.vX *= 1 + this.boost;
            this.eff.vY *= 1 + this.boost;
        }
    }
    // Called every frame while active
    update(now) {
        if ( false === this.active ) return false;

        if ( now >= this.endTime ) {
            this.active = false;
            return false;
        }
        return true;
    }

    // Restore original effector properties
    restore() {
        this.eff.driftDrag = this.baseDrag;
    }
}
