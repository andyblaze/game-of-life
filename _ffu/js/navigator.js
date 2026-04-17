import { mt_randf, randomOutside} from "./functions.js";

export default class Navigator {
    constructor() {

    }
    steer(ship) {
        // speed decisions
        if (Math.random() < 0.1 && ship.isAtSpeed()) {
            ship.setThrottle(mt_randf(0, 3));
        }
        // direction decisions
        if (Math.random() < 0.016 && ship.isAtPosition()) {
            let sx = randomOutside(200, 400);
            let sy = randomOutside(50, 150);
            // ----------------------------
            // CENTRE BIAS
            // ----------------------------
            const biasStrength = 0.15; // small nudge, not dominant
            sx += (-ship.x) * biasStrength;
            sy += (-ship.y) * biasStrength;
            ship.setThrusters(sx, sy);
        }
    }
}
