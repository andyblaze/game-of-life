import TextSystemBase from "./text-system-base.js";

export default class LandSystem extends TextSystemBase {
    constructor(eventBus, messages) {
        super(eventBus, messages);
        this.eventType = "land:message";
    }
}
