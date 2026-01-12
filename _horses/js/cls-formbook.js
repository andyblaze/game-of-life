import { normalisedScore } from "./functions.js";

export default class FormBook {
   
  constructor(tracks, trainers, horses) {
    this.observers = [];
    this.tracks = tracks;
    this.trainers = trainers;
    this.horses = horses;
    //this.raceHistory = [];

    this.byHorse = new Map();    // horseId -> [entries]
    this.byTrainer = new Map();  // trainerId -> [entries]
    this.byTrack = new Map();    // trackId -> [entries]
  }
  addObserver(o) {
    this.observers.push(o);
  }

  addRaceResult(data) { //console.log(form);
    //this.raceHistory.push(form);

    for ( const [index, result] of data.placings.entries() ) {
      this._index(this.byHorse, result.horse.id, {
        raceId: data.raceId,
        trackId: data.trackId,
        distance: data.distance,
        fieldLength: data.fieldLength,
        position: index + 1,
        normalisedScore: normalisedScore(index + 1, data.fieldLength)
      });

      this._index(this.byTrainer, result.horse.trainerId, {
        raceId: data.raceId,
        trackId: data.trackId,
        distance: data.distance,
        fieldLength: data.fieldLength,
        position: index + 1,
        horseId: result.horse.id
      });

      this._index(this.byTrack, data.trackId, {
        raceId: data.raceId,
        distance: data.distance,
        fieldLength: data.fieldLength,
        position: index + 1,
        horseId: result.horse.id,
        trainerId: result.horse.trainerId
      });
    }
    console.log(this.byHorse);
  }

  _index(map, key, entry) {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }
  notify() {
    for ( let o of this.observers )
        o.update(this);
  }
  /* api */
  getHorse(id) {
    return this.horses[id];
  }
  getHorseName(id) {
    return this.horses[id].name;
  }
  getTrainerName(id) {
    return this.trainers[id].name;
  }
  getTrackName(id) {
    return this.tracks[id].name;
  }
    placingsFor(horseId, maxPlace=1) {
        if ( maxPlace < 1 ) return 0;
        const entries = this.byHorse.get(horseId); 
        if ( !entries ) return 0;

        return entries.reduce((count, entry) => {
            return count + (entry.position <= maxPlace ? 1 : 0);
        }, 0);
    }
    runsFor(horseId) {
        const entries = this.byHorse.get(horseId); 
        return entries.length;
    }
    topTrainersByPlacings(maxPlace = 3, limit = 3) {
    const stats = [];

    for (const [trainerId, entries] of this.byTrainer.entries()) {
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

  horseIds.forEach(horseId => {
    const entries = this.byHorse.get(horseId);

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
