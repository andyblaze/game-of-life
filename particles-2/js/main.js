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

class DeviceTester {
    constructor(modalID, closeButtonID) {
        this.modalID = modalID;
        const screenWidth  = window.screen.width;
        const screenHeight = window.screen.height;
        const viewportWidth  = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // your minimums
        const minWidth  = 1880;
        const minHeight = 910;

        this.tooSmall = viewportWidth < minWidth || viewportHeight < minHeight;
        byId(closeButtonID).onclick = () => { this.hideModal() } 
    }
    test() {
        if ( this.tooSmall ) this.showModal();
    }
    showModal() {
        byId(this.modalID).style.display = "flex";
    }
    hideModal() {
        byId(this.modalID).style.display = "none";
    }
}

const device = new DeviceTester("screen-warning", "continue-btn"); 
device.test(); 


const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

byId("ui-panel").reset();

byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => {
    emitter.clear();
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    IO.import(config, uiControls);
};

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

const rendererFactory = new RendererFactory(byId("renderer-select"), config);

// --- Offscreen canvas setup ---
class OffScreen {
    constructor(cfg) {
        this.cfg = cfg;
        this.canvas = document.createElement("canvas");
        this.canvas.width = cfg.canvasWidth;
        this.canvas.height = cfg.canvasHeight;
        this.ctx = this.canvas.getContext("2d");
    }
    clear() {
        this.ctx.clearRect(0, 0, this.cfg.canvasWidth, this.cfg.canvasHeight);
    }
}

const offScreen = new OffScreen(config);

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
