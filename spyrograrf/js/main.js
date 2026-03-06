import Config from "./config.js";
import Renderer from "./renderer.js";
import Core from "./core.js";
import { byId } from "./functions.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";

const config = new Config("spiro", "workspace", new TypeConverter());

const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(config);
const core = new Core(config);

byId("ui-panel").reset();

let paused = true;
byId("go-btn").onclick = () => { core.init(config); paused = !paused; }


let lastTimestamp = 0;
function loop(timestamp) { 
    if ( paused === false ) {
        if ( lastTimestamp === 0 ) lastTimestamp = timestamp;
        const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
        lastTimestamp = timestamp;

        
        const subSteps = Math.ceil(config.speed * 20) + 1;
        const stepDT = (config.speed * dt) * (dt / subSteps);
        for (let i = 0; i < subSteps; i++) {
            const pos = core.getPoint(core.t);
            core.update(stepDT);
            renderer.draw(pos.x, pos.y, dt); 
        }
    }
    requestAnimationFrame(loop);
}

loop(performance.now()); 
