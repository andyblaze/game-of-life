import Ajax from "./cls-ajax.js";
import { byId } from "./functions.js";

export default class IO {
    static export(cfg) {
        const payload = {
            json: cfg.export(),
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
    }
    static import(cfg, ui) {
        const payload = {
            fname: byId("presets").value,
            action: "import"
        };
        Ajax.post('filesys.php', payload)
            .then(response => {
                cfg.importPreset(response);
                ui.updateFromConfig(cfg);
            })
            .catch(err => {
                console.error('Error:', err);
            });        
    }
}
