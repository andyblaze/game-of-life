import { randomNormal, randomUniform, clamp, randomFrom } from "./functions.js";

export default class Track {
    static type = "tracks";
  constructor(id, config, name) {
    this.id = id;
    this.distance = randomFrom(config.distances);
    this.surface = randomFrom(config.surfaces);
    this.name = name;

    this.attributes = this.generateAttributes(config.attributes);
  }

  generateAttributes(attrConfig) {
    const attrs = {};

    for (const [key, cfg] of Object.entries(attrConfig)) {
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

      attrs[key] = value;
    }

    return attrs;
  }
}
