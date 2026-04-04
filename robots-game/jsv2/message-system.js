import { Observable } from "./util-classes.js";

export default class MessageSystem  extends Observable {
    constructor() {
        super();
        this.messages = [];

        this.eventBuffer = {};     // per-tick aggregation
        this.cooldowns = {};       // message cooldowns
        this.tickCount = 0;
    }
    lastMessage() {        
        const idx = this.messages.length - 1;
        if ( idx < 0 ) return "";
        return this.messages[idx].output;
    }
    addMessage(msg) {
        if (msg === this.lastMessage()) return;

        this.messages.push(msg);//{ type: "msg", output: msg });

        if (this.messages.length > 8) {
            this.messages.shift();
        }
        this.notify();
    }
    formatMessage(evt) {
        const { source, state, count } = evt;
        if ( count === 1 ) {
            return `${source} is ${state}`;
        }
        return `${count} ${source}s are ${state}`;
    }
    isOnCooldown(key) {
        return this.cooldowns[key] && this.cooldowns[key] > this.tickCount;
    }

    setCooldown(key, duration) {
        this.cooldowns[key] = this.tickCount + duration;
    }
    flush() {
        this.tickCount++;

        for ( const key in this.eventBuffer ) {
            const evt = this.eventBuffer[key];

            if ( this.isOnCooldown(key) ) continue;

            const msg = this.formatMessage(evt);
            this.addMessage(msg);
            this.setCooldown(key, 5); // 5 ticks cooldown (tweak later)
        }
        this.eventBuffer = {};
    }
    processEvent(e) {
        if (e.type !== "state-change") return;

        const key = `${e.source}:${e.state}`;

        if ( !this.eventBuffer[key] ) {
            this.eventBuffer[key] = { ...e, count: 0 };
        }
        this.eventBuffer[key].count++;
    }
    notify() {
        for ( const o of this.observers )
            o.update([{ type: "msg", output: this.messages }]);
    }
}
