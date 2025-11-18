export default class SnapAbility {
    constructor(eff) {
        this.eff = eff;
        // State
        this.active = false;
        this.endTime = 0;        
        this.snapThreshold = 6;
        this.snapStrength  = Math.random() > 0.5 ? 20 : -20;
        this.snapDuration  = 1000; //ms 
        this.snapChance = 1 / (5 * 60); // 1 in ( x seconds * fps )
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
