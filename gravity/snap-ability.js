export default class SnapAbility {
    constructor(eff) {
        this.eff = eff;

        // Move all snap parameters here
        this.snapThreshold = eff.snapThreshold;
        this.snapChance    = eff.snapChance;
        this.snapDuration  = eff.snapDuration;
        this.snapStrength  = eff.snapStrength;

        // State
        this.active = false;
        this.endTime = 0;
    }
    // ---- TRIGGER ----
    shouldActivate() {
        return (
            this.eff.strength > this.snapThreshold &&
            ! this.active &&
            Math.random() < this.snapChance
        );
    }
    // ---- ACTIVATE ----
    activate(now) {
        this.active = true;
        this.endTime = now + this.snapDuration;
        this.eff.strength = this.snapStrength;
    }
    // ---- UPDATE WHILE ACTIVE ----
    update(now) {
        if ( ! this.active) return false;

        if ( now >= this.endTime ) {
            this.active = false;
        }
        return this.active;
    }
}
