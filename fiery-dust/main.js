import CONFIG from "./config.js";
import WordManager from "./word-manager.js";
import ParticleManager from "./particle-manager.js";
import EmberManager from "./ember-manager.js";
import ShimmerManager from "./shimmer-region.js";
import GroundFlicker from "./ground-flicker.js";
import DeltaReport from "./delta-report.js";

const onscreen = document.getElementById("onscreen");
const onCtx = onscreen.getContext("2d");
onscreen.width = window.innerWidth;
onscreen.height = window.innerHeight;

const particleManager = new ParticleManager(CONFIG.PARTICLES);
const wordManager = new WordManager(onscreen, particleManager, CONFIG.WORD);
const emberManager = new EmberManager(CONFIG.EMBER);
const shimmerManager = new ShimmerManager(CONFIG.SHIMMER);
const groundFlicker = new GroundFlicker(CONFIG.GROUND_FLICKER);

let lastTime = performance.now();

const bg = new Image();
bg.src = "bg.jpg";

function animate(timestamp) { 
    if ( isNaN(timestamp) ) timestamp = 0;
    const dt = timestamp - lastTime; // milliseconds since last frame
    onCtx.drawImage(bg, 0, 0, onscreen.width, onscreen.height);
    shimmerManager.update(dt, onCtx);
    particleManager.update(onCtx);
    
    groundFlicker.update(dt, onCtx);
    
    lastTime = timestamp;
    emberManager.update(dt, onCtx);
    wordManager.update();
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}
animate();
