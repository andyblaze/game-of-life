import Config from "./config.js";
import Renderer from "./renderer.js";
import Core from "./core.js";
import { byId } from "./functions.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";

const config = new Config("spiro", "workspace", new TypeConverter());
const renderer = new Renderer(config);
const core = new Core(config);

const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

byId("ui-panel").reset();

let paused = true;
byId("go-btn").onclick = () => { paused = !paused; }


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

if ( paused === false )
    loop(performance.now()); 
