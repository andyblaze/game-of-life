import TextSystemBase from "./text-system-base.js";

export default class WeatherSystem extends TextSystemBase {
    constructor(eventBus, messages) {
        super(eventBus, messages);
        this.eventType = "weather:message";
    }
}
