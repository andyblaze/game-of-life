import SprayFX from "./spray-fx.js";
import SparkleFX from "./sparkle-fx.js";
import colors from "./config.js";
import { mt_rand, randomFrom } from "./functions.js";

export class RomanCandle {
    constructor(x, y) {
        this.sparkle = new SparkleFX(x, y, 18, 80);
        this.candles = [
            new SprayFX(x, y, {lifetime:90, size:2, count:1, canReset:true, speed:1.5, "colors":randomFrom(colors), spread:mt_rand(20, 80)}),
            new SprayFX(960, 900, {size:2, count:1, canReset:true, speed:1.5, "colors":randomFrom(colors), spread:mt_rand(20, 30)})
        ];
    }
    updateAndDraw(dt, ctx) {
        this.sparkle.updateAndDraw(dt, ctx);
        for ( const c of this.candles )
            c.updateAndDraw(dt, ctx);
    }
} 