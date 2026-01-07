import PayoutEvaluator from "./payout-evaluator.js";
import { randomFrom } from "./functions.js";

export default class SpinSimulator {
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
    spinReel(reel) {
        return randomFrom(reel);
    }
    go() {
        for (let i = 0; i < this.spins; i++) {
            this.totalWagered += this.betPerSpin;

            // Spin all reels
            const result = this.reels.map(this.spinReel);

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
        this.go();
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