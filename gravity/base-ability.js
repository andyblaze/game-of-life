export default class BaseAbility {
    constructor(eff) {
        this.eff = eff;
        // Internal state
        this.active = false;
        this.endTime = 0;
    }
    setDuration(d) {  // ms
        this.duration = d;
    }
    setChance(c) {
        this.chance = c;
    }
    doActivate(now) {
        this.active = true;
        this.endTime = now + this.duration;        
    }
    update(now) {
        if ( false === this.active ) return false;

        if ( now >= this.endTime ) {
            this.active = false;
            return false;
        }
        return true;
    }
}