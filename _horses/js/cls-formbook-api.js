export default class FormApi {
    constructor(formbook) {
        this.formbook = formbook;
    }
getHorse(id) {
    return this.formbook.horses[id];
  }
  getHorseName(id) {
    return this.formbook.horses[id].name;
  }
  getTrainerName(id) {
    return this.formbook.trainers[id].name;
  }
  getTrackName(id) {
    return this.formbook.tracks[id].name;
  }
    placingsFor(horseId, maxPlace=1) {
        const data = this.formbook.byHorse;
        if ( maxPlace < 1 ) return 0;
        const entries = data.get(horseId); 
        if ( !entries ) return 0;

        return entries.reduce((count, entry) => {
            return count + (entry.position <= maxPlace ? 1 : 0);
        }, 0);
    }
    runsFor(horseId) {
        const data = this.formbook.byHorse;
        const entries = data.get(horseId); 
        return entries.length;
    }
    topTrainersByPlacings(maxPlace = 3, limit = 3) {
    const stats = [];
    const data = this.formbook.byTrainer;

    for (const [trainerId, entries] of data.entries()) {
        let placings = 0;

        for (const e of entries) {
        if (e.position <= maxPlace) placings++;
        }

        stats.push({
        trainerId,
        placings
        });
    }

    stats.sort((a, b) => b.placings - a.placings);

    return stats.slice(0, limit);
    }
normalisedScoresFor(horseIds) {
  const scores = new Map();
  const data = this.formbook.byHorse;

  horseIds.forEach(horseId => {
    const entries = data.get(horseId);

    if (!entries || entries.length === 0) {
      scores.set(horseId, 0); 
      return;
    }

    const avg =
      entries.reduce((sum, e) => sum + e.normalisedScore, 0) /
      entries.length;

    scores.set(horseId, avg);
  });

  return scores;
}
}