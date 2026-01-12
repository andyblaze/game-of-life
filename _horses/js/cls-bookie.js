import { mt_rand } from "./functions.js";
export default class Bookie {
  constructor(id) {
    this.id = id;
    this.totalStaked = 0;
    this.totalPayout = 0;
    this.overround = 1.1;
    this.baseWeight = 0.15;
    this.odds = {};
  }

priceRace(race, formAPI) {
  const entrants = race.entrants;
  this.odds = {};
  const overround = this.overround;

  // get form scores
  const entrantIds = entrants.map(h => h.id);
  const scores = formAPI.normalisedScoresFor(entrantIds);

  // compute weights for each horse
  const weights = new Map();
  let totalWeight = 0;
  //const epsilon = 0.01; // tiny baseline for zero-score horses

  entrants.forEach(horse => {
    const runs = formAPI.runsFor(horse.id);
    const confidence = Math.min(1, runs / 5);
    const score = scores.get(horse.id) || 0; // 0 if no form
    const weight = score * confidence + this.baseWeight;
    //const weight = score + epsilon;
    weights.set(horse.id, weight);
    totalWeight += weight;
  });

  // compute odds
  entrants.forEach(horse => {
    const weight = weights.get(horse.id);
    let fairProb = weight / totalWeight;          // 0..1
    fairProb *= overround;     //console.log(fairProb);                   // inflate for bookie profit
    const decimalOdds = 1 / fairProb;
    this.odds[horse.id] = {
      odds: decimalOdds
    };
  });
//console.log(odds);
  return this.odds;
}



  settleRace(results, odds) {
    const winner = results[0].horse.id;

    if (this.odds[winner]) {
      const bet = this.odds[winner];
      const payout = bet.stake * bet.odds;
      this.totalPayout += payout;
    }
  }

  getProfit() {
    return this.totalPayout - this.totalStaked;
  }
}
