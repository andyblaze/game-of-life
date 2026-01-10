export default class FormBook {
  constructor() {
    //this.raceHistory = [];

    this.byHorse = new Map();    // horseId -> [entries]
    this.byTrainer = new Map();  // trainerId -> [entries]
    this.byTrack = new Map();    // trackId -> [entries]
  }

  addRaceResult(form) { console.log(form);
    //this.raceHistory.push(form);

    for ( const [index, result] of form.results.entries() ) {
      this._index(this.byHorse, result.horseId, {
        raceId: form.raceId,
        trackId: form.trackId,
        distance: form.distance,
        position: result.position
      });

      this._index(this.byTrainer, result.trainerId, {
        raceId: form.raceId,
        trackId: form.trackId,
        distance: form.distance,
        position: result.position,
        horseId: result.horseId
      });

      this._index(this.byTrack, form.trackId, {
        raceId: form.raceId,
        distance: form.distance,
        position: result.position,
        horseId: result.horseId,
        trainerId: result.trainerId
      });
    }
  }

  _index(map, key, entry) {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(entry);
  }
}
