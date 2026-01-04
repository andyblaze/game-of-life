export default class BingoScorer {
    constructor(prizeMap = {}) {
        // default prizes if none provided
        this.prizeMap = Object.assign({
            row: 8,
            column: 8,
            diagonal: 12,
            corners: 15,
            full: 35
        }, prizeMap);
        this.scores = [];
    }
    /**
     * Calculate which patterns the card currently has
     * Returns an array of { pattern, prize } objects
     */
    calculate(card) { 
        const winningLines = card.getWinningLines();
        if ( winningLines.length > 0 ) {
            for ( const line of winningLines )
            this.scores.push({ pattern: line.type, prize: this.prizeMap[line.type] });
        }
        return this.scores;
    }
    totalScore() { // total prize for current card
        return this.scores.reduce((sum, s) => sum + s.prize, 0);
    }
}
