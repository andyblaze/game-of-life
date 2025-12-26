export default class Engine {
  constructor() {
    this.systems = [];
  }

  add(system) {
    this.systems.push(system);
  }

  update(dt) {
    for (const s of this.systems) {
      s.update?.(dt);
    }
  }
}
