import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";
import Config from "./config.js";
import Audio from "./audio.js";
import Maths from "./maths.js";
import Renderer from "./renderer.js";
import { byId } from "./functions.js";


const config = new Config("canvas", new TypeConverter());
const audio = new Audio(config);
const maths = new Maths(config);
const renderer = new Renderer(config, maths);

const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

document.body.addEventListener("click", () => audio.start());

// DRAW LOOP
let t = 0;
function loop(timestamp) {  //console.log(config.controlsData)
    
    renderer.draw(t);

    if ( audio.started ) {
        audio.update(config.Waveform);
        let complexity = maths.getComplexity();//.abs(config.R - config.r) + config.ratio * 10;
        audio.setFreq(100 + complexity * 2);
        audio.setGain(0.02 + config.speed * 0.1);
    }

    t += config.speed;
    requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", () => {
    byId("ui-panel").reset();
    //screenSetup();
    loop(performance.now()); 
});