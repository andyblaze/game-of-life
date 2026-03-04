import Ajax from "./ajax.js";
import { byId } from "./functions.js";

export default class IO {
    static export(cfg) {
        const payload = {
            json: cfg.export(),
            fname: byId("fname").value,
            action: "export"
        };
        Ajax.post('php/filesys.php', payload)
            .then(response => {
                console.log('Saved:', response);
            })
            .catch(err => {
                console.error('Error:', err);
            });  
    }
    static import(cfg, ui) {
        const presetName = byId("presets").value; 
        const data = presets[presetName];
        if ( data ) {
            cfg.importPreset(data);
            ui.updateFromConfig(cfg);
        }      
    }
}
