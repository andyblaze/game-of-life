export default class Bookie {
  constructor(id) {
    this.id = id;
    this.totalStaked = 0;
    this.totalPayout = 0;
  }

  priceRace(race, formbook) {
  const entrants = race.entrants;
  const odds = {};
  const stake = 1;
  const n = entrants.length;

  const overround = this.overround || 1.05; // 5% edge by default

  const price = n / overround;
  const entrantIds = [];
  
  entrants.forEach(horse => {
    entrantIds.push(horse.id);
    odds[horse.id] = {
      odds: price,
      stake: stake
    };
    this.totalStaked += stake;
  });
  console.log(formbook.normalisedScoresFor(entrantIds));
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
