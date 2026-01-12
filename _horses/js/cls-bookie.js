export default class Bookie {
  constructor(id) {
    this.id = id;
    this.totalStaked = 0;
    this.totalPayout = 0;
    this.overround = 1.05;
  }

  priceRace(race, formAPI) {
  const entrants = race.entrants;
  const odds = {};
  const stake = 1;
  const n = entrants.length;
  const entrantIds = [];
  entrants.forEach(horse => {
    entrantIds.push(horse.id);
  });
  const form = formAPI.normalisedScoresFor(entrantIds);

  const price = n / this.overround; // 1.05
  
  entrants.forEach(horse => {
    odds[horse.id] = {
      odds: price,
      stake: stake
    };
    this.totalStaked += stake;
  });
  return odds;
}


  settleRace(results, odds) {
    const winner = results[0].horse.id;

    if (odds[winner]) {
      const bet = odds[winner];
      const payout = bet.stake * bet.odds;
      this.totalPayout += payout;
    }
  }

  getProfit() {
    return this.totalPayout - this.totalStaked;
  }
}
