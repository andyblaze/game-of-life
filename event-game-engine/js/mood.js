import { mt_rand, randomFrom } from "./functions.js";

export default class Mood {
  constructor(eb, config) {
    this.eventBus = eb;
    // config.moods = ["calm", "uneasy", "suspicious", "ominous"]
    this.moods = config;

    this.current = this.moods[0];

    this.timer = 0;
    this.nextChange = this.randomDelay();
    this.emit("mood:changed", { from:"calm", to:"calm" });
  }
  randomDelay() {
    // deliberately rough — tweak later
    return mt_rand(2000, 6000);
  }
  update(dt) {
    this.timer += dt;

    if (this.timer >= this.nextChange) {
      this.timer = 0;
      this.nextChange = this.randomDelay();
      this.flip();
    }
  }
  emit(e, data) {
    this.eventBus.emit(e, data);
  }
  flip() {
    let next = this.current;

    // avoid immediate repeats
    while (next === this.current) {
      next = randomFrom(this.moods);
    }

    const prev = this.current;
    this.current = next;

    this.emit("mood:changed", {
      from: prev,
      to: next
    });
  }
  get() {
    return this.current;
  }
}
