import { byId } from "./functions.js";
import Emitter from "./cls-emitter.js";
import TypeConverter from "./cls-typeconverter.js";
import Cfg from "./cls-config.js";
import UiControls from "./cls-uicontrols.js";
import DeltaReport from "./delta-report.js";

byId("ui-panel").reset();

const config = new Cfg(new TypeConverter(), "effect");
const uiControls = new UiControls("#ui-panel input");
uiControls.addObserver(config);
uiControls.notify();

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

class Ajax {
    static post(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }
            return res.json(); // or res.text() if you prefer
        });
    }
}

byId("export").onclick = () => { 
    const payload = {
        json: config.export(),
        fname: byId("fname").value,
        action: "export"
    };
    Ajax.post('filesys.php', payload)
        .then(response => {
            console.log('Saved:', response);
        })
        .catch(err => {
            console.error('Error:', err);
        });
};

function loop(timestamp) {
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    emitter.update(config, 1); // dt = 1 frame (super simple)
    emitter.draw(config.ctx);
    //DeltaReport.log(timestamp);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
