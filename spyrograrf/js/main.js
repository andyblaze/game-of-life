import Config from "./config.js";
import Renderer from "./renderer.js";
import Core from "./core.js";
import { byId, byQsArray } from "./functions.js";
import TypeConverter from "./typeconverter.js";
import UiControls from "./uicontrols.js";

const config = new Config("spiro", "workspace", new TypeConverter());

const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(config);
const core = new Core(config);

byId("ui-panel").reset();

let paused = false;
//byId("go-btn").onclick = () => { core.init(config); paused = !paused; }

class PinchForce {
    constructor(cfg) { 
        this.cfg = cfg;
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;
        this.strength = cfg.pinch_force;
    }

    reset() { 
        this.strength = this.cfg.pinch_force;
    }

    update(t, pos) {

        // Vector from center → point
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;

        const dist = Math.sqrt(dx*dx + dy*dy);

        // Guard against divide-by-zero
        if (dist === 0) return;

        // Normalized direction
        const nx = dx / dist;
        const ny = dy / dist;

        // Pinch factor
        // Larger strength → stronger compression toward center
        const factor = 1 - (this.strength * 0.02);

        // Clamp so we don't invert the geometry
        const scale = Math.max(0.05, factor);

        // New distance after pinch
        const newDist = dist * scale;

        // Move point along the radial direction
        pos.x = this.cx + nx * newDist;
        pos.y = this.cy + ny * newDist;
    }
}
class RotationForce {
    constructor(cfg) {
        this.cx = cfg.centerX;
        this.cy = cfg.centerY;
        this.force = cfg.rotation_force;
    }
    reset(cfg) {
        this.force = cfg.rotation_force;
    }
    update(t, pos) {
        if ( this.force === 0 ) return;
        const dx = pos.x - this.cx;
        const dy = pos.y - this.cy;
        const angle = core.t * this.force;   

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rx = dx * cos - dy * sin;
        const ry = dx * sin + dy * cos;

        pos.x = this.cx + rx;
        pos.y = this.cy + ry;
    }
}

class Forces {
    constructor(cfg) {
        this.cfg = cfg;
        this.forces = [
            new RotationForce(cfg),
            new PinchForce(cfg)
        ];
    }
    update(t, pos) {
        for ( const f of this.forces ) {
            f.update(t, pos);
        }
    }
    reset() {
        for ( const f of this.forces ) {
            f.reset(this.cfg);
        }
    }
}

const forces = new Forces(config);

const geoCtrls = byQsArray("#ui-panel input.geometry");
for ( const ctrl of geoCtrls ) ctrl.onchange = () => { 
    core.reset();
    renderer.reset();
    forces.reset();
    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH); 
};


let lastTimestamp = 0;
function loop(timestamp) { 
    if ( paused === false ) {
        if ( lastTimestamp === 0 ) lastTimestamp = timestamp;
        const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
        lastTimestamp = timestamp;

        
        const subSteps = Math.ceil(config.speed * 20) + 1;
        const stepDT = (config.speed * dt) * (dt / subSteps);
        for ( let i = 0; i < subSteps; i++ ) {
            const pos = core.getPoint();
            forces.update(core.t, pos);
            core.update(stepDT);
            renderer.draw(pos.x, pos.y, stepDT); 
        }
    }
    requestAnimationFrame(loop);
}

loop(performance.now()); 
