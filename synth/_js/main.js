import Config from "./config.js";
import Renderer from "./renderer.js";
import Core from "./core.js";
import { byId, byQsArray } from "./functions.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";
import Forces from "./forces.js";
import ThreeDee from "./three-dee.js";
import ColorTween from "./tweens.js";
import DeltaReport from "./delta-report.js";
import IO from "./io.js";
import DeviceChecker from "./device-checker.js";

const device = new DeviceChecker("screen-warning");
const config = new Config("spiro", "canvas-wrap", new TypeConverter());

const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(config);
const core = new Core(config);

const forces = new Forces(config);
const colorTween = new ColorTween(config);
const projection = new ThreeDee(config);

function resetAll() {
    core.reset();
    renderer.reset();
    forces.reset();
    projection.reset();
    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH);    
}

function screenSetup() {
    const screenData = device.checkSize();
    config.setupCanvas(screenData);
    uiControls.notify();
    resetAll();
}

window.addEventListener("resize", screenSetup);
window.addEventListener("orientationchange", screenSetup);

const exportBtn = byId("export");
const importBtn = byId("import");

if ( exportBtn ) 
    exportBtn.onclick = () => IO.export(config);
importBtn.onclick = () => {
    IO.import(config, uiControls);
    resetAll();
};

const geoCtrls = byQsArray("#ui-panel input.geometry");
for ( const ctrl of geoCtrls ) ctrl.onchange = () => { 
    resetAll();
};

let lastTimestamp = 0;

function loop(timestamp) { 
    if ( lastTimestamp === 0 ) 
        lastTimestamp = timestamp;

    const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
    lastTimestamp = timestamp;   

    const subSteps = Math.ceil(config.speed * 60) + 1;
    const stepDT = (config.speed * dt) / subSteps; //const stepDT = (config.speed * dt) * (dt / subSteps);
    projection.updateAngle();
    for ( let i = 0; i < subSteps; i++ ) {
        const pos = core.getPoint();
        forces.update(core.t, pos);
        core.update(stepDT);
        renderer.color = colorTween.update(stepDT);

        const projected = projection.update(pos, renderer.getColorAlpha());
        
        renderer.setColorAlpha(projected.a); // temporarily override renderer color alpha
        renderer.draw(projected.x, projected.y, stepDT);
        renderer.setColorAlpha(projected.prevAlpha); // restore alpha
    }
    DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", () => {
    byId("ui-panel").reset();
    screenSetup();
    loop(performance.now()); 
});

window.addEventListener("beforeunload", () => {
    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH);
});