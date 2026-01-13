import { clamp, mt_rand } from "./functions.js";

function exponentiateWeight(weight, exponent = 1.5) {
  return Math.pow(weight, exponent);
}
function powerTransformScore(score, power = 2) {
  return Math.pow(score, power);
}


export default class Bookie {
  constructor(id) {
    this.id = id;
    this.totalStaked = 0;
    this.totalPayout = 0;
    this.overround = 1.1;
    this.baseWeight = 0.15;
    this.odds = {};
    this.stakes = {};
  }

priceRace(race, formAPI) {
  const entrants = race.entrants; 
  this.odds = {};
  this.stakes = {};
  const overround = this.overround;

  // get form scores
  const entrantIds = entrants.map(h => h.id);
  const scores = formAPI.normalisedScoresFor(entrantIds);

  // compute weights for each horse
  const weights = new Map();
  let totalWeight = 0;
  //const epsilon = 0.01; // tiny baseline for zero-score horses

  entrants.forEach(horse => {
    this.stakes[horse.id] = 0;
    const runs = formAPI.runsFor(horse.id);
    const confidence = Math.min(1, runs / 5);
    let score = scores.get(horse.id) || 0; // 0 if no form
    score =  powerTransformScore(score, 2);
    // reliability (top-3 placings)
    let placeRate = runs > 0
      ? formAPI.placingsFor(horse.id, 3) / runs
      : 0;
    placeRate = clamp(placeRate, 0, 1);
  // 👇 THIS IS THE IMPORTANT LINE
  const reliabilityBoost = 1 + (placeRate * 0.75); // tunable, < 1
    let weight =
    (score * reliabilityBoost) * confidence
    + this.baseWeight;
    //weight = exponentiateWeight(weight, 1.6);
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
  return { odds: this.odds, stakes: this.stakes };
}
    adjustOdds1(horseId, stake) {
        this.stakes[horseId] += stake;
        this.totalStaked += stake;
    }
adjustOdds(horseId, stake) {
    // ensure odds exist
    if (!this.odds[horseId]) {
        console.warn(`Horse ${horseId} has no odds yet, initializing to 10`);
        this.odds[horseId] = { odds: 10 }; // default starting odds
    }

    // ensure stakes exist
    if (!this.stakes[horseId]) this.stakes[horseId] = 0;

    this.stakes[horseId] += stake;
    this.totalStaked += stake;

    // compute total probability safely
    let totalProb = 0;
    Object.values(this.odds).forEach(o => {
        const prob = 1 / (o.odds || 10); // fallback if odds missing
        totalProb += prob;
    });

    // compute new probability for this horse
    const currentProb = 1 / this.odds[horseId].odds;
    const weight = 0.05 * (stake / this.totalStaked);
    let newProb = currentProb + weight;
    newProb = Math.min(newProb, 0.99);

    this.odds[horseId].odds = 1 / newProb;

    // adjust others safely
    const others = Object.keys(this.odds).filter(id => parseInt(id) !== horseId);
    const adjustment = weight / others.length;
    others.forEach(id => {
        const prob = 1 / this.odds[id].odds;
        const newOtherProb = Math.max(prob - adjustment, 0.01);
        this.odds[id].odds = 1 / newOtherProb;
    });

    return { odds: this.odds, stakes: this.stakes };
}




  settleRace(results) {
    const winner = results[0].horse.id;

    if (this.odds[winner]) { 
      //const bet = this.stakes[winner];
      const payout = this.stakes[winner] * this.odds[winner].odds;
      this.totalPayout += payout;
      console.log(
        winner, this.stakes[winner] , this.odds[winner].odds,
        payout, this.totalPayout, this.totalStaked, this.totalStaked - payout
      );
    }
  }

  getProfit() {
    return this.totalPayout - this.totalStaked;
  }
}
