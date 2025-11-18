import BaseAbility from "./base-ability.js";

export default class SnapAbility extends BaseAbility {
    constructor(eff) {
        super(eff);
        // Activation chance per frame (e.g. once per 5 seconds ≈ 1/(5*60))
        this.setChance(1 / (5 * 60));
        this.setDuration(1000); // ms
        this.eff = eff;
        // State
        this.snapThreshold = 6;
        this.snapStrength  = Math.random() > 0.5 ? 20 : -20;
    }
    shouldActivate() {
        return (
            this.eff.strength > this.snapThreshold &&
            false === this.active &&
            Math.random() < this.chance
        );
    }
    activate(now) {
        this.doActivate(now);
        this.eff.strength = this.snapStrength;
    }
    restore(eff, t) {
        eff.applyStrength(t);
    }
}
