import CONFIG from "./config.js";
import WordManager from "./word-manager.js";
import ParticleManager from "./particle-manager.js";
import EmberManager from "./ember-manager.js";
import ShimmerManager from "./Shimmer-region.js";
import GroundFlicker from "./ground-flicker.js";
import DeltaReport from "./delta-report.js";

const canvas = document.getElementById("onscreen");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const wordManager = new WordManager(canvas);
const particleManager = new ParticleManager();
const emberManager = new EmberManager(CONFIG.EMBER);
const shimmerManager = new ShimmerManager(CONFIG.SHIMMER);
const groundFlicker = new GroundFlicker(CONFIG.GROUND_FLICKER);

let lastTime = performance.now();
const bg = new Image();
bg.src = "bg.jpg";
function animate(timestamp) { 
    if ( isNaN(timestamp) ) 
        timestamp = 0;
    const dt = timestamp - lastTime; // milliseconds since last frame
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    shimmerManager.update(dt, ctx);
    particleManager.update(ctx);
    
    groundFlicker.update(dt);
    groundFlicker.draw(ctx);

    
    lastTime = timestamp;
    emberManager.update(dt, ctx);
    wordManager.update(particleManager);
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}
animate();