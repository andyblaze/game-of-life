export default class FormBook {
    constructor() {
        this.raceHistory = [];
    }
  
    addRaceResult(result) {
        this.raceHistory.push(result);
    }

  winCount(horse) {
    return this.raceHistory.filter(r => r.position === 1).length;
  }

  averagePosition(horse) {
    if ( this.raceHistory.length === 0 ) return null;
    return this.raceHistory.reduce((a, r) => a + r.position, 0) / this.raceHistory.length;
  }
}