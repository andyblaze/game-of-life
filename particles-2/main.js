import { byId } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import DeltaReport from "./delta-report.js";

byId("ui-panel").reset();

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.notify();

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

byId("export").onclick = () => { 
    const json = config.export();
    const fname = byId("fname").value;
};

function loop(timestamp) {
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    emitter.draw(config.ctx);
    DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
