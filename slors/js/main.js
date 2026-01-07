import { config } from "./config.js";

class PayoutEvaluator {
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
function spinReel(reel) {
  const index = Math.floor(Math.random() * reel.length);
  return reel[index];
}

class SpinSimulator {
    constructor(spins = 10000, betPerSpin = 1, config) {
        this.spins = spins;
        this.betPerSpin = betPerSpin;
        this.evaluator = new PayoutEvaluator(config);
        this.reels = Object.values(config.reels);
        this.totalWagered = 0;
        this.totalPaid = 0;

        this.wins = 0;
        this.losses = 0;

        this.currentLosingStreak = 0;
        this.longestLosingStreak = 0;

        this.hitCounts = {};   // payout key -> count
        this.symbolCounts = {}; // symbol -> count
    }
    go() {
        for (let i = 0; i < this.spins; i++) {
            this.totalWagered += this.betPerSpin;

            // Spin all reels
            const result = this.reels.map(spinReel);

            // Track symbol frequency
            result.forEach(sym => {
            this.symbolCounts[sym] = (this.symbolCounts[sym] || 0) + 1;
            });

            // Evaluate payout
            const outcome = this.evaluator.evaluate(result);

            if (outcome.win) {
            this.wins++;
            this.totalPaid += outcome.amount;
            this.currentLosingStreak = 0;

            const key = result.join(",");
            this.hitCounts[key] = (this.hitCounts[key] || 0) + 1;
            } else {
            this.losses++;
            this.currentLosingStreak++;
            this.longestLosingStreak = Math.max(
                this.longestLosingStreak,
                this.currentLosingStreak
            );
            }
        }        
    }
    stats() {
        return {
            spins: this.spins,
            totalWagered: this.totalWagered,
            totalPaid: this.totalPaid,
            profit: this.totalWagered - this.totalPaid,
            rtp: this.totalPaid / this.totalWagered,
            wins: this.wins,
            losses: this.losses,
            winRate: this.wins / this.spins,
            longestLosingStreak: this.longestLosingStreak,
            hitCounts: this.hitCounts,
            symbolCounts: this.symbolCounts
        };        
    }
    log() {
        const stats = this.stats();
        console.table({
        Spins: stats.spins,
        Wagered: stats.totalWagered,
        Paid: stats.totalPaid,
        Profit: stats.profit,
        RTP: stats.rtp.toFixed(4),
        WinRate: stats.winRate.toFixed(4),
        LongestLosingStreak: stats.longestLosingStreak
        });
        console.log("Hit counts:", stats.hitCounts);
        console.log("Symbol counts:", stats.symbolCounts);
    }
}

$(document).ready(async function() { 
    const sim = new SpinSimulator(100000, 1, config);
    sim.go();
    sim.log();
});
