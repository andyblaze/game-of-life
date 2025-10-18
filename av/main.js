const canvas = document.getElementById("onscreen");
function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const sz = { w: window.innerWidth, h: window.innerHeight };
    onscreen.width  = Math.round(sz.w * dpr);
    onscreen.height = Math.round(sz.h * dpr);
    onscreen.style.width  = sz.w + "px";
    onscreen.style.height = sz.h + "px";  
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Instantiate
const audioCollector = new AudioCollector();
const renderer = new Renderer(canvas, new AudioRenderer(new Perlin()))
await audioCollector.init();   // request mic access, sets up analyser
const processor = new Processor(
    new AudioProcessor()    
);
const collector = new DataCollector(audioCollector);
const controller = new AnimationController(collector, processor, renderer); 
controller.start();