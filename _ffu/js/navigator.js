import { mt_rand, mt_randf, randomOutside } from "./functions.js";

export default class Navigator {
    constructor() {
        this.mode = "pausing";
        this.pauseTime = 0;
        this.pauseLength = 0;
        this.target = { x: 0, y: 0 };
    }

    steer(ship, dt = 16) {
        // ----------------------------
        // STATE MACHINE
        // ----------------------------

        // 1. CHOOSING TARGET
        if (this.mode === "choosing") {

            let sx = randomOutside(200, 400);
            let sy = randomOutside(50, 150);

            // small centre bias
            const biasStrength = 0.15;
            sx += (-ship.x) * biasStrength;
            sy += (-ship.y) * biasStrength;

            this.target.x = ship.x + sx;
            this.target.y = ship.y + sy;
            this.pauseLength = mt_rand(2000, 4000);

            ship.setThrusters(sx, sy);
            ship.setThrottle(mt_randf(5, 9));

            this.mode = "traveling";
        }

        // 2. TRAVELING
        else if (this.mode === "traveling") {

            if (ship.isAtPosition()) {
                this.mode = "pausing";
                this.pauseTime = 0;
            }
        }

        // 3. PAUSING
        else if (this.mode === "pausing") {

            this.pauseTime += dt;
            ship.setThrottle(0);

            // ~1–2 seconds pause (tweak freely)
            if (this.pauseTime > this.pauseLength) {
                this.mode = "choosing";
            }
        }
    }
}
