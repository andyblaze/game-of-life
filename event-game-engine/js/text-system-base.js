import { RandomItem } from "./utils.js";
import { mt_rand } from "./functions.js";

export default class TextSystemBase {
    constructor(eventBus, messages) {
        this.eventBus = eventBus;
        this.messages = messages;
        this.timer = 0;
        this.nextEventTime = this.randomDelay();
        this.randomItem = new RandomItem(messages.calm.length);
        this.eventBus.on("mood:changed", ({ from, to }) => {
            this.onMoodChanged(from, to);
        });
    }
    onMoodChanged(from, to) {
    // switch active pool of messages
    this.currentMessages = this.messages[to];
    this.randomItem.reset(this.currentMessages.length);

    // optional: trigger a first message immediately
    //const msg = this.randomItem.getFrom(this.currentMessages);
    //console.log(to, msg);
  }
    randomDelay() {
        return mt_rand(1000, 2000);
    }
    update(dt) {
        this.timer += dt;
        if ( this.timer >= this.nextEventTime ) {
            this.timer = 0;
            this.nextEventTime = this.randomDelay();
            const msg = this.randomItem.getFrom(this.currentMessages);
            this.eventBus.emit(this.eventType, msg);
        }
    }
}