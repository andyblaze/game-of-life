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

let renderer = rendererFactory.init(config);
byId("renderer-select").onchange = () => { renderer = rendererFactory.change(); }   

const forces = new ParticleForces(config);

byQsArray(".force-checkbox").forEach(ctrl => {
    ctrl.onclick = () => {
        const forceName = ctrl.dataset.force;
        forces.set(forceName);
    };
});

TooltipHelp.init(".help", ".help-tooltip");

function loop(timestamp) {    
    config.ctx.fillStyle = `rgba(0, 0, 0, ${config.bg_opacity})`;
    config.ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    forces.apply(emitter.particles);
    renderer.draw(emitter.particles, config.ctx);
    DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
