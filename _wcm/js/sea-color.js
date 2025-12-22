import { config } from "./config.js";
import { lerpColor, randomFrom } from "./functions.js";

export default class SeaColor {
    constructor(targetSelector) {
        this.$el = targetSelector;
        // Sea moods / colors
        this.colors = config.sea_change.colors;
        this.current = { ...this.colors[0] };
        this.target = this.pickNewTarget();
        this.speed = config.sea_change.speed;
    }
    pickNewTarget() {
        let next;
        do {
            next = randomFrom(this.colors);
        } while ( next === this.target );
        return { ...next };
    }
    notify(dt) {
        dt = Math.min(dt, 100);
        const t = dt * this.speed;
        this.current = lerpColor(this.current, this.target, t);
        this.apply();
        if (this.isCloseEnough()) {
            this.target = this.pickNewTarget();
        }
    }
    isCloseEnough() {
        return (
            Math.abs(this.current.h - this.target.h) < 0.2 &&
            Math.abs(this.current.s - this.target.s) < 0.2 &&
            Math.abs(this.current.l - this.target.l) < 0.2
        );
    }
    apply() {
        const c = this.current;
        this.$el.css(
            "background-color",
            `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`
        );
    }
}