export default class MessageSystem {
    constructor(eventBus) {
        eventBus.on("sea:message", function(message) {
            eventBus.emit("message:emit", { "type": "sea-text", "msg":message } );
        });
        eventBus.on("sea:colorchange", function(data) {
            eventBus.emit("sea:colorchanged", data);
        });
        eventBus.on("player:moving", function(data) { 
            eventBus.emit("player:moved", data);
        });
        eventBus.on("player:steer", function(data) {
            eventBus.emit("player:steered", data);
        });
        eventBus.on("player:waypoint", function(data) {
            eventBus.emit("player:waypointed", data);
        });
        eventBus.on("weather:message", function(message) {
            //console.log("weather msg", message);
        });
        eventBus.on("people:message", function(message) {
            //console.log("people msg", message);
        });
         eventBus.on("land:message", function(message) {
            //console.log("land msg", message);
        });
         eventBus.on("fish:message", function(message) {
            //console.log("fish msg", message);
        });
        eventBus.on("mood:changed", function(message) {
            //console.log("mood msg", message);
        });
    }
}
