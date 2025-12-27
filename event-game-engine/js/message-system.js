export default class MessageSystem {
    constructor(eventBus) {
        eventBus.on("sea:message", function(message) {
            //console.log("sea msg", message);
        });
    }
}
