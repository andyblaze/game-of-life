export default class SeaSystem {
  constructor(events) {
    this.events = events;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
    if (this.timer > 6000) {
      this.timer = 0;
      this.events.emit("sea:message");
    }
  }
}

