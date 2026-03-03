import { byId, byQsArray } from "./functions.js";
import Emitter from "./emitter.js";
import TypeConverter from "./typeconverter.js";
import Cfg from "./config.js";
import UiControls from "./uicontrols.js";
import IO from "./io.js";
import RendererFactory from "./renderer-factory.js";
import ParticleForces from "./particle-forces.js";
import TooltipHelp from "./tooltips.js";
import DeltaReport from "./delta-report.js";
import DeviceTester from "./device-tester.js";
import OffScreenCanvas from "./offscreen-canvas.js";

const device = new DeviceTester("screen-warning", "continue-btn"); 
device.test(); 


const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

byId("ui-panel").reset();

if ( byId("export") ) 
    byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => {
    emitter.clear();
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    IO.import(config, uiControls);
};

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

const rendererFactory = new RendererFactory(byId("renderer-select"), config);

const offScreen = new OffScreenCanvas(config);

let renderer = rendererFactory.init(config);
byId("renderer-select").onchange = () => { 
    emitter.clear();
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    offScreen.clear();
    renderer = rendererFactory.change(); 
}   

const forces = new ParticleForces(config);

TooltipHelp.init(".help", ".help-tooltip");

let lastTimestamp = 0;
function loop(timestamp) {    
    if ( lastTimestamp === 0 ) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
    lastTimestamp = timestamp;

    // --- fade the offscreen canvas to create trails ---
    offScreen.ctx.globalCompositeOperation = "source-over";
    offScreen.ctx.fillStyle = `rgba(0, 0, 0, ${config.bg_opacity})`;
    offScreen.ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    emitter.update(config, dt); 
    forces.apply(emitter.particles);
    //renderer.draw(emitter.particles, config.ctx);
    renderer.draw(emitter.particles, offScreen.ctx);

    // --- blit offscreen canvas onto visible canvas ---
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight); // optional, just ensures clean frame
    config.ctx.drawImage(offScreen.canvas, 0, 0);
    DeltaReport.log(timestamp, emitter.getSize());
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
