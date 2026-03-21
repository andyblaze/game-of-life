import AudioEngine from "./audio-engine.js";
import Analyser from "./analyser.js";
import Renderer from "./renderer.js";
import Config from "./config.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";

const config = new Config("scope", new TypeConverter());
const audio = new AudioEngine(new TypeConverter());

const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.addObserver(audio);
uiControls.notify();


let analyser = null;
const renderer = new Renderer("scope");

document.body.addEventListener("click", () => {
    audio.start();
    analyser = new Analyser(audio.getAnalyser());
});

function loop(timestamp) {
    if ( analyser ) {
        const data = analyser.getTimeDomainData();
        renderer.draw(data);
    }

    requestAnimationFrame(loop);
}

loop(performance.now());