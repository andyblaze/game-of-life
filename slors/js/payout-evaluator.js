export default class PayoutEvaluator {
  constructor(config) {
    this.payouts = config.payouts;
    this.symbols = config.symbols;
    this.betUnit = config.payoutModel.betUnit;
    this.defaultPayout = config.defaultPayout;
  }

  evaluate(result) {
    const tmp = [...result];
    const hasWild = tmp.includes("WILD");
    if ( hasWild === false ) {
        if ( tmp[0] === tmp[1] && tmp[0] !== tmp[2] )
            tmp[2] = "";
    }
    const key = tmp.join(","); //console.log(key);
    const payout = this.payouts[key] || this.defaultPayout;
    const tier = this.symbols[tmp[0]].tier;

    return (payout > 0)
        ? { win: true, amount: payout, tier }
        : { win: false, amount: 0 };
  }
}