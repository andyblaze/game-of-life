export default class MessageSystem {
    constructor(eventBus) {
        eventBus.on("sea:message", function(message) {
            console.log("sea msg", message);
        });
        eventBus.on("weather:message", function(message) {
            console.log("weather msg", message);
        });
        eventBus.on("people:message", function(message) {
            console.log("people msg", message);
        });
         eventBus.on("land:message", function(message) {
            console.log("land msg", message);
        });
         eventBus.on("fish:message", function(message) {
            console.log("fish msg", message);
        });
        eventBus.on("mood:changed", function(message) {
            console.log("mood msg", message);
        });
    }
}
