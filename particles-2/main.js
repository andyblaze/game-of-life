import { byId, HSLAString } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import IO from "./cls-io.js";
import RendererFactory from "./cls-renderer-factory.js";

import { TweenCollection, AlphaOverLife, ColorOverLife, SizeOverLife, NoiseDrift } from "./cls-tweens.js";
import PerlinNoise from "./cls-perlin.js";

import DeltaReport from "./delta-report.js";

function buildTweens(cfg) {
    const tweenBehaviors = new TweenCollection();
    const perlin = new PerlinNoise();
    tweenBehaviors.add(new AlphaOverLife(cfg.alpha_start, cfg.alpha_end));
    tweenBehaviors.add(new ColorOverLife(cfg.color_start, cfg.color_end, cfg.alpha_start));
    tweenBehaviors.add(new SizeOverLife(cfg.size_start, cfg.size_end));
    tweenBehaviors.add(new NoiseDrift(perlin, 1, 0.1, 0.02));
    return tweenBehaviors;
}



byId("ui-panel").reset();
byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => IO.import(config, uiControls);

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.notify();

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

const rendererFactory = new RendererFactory(byId("renderer"));

const tweens = buildTweens(config);

let renderer = rendererFactory.init();
byId("renderer").onchange = () => { renderer = rendererFactory.change(); } 

function loop(timestamp) {
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    renderer.draw(emitter.particles, tweens, config.ctx);
    //DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
