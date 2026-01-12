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
    //console.log(this.byHorse);
  }

  _index(map, key, entry) {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }
  notify() {
    for ( let o of this.observers )
        o.update(this);
  }
}
