import { Observable } from "./util-classes.js";

export default class MessageSystem  extends Observable {
    constructor() {
        super();
        this.messages = [];
    }
    lastMessage() {        
        const idx = this.messages.length - 1;
        if ( idx < 0 ) return "";
        return this.messages[idx].output;
    }
    collateMessages() {
        let htm = "";
        for ( const m of this.messages )
            htm += (m.output + "<br>");
        return [{ type: "msg", output: htm }];
    }
    processEvent(e) {
        const msg = `${e.type} , ${e.source} , ${e.state}`;
        if ( msg === this.lastMessage() ) return;
        this.messages.push({ type: "msg", output: msg });
        if ( this.messages.length > 8 ) this.messages.shift();
        //console.log(this.messages);
        this.notify();
    }
    notify() {
        for ( const o of this.observers )
            o.update(this.collateMessages());
    }
}
