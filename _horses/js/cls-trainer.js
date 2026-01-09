import { randomNormal, randomUniform, clamp } from "./functions.js";

export default class Trainer {
  constructor(id, config, name) {
    this.id = id;
    this.name = name;

    // Hidden attributes
    this.attributes = this.generateAttributes(config.attributes);

    // Stable of horse IDs (empty at creation)
    this.stable = [];

    // Public record: wins, placements, etc.
    this.record = {
      races: 0,
      wins: 0,
      places: 0
    };
  }

  generateAttributes(attributeConfig) {
    const attrs = {};

    for (const [name, cfg] of Object.entries(attributeConfig)) {
      let value;

      if (cfg.distribution === "normal") {
        value = randomNormal(cfg.mean, cfg.stddev);
      } else if (cfg.distribution === "uniform") {
        value = randomUniform(cfg.min, cfg.max);
      } else {
        throw new Error(`Unknown distribution: ${cfg.distribution}`);
      }

      if (cfg.min !== undefined && cfg.max !== undefined) {
        value = clamp(value, cfg.min, cfg.max);
      }

      attrs[name] = value;
    }

    return attrs;
  }

  // Add a horse to this trainer's stable
  addHorse(horse) {
    this.stable.push(horse.id);
    horse.trainerId = this.id;
  }

  // Update record if a horse wins/places (optional for now)
  recordResult(position) {
    this.record.races += 1;
    if (position === 1) this.record.wins += 1;
    if (position <= 3) this.record.places += 1;
  }
}
