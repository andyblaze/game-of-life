import { RandomItem } from "./utils.js";
import { mt_rand } from "./functions.js";

export default class SeaSystem {
    constructor(events, messages) {
        this.events = events;
        this.messages = messages;
        this.timer = 0;
        this.nextEventTime = this.randomDelay();
        this.randomItem = new RandomItem(messages.length);
    }
    randomDelay() {
        return mt_rand(2000, 6000);
    }
    update(dt) {
        this.timer += dt;
        if ( this.timer >= this.nextEventTime ) {
            this.timer = 0;
            this.nextEventTime = this.randomDelay();
            const msg = this.randomItem.getFrom(this.messages);
            this.events.emit("sea:message", msg);
        }
    }
}
