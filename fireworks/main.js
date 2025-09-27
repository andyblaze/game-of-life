import Rocket from "./rocket.js";
import SprayFX from "./spray-fx.js";
import SparkleFX from "./sparkle-fx.js";
import colors from "./config.js";
import { mt_rand, randomFrom } from "./functions.js";
import DeltaReport from "./delta-report.js";

const canvas = document.getElementById("onscreen");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let display = [];
for ( let i = 0; i < 12; i++ ) {
    display.push(new Rocket(mt_rand(200, 1720), 900));
}
for ( let i = 0; i < 3; i++ ) {
    //display.push(new SprayFX(mt_rand(200, 1720), 800, {size:0.5, count:12, canReset:true, speed:1.2, "colors":randomFrom(colors), spread:mt_rand(20, 40)}));
}
for ( let i = 0; i < 3; i++ ) {
    //display.push(new SprayFX(mt_rand(200, 1720), 900, {size:2, count:12, canReset:true, speed:1.2, "colors":randomFrom(colors), spread:mt_rand(20, 80)}));
}
display.push(new SparkleFX(960, 900, 18, 80));
display.push(new SprayFX(960, 900, {size:2, count:2, canReset:true, speed:1.5, "colors":randomFrom(colors), spread:mt_rand(20, 80)}));

//const rocket = new Rocket(960, 900);
const bg = new Image();
bg.src = "night-sky.jpg";
let lastTime = performance.now();
function loop(now) {
    requestAnimationFrame(loop);
    const dt = now - lastTime;
    lastTime = now;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    for ( const r of display)
        r.updateAndDraw(dt, ctx);
    //rocket.updateAndDraw(dt, ctx);
    //spray.updateAndDraw(dt, ctx);

    DeltaReport.log(now);
}

loop(lastTime);