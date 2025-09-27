import SprayFX from "./spray-fx.js";
import colors from "./config.js";
import { mt_rand, randomFrom } from "./functions.js";
export default class Rocket {
    config = {
        launch: {count:1, lifetime:120, maxTrail:12, "colors": colors},
        explosion: {count:36, lifetime:120, spread:360, maxTrail:16, speed:1.2, "colors": colors}
    };
    constructor(x, y) {
        this.originalX = x;
        this.originalY = y;
        this.launchTime = randomFrom([2, 3, 5, 7, 11, 13, 17]) * 60;
        this.countdown = 0;
        this.reset(x, y);
    }
    reset(x, y) {
        this.config.launch.colors = randomFrom(colors);
        this.launch = new SprayFX(x, y, this.config.launch);
        this.exploded = false;
        this.explosion = null;
        this.countdown = 0;
    }
    initExplosion() {
        const p = this.launch.getParticle(0);
        this.config.explosion.colors = randomFrom(colors);
        this.explosion = new SprayFX(p.x, p.y, this.config.explosion);
        this.exploded = true;
    }
    explode(dt, ctx) {
        this.explosion.updateAndDraw(dt, ctx);
        if ( this.explosion.inActive() )
            this.reset(this.originalX, this.originalY);
    }
    updateAndDraw(dt, ctx) {
        this.countdown++;
        if ( this.countdown < this.launchTime ) return;
        if ( this.launch.active() ) {
            this.launch.updateAndDraw(dt, ctx);
        }
        else {
            if ( this.explosion === null ) {
                this.initExplosion();
            }
            this.explode(dt, ctx);
        }
    }
}