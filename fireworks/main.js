import Rocket from "./rocket.js";
import { RomanCandle } from "./firework-types.js";
import SprayFX from "./spray-fx.js";
import SparkleFX from "./sparkle-fx.js";
import colors from "./config.js";
import { mt_rand, randomFrom } from "./functions.js";
import DeltaReport from "./delta-report.js";

const canvas = document.getElementById("onscreen");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class FireworkDisplay {
    constructor() {
        this.fireworks = [];
    }
    add(f) {
        this.fireworks.push(f);
    }
    run(dt, ctx) {
        for ( const f of this.fireworks)
            f.updateAndDraw(dt, ctx);
    }
}

let display = new FireworkDisplay();
for ( let i = 0; i < 13; i++ ) {
    display.add(new Rocket(mt_rand(200, 1720), 900));
}
for ( let i = 0; i < 3; i++ ) {
    //display.push(new SprayFX(mt_rand(200, 1720), 800, {size:0.5, count:12, canReset:true, speed:1.2, "colors":randomFrom(colors), spread:mt_rand(20, 40)}));
}
for ( let i = 0; i < 3; i++ ) {
    //display.push(new SprayFX(mt_rand(200, 1720), 900, {size:2, count:12, canReset:true, speed:1.2, "colors":randomFrom(colors), spread:mt_rand(20, 80)}));
}
display.add(new RomanCandle(960, 900));

const bg = new Image();
bg.src = "night-sky.jpg";
let lastTime = performance.now();
function loop(now) {
    requestAnimationFrame(loop);
    const dt = now - lastTime;
    lastTime = now;
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    display.run(dt, ctx);
    DeltaReport.log(now);
}

loop(lastTime);