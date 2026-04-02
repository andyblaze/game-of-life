import { Observable } from "./util-classes.js";

export default class MessageSystem  extends Observable{
    constructor() {
        super();
        this.messages = [];
    }
    processEvent(e) {
        this.messages.push({ type: "msg", output: `${e.type} , ${e.source} , ${e.state}` });
        this.notify();
    }
    notify() {
        for ( const o of this.observers )
            o.update(this.messages);
    }
}
