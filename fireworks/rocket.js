import SprayFX from "./spray-fx.js";
import { colors, superRandomColors } from "./config.js";
import { mt_rand, randomFrom } from "./functions.js";
export class Rocket {
    config = {
        launch: {jitter:randomFrom([true, false]), count:1, lifetime:120, maxTrail:12, "colors": colors},
        explosion: {count:36, lifetime:120, spread:360, maxTrail:16, speed:1.2, "colors": colors}
    };
    constructor(x, y, config={}) {
        this.originalX = x;
        this.originalY = y;
        this.launchTime = randomFrom([2, 3, 5, 7, 11, 13, 17]) * 60;
        this.countdown = 0;
        this.config.explosion.count = config.explosionCount ?? this.config.explosion.count;
        this.config.launch.speed = config.launchSpeed ?? this.config.launch.speed;
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

export class BurstoRocket extends Rocket {
    config = {
        launch: {jitter:randomFrom([true, false]), count:1, lifetime:120, maxTrail:12, "colors": colors},
        explosion: {count:36, lifetime:120, spread:360, maxTrail:36, speed:1.2, "colors": colors}
    };
    constructor(x, y) {
        super(x, y);
    }
    initExplosion() {
        const p = this.launch.getParticle(0);
        this.config.explosion.colors = superRandomColors(this.config.explosion.count);
        this.explosion = new SprayFX(p.x, p.y, this.config.explosion);
        const half = this.config.explosion.count / 2;
        for ( let i = 0; i < half; i++ ) {
            const p = this.explosion.getParticle(i);
            p.color = { h: 0, s: "0%", l: "100%", a: 1 }; 
            p.lifetime = 60;

            // Keep them clustered by lowering speed AND tightening spread
            p.speed = 0.3 + Math.random() * 0.2;  // very small random speed
            p.vx *= p.speed;  // scale down existing velocity
            p.vy *= p.speed;  // scale down existing velocity
        }
        this.exploded = true;
    }
    explode(dt, ctx) {
        this.explosion.updateAndDraw(dt, ctx);
        if ( this.explosion.inActive() )
            this.reset(this.originalX, this.originalY);
    }
    
}