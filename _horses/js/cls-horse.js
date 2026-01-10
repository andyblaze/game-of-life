import { randomNormal, randomUniform, clamp } from "./functions.js";

export default class Horse {
    static type = "horses";
  constructor(id, trainerId, geneticsConfig, name) {
    this.id = id;
    this.trainerId = trainerId;
    this.name = name;

    // Hidden, intrinsic attributes
    this.attributes = this.generateAttributes(geneticsConfig.attributes);

    // Hidden affinities (optional)
    this.affinities = this.generateAffinities(geneticsConfig.affinities || {});

    // Public record only
    this.raceHistory = [];
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

  generateAffinities(affinityConfig) {
    const affinities = {};

    for (const [category, entries] of Object.entries(affinityConfig)) {
      affinities[category] = {};

      for (const [key, cfg] of Object.entries(entries)) {
        affinities[category][key] =
          randomNormal(cfg.mean, cfg.stddev);
      }
    }

    return affinities;
  }

  // Public, observable fact
  addRaceResult(result) {
    this.raceHistory.push(result);
  }
}
//console.log("Horse.type at module end:", Horse.type);