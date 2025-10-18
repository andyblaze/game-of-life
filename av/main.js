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
const config = {
    dataUrl: "http://127.0.0.1/gol/coins/data.php",
    dataPollInterval: 3 // seconds
};
// Instantiate
const processor = new Processor(
    new AudioProcessor(),
    new Renderer(canvas, new AudioRenderer(new Perlin()))
);
const collector = new DataCollector(config.dataUrl);
const controller = new AnimationController(collector, processor, config.dataPollInterval); 
controller.start();