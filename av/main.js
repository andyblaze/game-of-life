import { resizeCanvas } from "./functions.js";
import DataCollector from "./datacollector.js";
import AudioCollector from "./audiocollector.js";
import Renderer from "./renderer.js";
import AudioRenderer from "./audiorenderer.js";
import Processor from "./processor.js";
import AudioProcessor from "./audioprocessor.js";
import AnimationController from "./animationcontroller.js";

async function initPipeline() {
    const canvas = document.getElementById("onscreen");
    const audio = document.getElementById("audio");
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    // Instantiate
    const collector = new DataCollector(new AudioCollector(audio));
   // await collector.strategy.init();  // <--- CRUCIAL
    const renderer = new Renderer(canvas, new AudioRenderer())
    const processor = new Processor(new AudioProcessor());
    const controller = new AnimationController(collector, processor, renderer); 
    //controller.start();
    audio.addEventListener("play", async () => { await collector.strategy.init();
        await collector.strategy.ctx.resume();
        controller.start();
    }, { once: true });
    // Wait until the audio can play and the user actually hits play
    /*let ready = false;

    audio.addEventListener("canplaythrough", () => {
        ready = true;
        console.log("Audio ready to play");
    });
    audio.addEventListener("play", () => {
        if ( ready ) {
            controller.start();
        } else {
            console.log("Waiting for audio to buffer...");
            audio.addEventListener("canplaythrough", () => controller.start(), { once: true });
        }
    });*/
}
initPipeline();
