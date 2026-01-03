export default class BingoScorer {
    /**
     * prizeMap: map pattern names to prize/points
     * Example:
     * { row: 1, column: 1, full: 10, corners: 2 }
     */
    constructor(prizeMap = {}) {
        // default prizes if none provided
        this.prizeMap = Object.assign({
            row: 1,
            column: 1,
            full: 10,
            corners: 2,
            diagonal: 3
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

    /**
     * Convenience method: total prize for current card
     */
    totalScore() {
        return this.scores.reduce((sum, s) => sum + s.prize, 0);
    }
}
