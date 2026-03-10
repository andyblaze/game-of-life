import Config from "./config.js";
import Renderer from "./renderer.js";
import MultiPenRenderer from "./mulltipen-renderer.js";
import Core from "./core.js";
import { byId, byQsArray } from "./functions.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";
import Forces from "./forces.js";
import ColorTween from "./tweens.js";
import DeltaReport from "./delta-report.js";

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    return isPortrait;
}

function updateWarning() {
    const warning = byId("rotate-warning");
    warning.style.display = checkOrientation() ? "block" : "none";
}

window.addEventListener("resize", updateWarning);
window.addEventListener("orientationchange", updateWarning);

updateWarning();

const config = new Config("spiro", "workspace", new TypeConverter());

const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(config);
const core = new Core(config);

byId("ui-panel").reset();

const forces = new Forces(config);
const ct = new ColorTween(config);

const geoCtrls = byQsArray("#ui-panel input.geometry");
for ( const ctrl of geoCtrls ) ctrl.onchange = () => { 
    core.reset();
    renderer.reset();
    forces.reset();
    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH); 
};

// Pseudo3D projection wrapper
function project3D(pos, cfg) {
    // z-coordinate based on distance from center or optional custom function
    // You can tweak this to get more or less “depth”
    const dx = pos.x - cfg.centerX;
    const dy = pos.y - cfg.centerY;

    // Example: radius-based depth
    const z = Math.sqrt(dx*dx + dy*dy) * cfg.depthFactor; // tweak depthFactor e.g., 0.2

    // Optional camera rotation around Y axis (tip the whole plane)
    const angle = cfg.cameraAngle || 0; // radians
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const xRot = dx * cosA - z * sinA;
    const zRot = dx * sinA + z * cosA;

    // Perspective projection
    const focalLength = cfg.focalLength || 300;
    const scale = focalLength / (focalLength + zRot);

    return {
        x: cfg.centerX + xRot * scale,
        y: cfg.centerY + dy * scale
    };
}
class ThreeDee {
    constructor(cfg) {
        this.cfg = cfg;
        this.cameraAngle = 0;
    }
    updateAngle() {
        this.cameraAngle += 0.002;
    }
    update(pos, cfg) {
        
        const dx = pos.x - this.cfg.centerX;
        const dy = pos.y - this.cfg.centerY;

        // pseudo-z based on distance from center
        const z = Math.sqrt(dx*dx + dy*dy) * (cfg.depthFactor || 0.2);

        // camera rotation around Y axis
        const angle = this.cameraAngle;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const xRot = dx * cosA - z * sinA;
        const zRot = dx * sinA + z * cosA;

        // perspective projection
        const focalLength = cfg.focalLength || 300;
        const scale = focalLength / (focalLength + zRot);

        // final projected coordinates
        const xProj = this.cfg.centerX + xRot * scale;
        const yProj = this.cfg.centerY + dy * scale;

        // alpha fade based on z-depth
        const alpha = Math.min(1, cfg.baseAlpha * scale); // closer = brighter

        return { x: xProj, y: yProj, a: alpha };
    }
}
const proj = new ThreeDee(config);

//let cameraAngle = 0; // global for smooth rotation
let lastTimestamp = 0;
function loop(timestamp) { 
    if ( lastTimestamp === 0 ) lastTimestamp = timestamp;
    //cameraAngle += 0.002; // slow rotation

    const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
    lastTimestamp = timestamp;
    
    const subSteps = Math.ceil(config.speed * 60) + 1;
    const stepDT = (config.speed * dt) * (dt / subSteps);
    proj.updateAngle();
    for ( let i = 0; i < subSteps; i++ ) {
        const pos = core.getPoint();
        forces.update(core.t, pos);
        core.update(stepDT);
        renderer.color = ct.update(stepDT);

const projected = proj.update(pos, {
            depthFactor: 0.2,
           // cameraAngle,
            focalLength: 300,
            baseAlpha: 0.2 // tweak for ghosting/shimmer
        });
        // temporarily override renderer color alpha
        const prevAlpha = renderer.color.a;
        renderer.color.a = projected.a;

renderer.draw(projected.x, projected.y, stepDT);
renderer.color.a = prevAlpha; // restore
        //renderer.draw(pos.x, pos.y, stepDT); 
    }
    DeltaReport.log(timestamp); //DeltaReport.spew();
    requestAnimationFrame(loop);
}

loop(performance.now()); 
