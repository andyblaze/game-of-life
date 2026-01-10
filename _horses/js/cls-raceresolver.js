import { randomUniform } from "./functions.js";
import { CfgRaceModel } from "./cfg-racemodel.js";

export default class RaceResolver {
  static resolve(track, distance, entrants, trainers) {
    const cfg = CfgRaceModel;

    const results = entrants.map(horse => {
      let performance =
        horse.attributes.speed * cfg.baseWeights.speed +
        horse.attributes.endurance * cfg.baseWeights.endurance;

      if (cfg.trainerEffect.enabled) {
        performance *= trainers[horse.trainerId].attributes.skill;
      }

      if (cfg.trackEffect.enabled) {
        performance *= track.attributes.bias;
      }

      if (
        cfg.distanceAffinity.enabled &&
        horse.affinities.distance &&
        horse.affinities.distance[distance]
      ) {
        performance *= 1 + cfg.distanceAffinity.multiplier *
          horse.affinities.distance[distance];
      }

      performance *= randomUniform(cfg.noise.min, cfg.noise.max);

      return { horse, performance };
    });

    results.sort((a, b) => b.performance - a.performance);
    return results;
  }
}
