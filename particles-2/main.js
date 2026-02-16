import { byId, HSLAString } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import IO from "./cls-io.js";
import DeltaReport from "./delta-report.js";

byId("ui-panel").reset();
byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => IO.import(config, uiControls);

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.notify();

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

class CircleRenderer {
    static type = "solid";
    draw(particles, ctx) {
        particles.forEach(p => {
            ctx.fillStyle = HSLAString(p.color); 
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);            
            ctx.fill();
        });
    }
}
class GradientRenderer {
    static type = "gradient";
    draw(particles, ctx) {
        particles.forEach(p => {
            const g = ctx.createRadialGradient(
                p.pos.x, p.pos.y, 0,
                p.pos.x, p.pos.y, p.size
            );
            const c = p.color;

            g.addColorStop(0, HSLAString(c));
            g.addColorStop(1, `hsla(${c.h}, ${c.s}%, ${c.l}%, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

const RendererRegistry = {};

class BaseRenderer {
    static register(cls) {
        RendererRegistry[cls.type] = cls;
    }
}

BaseRenderer.register(CircleRenderer);
BaseRenderer.register(GradientRenderer);

class RendererFactory {
    attach(ctrl) {
        this.ctrl = ctrl;
        //this.ctrl.onclick = () => this.change();
    }
    create(type) {
        const A = RendererRegistry[type];
        if ( ! A ) 
            throw new Error(`Unknown animation type: ${type}`);
        return new A();
    }
    init() {
        return this.create(this.ctrl.value);
    }
    change() {
        return this.create(this.ctrl.value);
    }
}

const rendererFactory = new RendererFactory();
rendererFactory.attach(byId("renderer"));

let renderer = rendererFactory.init(); //create(byId("renderer").value);
byId("renderer").onclick = () => { renderer = rendererFactory.change(); } //create(byId("renderer").value); }

function loop(timestamp) {
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    renderer.draw(emitter.particles, config.ctx);
    //emitter.draw(config.ctx);
    DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
