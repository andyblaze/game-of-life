export default class MessageSystem {
    constructor(events) {
        events.on("sea:message", function(message) {
            console.log(message);
        });
    }
}
