import config from "./config.js";
import DreamFlow from "./dreamflow.js";
import RandomExcite from "./excitations.js";
import { 
    ShapeBrush, RotatingLineBrush, MultiShapeBrush,
    Brush, LissajousBrush, ChaoticDuoBrush, NullBrush
} from "./brushes.js";
import { Polygon, Line, PathShape, Star, wavePath, spiralPath } from "./shapes.js";
import { Rotate, Spin, Pulse, Wobble } from "./motions.js";
import BrushScheduler from "./brush-scheduler.js";
import DeltaReport from "./delta-report.js";
import { resizeCanvas } from "./functions.js";

const test = [];
for ( let i = 1; i < 2; i++ )
    test.push(new RandomExcite(config));

const dreamFlow = new DreamFlow(config, test);

const brushes = [
    new ShapeBrush(60, new Line(config, 1), new Rotate(0.03)),
    new ShapeBrush(6, new Polygon(config, 3), new Rotate(0.02, 1, -1)),
    new RotatingLineBrush(10, config, 250, 0.04),
    new MultiShapeBrush(10,
        new ShapeBrush(10, new Line(config).setCx(-50), new Rotate(0.02, 1, 1)),
        new ShapeBrush(10, new Line(config).setCx(50), new Rotate(0.01, 1, -1))
    ),
    new ShapeBrush(6, new Polygon(config, 4), new Spin(0.02)),
    new ShapeBrush(5, new Polygon(config, 8), new Pulse()),
    new Brush(7, new PathShape(wavePath, config, 0.05, 200), new Wobble()),
    new Brush(6, new PathShape(spiralPath, config, 3, 200), new Wobble()),
    new LissajousBrush(6, config, 80, 5, 7, 0.002),
    new ShapeBrush(6, new Star(config), new Wobble()), 
    new ChaoticDuoBrush(5)
];
const scheduler = new BrushScheduler(brushes, new NullBrush());
dreamFlow.addScheduler(scheduler);

// top-level loop
let lastFrame = performance.now();
function loop(now) {
    if ( ! dreamFlow.running ) return;
    lastFrame = now;
    const dt = Math.max(1, now - lastFrame);
    dreamFlow.update(dt, config.offCtx, config.onCtx);

    DeltaReport.log(now);
    requestAnimationFrame(loop);
}

  // init
function init(){
    resizeCanvas();
    requestAnimationFrame(loop);
}
window.addEventListener('resize', resizeCanvas);
init();