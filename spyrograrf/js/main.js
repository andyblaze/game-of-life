import Config from "./config.js";
import Renderer from "./renderer.js";
import Core from "./core.js";

const config = new Config("spiro");
const renderer = new Renderer(config);

const core = new Core(config);

let lastTimestamp = 0;
function loop(timestamp) { 
    if ( lastTimestamp === 0 ) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
    lastTimestamp = timestamp;

    const pos = core.getPoint(core.t);
    core.update(config.speed * dt);
    renderer.draw(pos.x, pos.y);

    requestAnimationFrame(loop);
}

loop(performance.now());
