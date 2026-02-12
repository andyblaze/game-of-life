import { byId } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import { TweenCollection, AlphaOverLife, ColorOverLife, SizeOverLife } from "./cls-tweens.js";

byId("ui-panel").reset();

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.notify();

/*const tweenBehaviors = new TweenCollection();
tweenBehaviors.add(new AlphaOverLife(config, 0));
tweenBehaviors.add(new ColorOverLife(config));
tweenBehaviors.add(new SizeOverLife(config, 0.5));*/

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

function loop(timestamp) {
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    emitter.draw(config.ctx);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
