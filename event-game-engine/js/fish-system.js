import TextSystemBase from "./text-system-base.js";

export default class FishSystem extends TextSystemBase {
    constructor(eventBus, messages) {
        super(eventBus, messages);
        this.eventType = "fish:message";
    }
}
