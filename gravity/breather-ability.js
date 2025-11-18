import BaseAbility from "./base-ability.js";
import { mt_rand } from "./functions.js";

export default class BreatherAbility extends BaseAbility {
    constructor(eff) {
        super(eff);
        // State
        eff.period = mt_rand(1800, 2000);
        eff.radius = 12;
        eff.strength = 1.5;
        eff.baseStrength = 1.5;
    }
    shouldActivate() {
        return true;
    }
    activate(now) {}
    update(now, t) {
        this.eff.strength = this.eff.baseStrength * Math.sin((t / this.eff.period) * 2 * Math.PI);
        return true;
    }
    restore(eff, t) {}
}
