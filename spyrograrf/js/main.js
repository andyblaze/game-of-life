import Config from "./config.js";
import Renderer from "./renderer.js";
import MultiPenRenderer from "./mulltipen-renderer.js";
import Core from "./core.js";
import { byId, byQsArray } from "./functions.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";
import Forces from "./forces.js";
import ColorTween from "./tweens.js";

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    return isPortrait;
}

function updateWarning() {
    const warning = byId("rotate-warning");
    warning.style.display = checkOrientation() ? "block" : "none";
}

window.addEventListener("resize", updateWarning);
window.addEventListener("orientationchange", updateWarning);

updateWarning();

const config = new Config("spiro", "workspace", new TypeConverter());

const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(config);
const core = new Core(config);

byId("ui-panel").reset();

const forces = new Forces(config);
const ct = new ColorTween(config);

const geoCtrls = byQsArray("#ui-panel input.geometry");
for ( const ctrl of geoCtrls ) ctrl.onchange = () => { 
    core.reset();
    renderer.reset();
    forces.reset();
    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH); 
};


let lastTimestamp = 0;
function loop(timestamp) { 
    if ( lastTimestamp === 0 ) lastTimestamp = timestamp;

    const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
    lastTimestamp = timestamp;
    
    const subSteps = Math.ceil(config.speed * 60) + 1;
    const stepDT = (config.speed * dt) * (dt / subSteps);
    for ( let i = 0; i < subSteps; i++ ) {
        const pos = core.getPoint();
        forces.update(core.t, pos);
        core.update(stepDT);
        renderer.color = ct.update(stepDT);
        /*renderer.pens[1].color = ct.update(stepDT);
        renderer.pens[1].offsetX = Math.sin(core.t * 0.5) * 100;
        renderer.pens[1].offsetY = Math.cos(core.t * 0.5) * 100;*/
        renderer.draw(pos.x, pos.y, stepDT); 
    }

    requestAnimationFrame(loop);
}

loop(performance.now()); 
