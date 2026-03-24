import { mt_rand } from "./functions.js";

export default class MessageSystem {
    constructor(cfg) {
        this.cfg = cfg;
    }
    emit(resourceType, instantly=false) {
        if ( instantly ) 
            return { type: "msg", output: resourceType + " : " + this.cfg.getMessage(resourceType) };
        const msg = { type: "msg", output: "" };
        if ( mt_rand(0, 5000) > 2500 ) 
            msg.output = resourceType + " : " + this.cfg.getMessage(resourceType);  
        return msg;      
    }
}