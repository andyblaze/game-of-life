import { byId, byQsArray } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import IO from "./cls-io.js";
import RendererFactory from "./cls-renderer-factory.js";
import ParticleForces from "./cls-particle-forces.js";
import TooltipHelp from "./cls-tooltips.js";
import DeltaReport from "./delta-report.js";

byId("ui-panel").reset();
byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => IO.import(config, uiControls);

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

const rendererFactory = new RendererFactory(byId("renderer-select"), config);

// --- Offscreen canvas setup ---
const offCanvas = document.createElement("canvas");
offCanvas.width = config.canvasWidth;
offCanvas.height = config.canvasHeight;
const offCtx = offCanvas.getContext("2d");

let renderer = rendererFactory.init(config);
byId("renderer-select").onchange = () => { 
    //emitter.clear();
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    offCtx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
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
    offCtx.globalCompositeOperation = "source-over";
    offCtx.fillStyle = `rgba(0, 0, 0, ${config.bg_opacity})`;
    offCtx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    emitter.update(config, dt); 
    forces.apply(emitter.particles);
    //renderer.draw(emitter.particles, config.ctx);
    renderer.draw(emitter.particles, offCtx);

    // --- blit offscreen canvas onto visible canvas ---
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight); // optional, just ensures clean frame
    config.ctx.drawImage(offCanvas, 0, 0);
    DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
