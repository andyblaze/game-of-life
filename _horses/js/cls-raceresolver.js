export default class RaceResolver {
  static resolve(track, distance, entrants) {
    const results = entrants.map(horse => {
      // Base performance = horse speed * endurance
      let performance = horse.attributes.speed * 0.5 + horse.attributes.endurance * 0.5;

      // Apply trainer effect
      const trainerSkill = horse.trainerId != null ? Trainers[horse.trainerId].attributes.skill : 1.0;
      performance *= trainerSkill;

      // Track bias
      performance *= track.attributes.bias;

      // Optional: horse distance affinity
      if (horse.affinities.distance && horse.affinities.distance[distance]) {
        performance *= 1 + 0.1 * horse.affinities.distance[distance]; // small multiplier
      }

      // Noise
      performance *= randomUniform(0.95, 1.05);

      return { horse, performance };
    });

    // Sort descending = higher performance wins
    results.sort((a, b) => b.performance - a.performance);

    return results;
  }
}
