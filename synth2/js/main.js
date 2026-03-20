import AudioEngine from "./audio-engine.js";
import Analyser from "./analyser.js";
import Renderer from "./renderer.js";

const audio = new AudioEngine();
let analyser = null;
const renderer = new Renderer("scope");

document.body.addEventListener("click", () => {
    audio.start();
    analyser = new Analyser(audio.getAnalyser());
});

let oscFreq = 100;
const osc = document.getElementById("osc")
osc.addEventListener("input", () => {
    audio.setFrequency(osc.value);
});

function loop(timestamp) {
    if (analyser) {
        const data = analyser.getTimeDomainData();
        renderer.draw(data);
    }

    requestAnimationFrame(loop);
}

loop(performance.now());