export default class BingoScorer { 
    constructor(prizeMap) {
        // default prizes if none provided
        this.prizeMap = prizeMap;
        this.scores = [];
        this.incoming = 0;
        this.outgoing = 0;
        this.profit = 0;
    }
    /**
     * Calculate which patterns the card currently has
     * Returns an array of { pattern, prize } objects
     */
    calculate(card) { 
        const winningLines = card.getWinningLines();
        if ( winningLines.length > 0 ) { //console.log(winningLines);
            for ( const line of winningLines )
            this.scores.push({ pattern: line.type, prize: this.prizeMap[line.type] });
        }
        return this.scores;
    }
    totalScore() { // total prize for current card(s)
        const s = this.scores.reduce((sum, s) => sum + s.prize, 0);
        this.outgoing += s;
        return s;
    }
    reset() {
        this.scores = [];
    }
    getProfit() {
        const p = this.incoming - this.outgoing;
        return `Income: ${this.incoming}, Outgoings: ${this.outgoing}, Profit: ${p}`;
    }
}
