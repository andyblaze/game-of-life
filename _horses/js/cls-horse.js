import { randomNormal, randomUniform, clamp } from "./functions.js";
import AttributeFactory from "./cls-attributes-factory.js";

export default class Horse {
    static type = "horses";
  constructor(id, trainerId, geneticsConfig, name) {
    this.id = id;
    this.trainerId = trainerId;
    this.name = name;

    // Hidden, intrinsic attributes
    this.attributes =  AttributeFactory.generate(geneticsConfig.attributes);//this.generateAttributes(geneticsConfig.attributes);

    // Hidden affinities (optional)
    this.affinities = this.generateAffinities(geneticsConfig.affinities || {});

    // Public record only
    this.raceHistory = [];
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
