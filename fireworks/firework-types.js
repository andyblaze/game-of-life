import SprayFX from "./spray-fx.js";
import SparkleFX from "./sparkle-fx.js";
import { Rocket } from "./rocket.js";
import { colors } from "./config.js";
import { mt_rand, randomFrom } from "./functions.js";

export class RomanCandle {
    constructor(x, y) {
        this.sparkle = new SparkleFX(x, y, 18, 80);
        this.candles = [
            new SprayFX(x, y, {lifetime:90, size:2, count:1, canReset:true, speed:1.6, "colors":randomFrom(colors), spread:mt_rand(0, 1)}),
            new SprayFX(x, y, {size:2, count:1, canReset:true, speed:1.5, "colors":randomFrom(colors), spread:mt_rand(0, 1)}),
            new Rocket(x, y, {explosionCount:4, launchSpeed:0.3})
        ];
    }
    updateAndDraw(dt, ctx) {
        this.sparkle.updateAndDraw(dt, ctx);
        for ( const c of this.candles )
            c.updateAndDraw(dt, ctx);
    }
} 