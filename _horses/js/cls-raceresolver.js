import { randomUniform } from "./functions.js";
import { CfgRaceModel } from "./cfg-racemodel.js";

export default class RaceResolver {
  static resolve(track, distance, entrants, trainers) {
    const cfg = CfgRaceModel;

    const results = entrants.map(horse => {
      // Base performance weighted by horse attributes
      let performance =
        horse.attributes.speed * cfg.baseWeights.speed +
        horse.attributes.endurance * cfg.baseWeights.endurance;

      // Apply trainer skill multiplier
      const trainer = trainers[horse.trainerId];
      if (cfg.trainerEffect.enabled) {
        performance *= trainer.attributes.skill;
      }

      // Track bias
      if (cfg.trackEffect.enabled) {
        performance *= track.attributes.bias;
      }

      // Horse distance affinity
      if (
        cfg.distanceAffinity.enabled &&
        horse.affinities.distance &&
        horse.affinities.distance[distance]
      ) {
        performance *= 1 + cfg.distanceAffinity.multiplier *
          horse.affinities.distance[distance];
      }

      // --- NEW TRAINER ATTRIBUTES ---

      // Tactical: multiplier if horse distance matches trainer specialty
      if (trainer.attributes.tactical && trainer.attributes.specialtyDistance) {
        if (trainer.attributes.specialtyDistance === RaceResolver._distanceCategory(distance)) {
          performance *= 1 + 0.05 * trainer.attributes.tactical; // small bonus
        }
      }

      // Experience reduces variance
      if (trainer.attributes.experience) {
        // We will scale noise around 1, reducing it for experienced trainers
        const noiseScale = 1 + ((randomUniform(-0.05, 0.05)) / trainer.attributes.experience);
        performance *= noiseScale;
      }

      // Horse development: improves performance gradually
      if (trainer.attributes.horseDevelopment) {
        performance *= 1 + 0.02 * trainer.attributes.horseDevelopment; // small incremental improvement
      }

      // Trainer consistency: scales overall noise
      if (trainer.attributes.consistency) {
        const consistencyNoise = randomUniform(
          1 - 0.05 / trainer.attributes.consistency,
          1 + 0.05 / trainer.attributes.consistency
        );
        performance *= consistencyNoise;
      }

      // Apply global random noise last
      performance *= randomUniform(cfg.noise.min, cfg.noise.max);

      return { horse, performance };
    });

    // Sort descending = higher performance wins
    results.sort((a, b) => b.performance - a.performance);

    return results;
  }

  // Helper to bucket distances into categories
  static _distanceCategory(distance) {
    if (distance < 1500) return "short";
    if (distance <= 2500) return "medium";
    return "long";
  }
}
