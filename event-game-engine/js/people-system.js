import TextSystemBase from "./text-system-base.js";

export default class PeopleSystem extends TextSystemBase {
    constructor(eventBus, messages) {
        super(eventBus, messages);
        this.eventType = "people:message";
    }
}
