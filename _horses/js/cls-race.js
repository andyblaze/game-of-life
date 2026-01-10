import RaceResolver from "./cls-raceresolver.js";

export default class Race {
    static type = "race";
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
   /// this.results = RaceResolver.resolve(this.track, this.distance, this.entrants, this.trainers);
    const form = {
        trackId: this.track.id,
        raceId: this.id,
        distance: this.distance,
        results: RaceResolver.resolve(this.track, this.distance, this.entrants, this.trainers)
      };
    /*for ( const[index, result] of this.results.entries() ) //.forEach((horse, index) => {      
        form.results.push({
          horseId: result.horse.id,
          trainerId: result.horse.trainerId,
          position: index + 1,
      });*/
    return form;//this.results;
  }
}
