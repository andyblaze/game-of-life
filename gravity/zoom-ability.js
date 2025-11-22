import { mt_rand } from "./functions.js";
import BaseAbility from "./base-ability.js";

export default class ZoomAbility extends BaseAbility {
    constructor(eff) {
        super(eff);
        // Activation chance per frame (e.g. once per 5 seconds ≈ 1/(5*60))
        this.setChance(1 / (5 * 60));
        this.setDuration(mt_rand(6000, 12000)); // ms

        this.dragFactor = mt_rand(101, 106) / 100;//1.06;
        // Optional velocity boost on activation
        this.boost = mt_rand(3, 7);//2; // set to 0.5 if you want sparks
        this.baseDrag = this.eff.driftDrag;
    }

    // Do we trigger right now?
    shouldActivate() {
        return (false === this.active && Math.random() < this.chance);
    }
    activate(now) {
        this.doActivate(now);
        // Reduce drag
        this.eff.driftDrag = this.baseDrag * this.dragFactor;

        // Optional boost
        if ( this.boost !== 0 ) {
            this.eff.vX *= 1 + this.boost;
            this.eff.vY *= 1 + this.boost;
        }
    }
    restore() {
        this.eff.driftDrag = this.baseDrag;
    }
}
