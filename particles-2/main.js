import { byId, byQsArray } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import IO from "./cls-io.js";
import RendererFactory from "./cls-renderer-factory.js";
import DeltaReport from "./delta-report.js";
import RepulsorForce from "./cls-repulsor-force.js";
import VortexForce from "./cls-vortex-force.js";

byId("ui-panel").reset();
byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => IO.import(config, uiControls);

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input, #ui-panel select");
uiControls.addObserver(config);
uiControls.notify();

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

const rendererFactory = new RendererFactory(byId("renderer-select"));

let renderer = rendererFactory.init();
byId("renderer-select").onchange = () => { renderer = rendererFactory.change(); }   

class ParticleForces {
    constructor() {
        this.items = {
            repulsor: { active:true, force: new RepulsorForce() },
            vortex: { active: true, force: new VortexForce() }
        }
    }
    apply(particles) {
        for ( const [key, item] of Object.entries(this.items) ) {
            if ( item.active )
                item.force.apply(particles);
        }
    }
    set(key) {
        this.items[key].active = ! this.items[key].active;
    }
}

const forces = new ParticleForces();

byQsArray(".force-ticker").forEach(ctrl => {
    ctrl.onclick = () => {
        const forceName = control.dataset.force;
        forces.set(forceName);
    };
});

function loop(timestamp) {    
    config.ctx.fillStyle = `rgba(0, 0, 0, ${config.bg_opacity})`;
    config.ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    forces.apply(emitter.particles);
    renderer.draw(emitter.particles, config.ctx);
    DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
