import RaceResolver from "./cls-raceresolver.js";

export default class Race {
  constructor(id, track, distance, entrants, trainers) {
    this.id = id;
    this.track = track;        // Track object
    this.distance = distance;  // integer (meters)
    this.entrants = entrants;  // array of Horse objects
    this.trainers = trainers;

    this.results = [];         // Will store finishing order
  }

  run() {
    // Use RaceResolver to compute results
    this.results = RaceResolver.resolve(this.track, this.distance, this.entrants, this.trainers);

    // Update horse race histories
    this.results.forEach((horseResult, index) => {
      horseResult.horse.addRaceResult({
        raceId: this.id,
        position: index + 1,
        distance: this.distance,
        trackId: this.track.id
      });
    });

    return this.results;
  }
}
