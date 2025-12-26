export default class MessageSystem {
  constructor(events, messages) {
    events.on("sea:message", () => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      console.log(msg);
    });
  }
}
